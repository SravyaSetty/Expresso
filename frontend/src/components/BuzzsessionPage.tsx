import { useState, useEffect, useMemo } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowLeft, MessageSquare, ChevronUp, ChevronDown, Flag, Search, Hash, Trash2 } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { SharedNavigation } from "./SharedNavigation";
import axios from "axios";

interface BuzzsessionPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
  onSelectPost: (postId: string) => void;
  userId: string;
}

interface Post {
    _id: string;
    title: string;
    content?: string;
    author: { _id: string, username: string };
    upvotes: string[];
    downvotes: string[];
    comments: string[];
    tags: string[];
    createdAt: string;
}

export function BuzzsessionPage({ onBack, onNavigate, onSelectPost, userId }: BuzzsessionPageProps) {
  const { selectedColor } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [popularTags, setPopularTags] = useState<string[]>([]);

  const fetchPosts = () => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/posts`)
      .then(res => { setPosts(res.data); setIsLoading(false); })
      .catch(err => { console.error("Failed to fetch posts", err); setIsLoading(false); });
  }

  useEffect(() => {
    fetchPosts();
    // Fetch popular tags
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/posts/tags/popular`)
        .then(res => setPopularTags(res.data))
        .catch(err => console.error("Failed to fetch popular tags", err));
  }, []);
  
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = searchTerm === "" || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.content && post.content.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesTag = selectedTag === null || post.tags?.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [posts, searchTerm, selectedTag]);

  const handleVote = async (e: React.MouseEvent, postId: string, voteType: 'up' | 'down') => {
    e.stopPropagation();
    const originalPosts = [...posts];
    const newPosts = posts.map(p => {
        if (p._id === postId) {
            const upvoted = p.upvotes.includes(userId);
            const downvoted = p.downvotes.includes(userId);
            const newUpvotes = p.upvotes.filter(id => id !== userId);
            const newDownvotes = p.downvotes.filter(id => id !== userId);
            if (voteType === 'up' && !upvoted) newUpvotes.push(userId);
            if (voteType === 'down' && !downvoted) newDownvotes.push(userId);
            return { ...p, upvotes: newUpvotes, downvotes: newDownvotes };
        }
        return p;
    });
    setPosts(newPosts);
    try {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/posts/${postId}/vote`, { userId, voteType });
    } catch (error) {
        console.error("Vote failed, reverting UI", error);
        setPosts(originalPosts);
    }
  };

  const handleDelete = async (e: React.MouseEvent, postId: string) => {
      e.stopPropagation();
      if (window.confirm("Are you sure you want to delete this post? This cannot be undone.")) {
          try {
              await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/posts/${postId}`, { data: { userId } });
              setPosts(posts.filter(p => p._id !== postId));
          } catch (error) {
              console.error("Failed to delete post", error);
              alert("You are not authorized to delete this post or an error occurred.");
          }
      }
  };


  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-100">Loading posts...</div>;

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <header className="flex items-center justify-between p-4 bg-white border-b sticky top-0 z-10">
        <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft className="w-5 h-5" /></Button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center ml-2" style={{ backgroundColor: selectedColor }}><span className="text-white text-sm">M</span></div>
            <span className="text-sm font-semibold">Buzzsession</span>
        </div>
        <SharedNavigation onNavigate={onNavigate} currentPage="buzzsession" />
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="bg-white p-3 rounded-xl border flex items-center gap-4 mb-4 shadow-sm">
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input placeholder="Search posts, tags, or topics..." className="pl-14 h-12 text-base border-none focus-visible:ring-0" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <Button className="text-white h-12 px-6 rounded-lg" style={{backgroundColor: selectedColor}} onClick={() => onNavigate('create-post')}>Post</Button>
        </div>

        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            <button onClick={() => setSelectedTag(null)} className={`text-sm px-4 py-2 rounded-full transition-colors ${selectedTag === null ? 'text-white font-semibold' : 'bg-white text-gray-700 hover:bg-gray-200'}`} style={{backgroundColor: selectedTag === null ? selectedColor : undefined}}>All</button>
            {popularTags.map(tag => (
                <button key={tag} onClick={() => setSelectedTag(tag)} className={`text-sm px-4 py-2 rounded-full transition-colors flex items-center gap-1.5 whitespace-nowrap ${selectedTag === tag ? 'text-white font-semibold' : 'bg-white text-gray-700 hover:bg-gray-200'}`} style={{backgroundColor: selectedTag === tag ? selectedColor : undefined}}>
                    <Hash size={14}/> {tag}
                </button>
            ))}
        </div>

        <div className="space-y-1">
            {filteredPosts.map(post => {
                const voteScore = post.upvotes.length - post.downvotes.length;
                const userVote = post.upvotes.includes(userId) ? 'up' : post.downvotes.includes(userId) ? 'down' : null;

                return (
                    <div key={post._id} className="flex gap-4 p-4 rounded-lg cursor-pointer hover:bg-white" onClick={() => onSelectPost(post._id)}>
                        <div className="flex flex-col items-center text-gray-500 space-y-1 pt-1">
                            <button onClick={(e) => handleVote(e, post._id, 'up')} className={`p-1 rounded-full hover:bg-gray-200 ${userVote === 'up' ? 'text-blue-500' : ''}`}><ChevronUp size={22}/></button>
                            <span className="font-bold text-base text-black">{voteScore}</span>
                            <button onClick={(e) => handleVote(e, post._id, 'down')} className={`p-1 rounded-full hover:bg-gray-200 ${userVote === 'down' ? 'text-red-500' : ''}`}><ChevronDown size={22}/></button>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                            <p className="text-gray-700 text-sm mb-4 line-clamp-3">{post.content}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {post.tags?.map(tag => (
                                    <span key={tag} className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-md">#{tag}</span>
                                ))}
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center gap-4">
                                    <span>by {post.author.username}</span>
                                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                    <div className="flex items-center gap-1.5"><MessageSquare size={14}/><span>{post.comments.length} comments</span></div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {post.author._id === userId && (
                                        <button onClick={(e) => handleDelete(e, post._id)} className="p-1 hover:bg-red-100 text-gray-500 hover:text-red-600 rounded-full"><Trash2 size={14}/></button>
                                    )}
                                    <button onClick={(e) => { e.stopPropagation(); alert('Report functionality coming soon!'); }} className="p-1 hover:bg-gray-200 rounded-full"><Flag size={14}/></button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
      </main>
    </div>
  );
}