import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ArrowLeft, MessageSquare, ThumbsUp, ThumbsDown, Send } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import axios from "axios";
import { Textarea } from "./ui/textarea";

interface PostDetailPageProps {
  postId: string;
  userId: string; // Current logged-in user
  onBack: () => void;
}

interface User {
  _id: string;
  username: string;
}

interface Comment {
  _id: string;
  text: string;
  author: User;
  createdAt: string;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  author: User;
  upvotes: string[];
  downvotes: string[];
  comments: Comment[];
  createdAt: string;
}

export function PostDetailPage({ postId, userId, onBack }: PostDetailPageProps) {
  const { selectedColor } = useTheme();
  const [post, setPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/posts/${postId}`)
      .then(res => {
        setPost(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch post", err);
        setIsLoading(false);
      });
  }, [postId]);

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!post) return;
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/posts/${post._id}/vote`, { userId, voteType });
        // Optimistically update the UI, then set the real state
        const alreadyUpvoted = post.upvotes.includes(userId);
        const alreadyDownvoted = post.downvotes.includes(userId);

        const newUpvotes = [...post.upvotes];
        const newDownvotes = [...post.downvotes];

        // Remove existing votes
        if (alreadyUpvoted) newUpvotes.splice(newUpvotes.indexOf(userId), 1);
        if (alreadyDownvoted) newDownvotes.splice(newDownvotes.indexOf(userId), 1);

        // Add new vote
        if (voteType === 'up' && !alreadyUpvoted) newUpvotes.push(userId);
        if (voteType === 'down' && !alreadyDownvoted) newDownvotes.push(userId);
        
        setPost({ ...post, upvotes: newUpvotes, downvotes: newDownvotes });
    } catch (error) {
        console.error("Vote failed", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !post) return;
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/posts/${post._id}/comments`, {
            text: newComment,
            authorId: userId,
        });
        setPost({ ...post, comments: [...post.comments, response.data] });
        setNewComment("");
    } catch (error) {
        console.error("Failed to post comment", error);
    }
  };


  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading post...</div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center">Post not found.</div>;

  const voteScore = post.upvotes.length - post.downvotes.length;
  const userVote = post.upvotes.includes(userId) ? 'up' : post.downvotes.includes(userId) ? 'down' : null;

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <header className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft className="w-5 h-5" /></Button>
          <span className="text-sm font-medium line-clamp-1">{post.title}</span>
        </div>
      </header>
      <main className="max-w-3xl mx-auto p-4">
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-xs text-gray-500 mb-2">Posted by {post.author.username}</p>
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-6">{post.content}</p>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => handleVote('up')} className={`p-2 h-auto ${userVote === 'up' ? 'text-white' : ''}`} style={{backgroundColor: userVote === 'up' ? selectedColor : 'transparent'}}><ThumbsUp size={16}/></Button>
              <span className="font-bold text-sm">{voteScore}</span>
              <Button variant="ghost" size="sm" onClick={() => handleVote('down')} className={`p-2 h-auto ${userVote === 'down' ? 'bg-red-500 text-white' : ''}`}><ThumbsDown size={16}/></Button>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <MessageSquare size={16}/>
              <span className="text-sm">{post.comments.length} Comments</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border mt-4">
            <h3 className="text-lg font-semibold mb-4">Add a comment</h3>
            <div className="flex flex-col space-y-2">
                <Textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Share your thoughts..."/>
                <Button onClick={handleCommentSubmit} disabled={!newComment.trim()} className="self-end text-white" style={{backgroundColor: selectedColor}}>
                    <Send size={16} className="mr-2"/> Post Comment
                </Button>
            </div>
        </div>

        <div className="mt-6 space-y-4">
            {post.comments.map(comment => (
                <div key={comment._id} className="bg-white p-4 rounded-lg border">
                    <p className="text-sm text-gray-500 mb-2">
                        <span className="font-semibold">{comment.author.username}</span> - <span className="text-xs">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </p>
                    <p className="text-gray-800">{comment.text}</p>
                </div>
            ))}
        </div>
      </main>
    </div>
  );
}