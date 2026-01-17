const router = require('express').Router();
const Post = require('../models/post.model');
const Comment = require('../models/comment.model');
const User = require('../models/user.model'); // Needed for populating author

// GET all posts for the main feed
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username') // Only get the username
      .sort({ createdAt: -1 }); // Show newest posts first
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new post
router.post('/', async (req, res) => {
  try {
    const { title, content, authorId, tags } = req.body;
    if (!Array.isArray(tags)) {
        return res.status(400).json({ message: "Tags must be an array." });
    }
    // Sanitize tags: make them lowercase and remove empty strings
    const sanitizedTags = tags.map(tag => tag.trim().toLowerCase()).filter(tag => tag);
    
    const newPost = new Post({ title, content, author: authorId, tags: sanitizedTags });
    await newPost.save();
    const populatedPost = await Post.findById(newPost._id).populate('author', 'username');
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:postId', async (req, res) => {
    try {
        const { userId } = req.body; // The user attempting to delete
        const post = await Post.findById(req.params.postId);

        if (!post) return res.status(404).json({ message: "Post not found." });

        // Authorization check: only the author can delete
        if (post.author.toString() !== userId) {
            return res.status(403).json({ message: "User not authorized to delete this post." });
        }

        // Delete all comments associated with the post first
        await Comment.deleteMany({ _id: { $in: post.comments } });
        await post.deleteOne();

        res.json({ message: 'Post deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/comments/:commentId', async (req, res) => {
    try {
        const { userId } = req.body;
        const comment = await Comment.findById(req.params.commentId);

        if (!comment) return res.status(404).json({ message: "Comment not found." });

        if (comment.author.toString() !== userId) {
            return res.status(403).json({ message: "User not authorized to delete this comment." });
        }

        // Remove comment reference from the parent post
        await Post.updateOne({ _id: comment.post }, { $pull: { comments: comment._id } });
        await comment.deleteOne();

        res.json({ message: 'Comment deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/tags/popular', async (req, res) => {
    try {
        const popularTags = await Post.aggregate([
            { $unwind: "$tags" }, // Deconstruct the tags array
            { $group: { _id: "$tags", count: { $sum: 1 } } }, // Group by tag and count occurrences
            { $match: { count: { $gte: 10 } } }, // Filter for tags with count >= 10
            { $sort: { count: -1 } }, // Sort by most popular
            { $project: { _id: 0, tag: "$_id" } } // Reshape the output
        ]);
        res.json(popularTags.map(t => t.tag));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET a single post and its comments
router.get('/:postId', async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId)
        .populate('author', 'username')
        .populate({
          path: 'comments',
          populate: {
            path: 'author',
            select: 'username' // Populate the author of each comment
          }
        });
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});


// POST a new comment on a post
router.post('/:postId/comments', async (req, res) => {
    try {
        const { text, authorId } = req.body;
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const newComment = new Comment({ text, author: authorId, post: post._id });
        await newComment.save();

        post.comments.push(newComment._id);
        await post.save();
        
        const populatedComment = await Comment.findById(newComment._id).populate('author', 'username');
        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// POST a vote on a post
router.post('/:postId/vote', async (req, res) => {
    try {
        const { userId, voteType } = req.body; // voteType should be 'up' or 'down'
        const post = await Post.findById(req.params.postId);

        if (!post) return res.status(404).json({ message: "Post not found" });

        // Remove user from both arrays to handle vote changes
        post.upvotes.pull(userId);
        post.downvotes.pull(userId);

        // Add user to the correct array if it's a new vote
        if (voteType === 'up') {
            post.upvotes.push(userId);
        } else if (voteType === 'down') {
            post.downvotes.push(userId);
        }

        await post.save();
        res.json({ upvotes: post.upvotes.length, downvotes: post.downvotes.length });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;