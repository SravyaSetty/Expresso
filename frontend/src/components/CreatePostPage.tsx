import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { ArrowLeft, Send, Hash } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import axios from "axios";

interface CreatePostPageProps {
  userId: string;
  onBack: () => void;
}

export function CreatePostPage({ userId, onBack }: CreatePostPageProps) {
  const { selectedColor } = useTheme();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Please enter a title for your post.");
      return;
    }
    setIsSubmitting(true);
    try {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/posts`, {
        title, content, authorId: userId, tags: tagsArray,
      });
      onBack();
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("There was an error creating your post.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <header className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft className="w-5 h-5" /></Button>
          <span className="text-sm font-medium">Create a New Post</span>
        </div>
      </header>
      <main className="max-w-3xl mx-auto p-4">
        <div className="bg-white p-6 rounded-xl border space-y-6">
          <div>
            <label htmlFor="post-title" className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <Input id="post-title" placeholder="What's on your mind?" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={150} />
          </div>
          <div>
            <label htmlFor="post-content" className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <Textarea id="post-content" placeholder="Add more details here..." value={content} onChange={(e) => setContent(e.target.value)} rows={8} />
          </div>
          <div>
            <label htmlFor="post-tags" className="block text-sm font-medium text-gray-700 mb-2">Hashtags</label>
            <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input id="post-tags" placeholder="e.g. anxiety, study, success" value={tags} onChange={(e) => setTags(e.target.value)} className="pl-9" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Separate tags with a comma.</p>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={!title.trim() || isSubmitting} className="text-white flex items-center gap-2" style={{ backgroundColor: selectedColor }}>
              <Send size={16} />{isSubmitting ? "Posting..." : "Post"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}