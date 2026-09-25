import React, { useState } from "react";
import { 
  Heart, MessageSquare, Share2, Image, 
  Send, Sparkles, Filter, CheckCircle2, User 
} from "lucide-react";
import { createCommunityPost, toggleLikePost, uploadMediaFile } from "../../services/dataService";
import { useAuth } from "../../context/AuthContext";

export default function CommunityFeed({ posts, setPosts, skills }) {
  const { user } = useAuth();
  const [newText, setNewText] = useState("");
  const [selectedSkill, setSelectedSkill] = useState(skills[0]?.skill_name || "General");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [commentingPostId, setCommentingPostId] = useState(null);
  const [commentText, setCommentText] = useState("");

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newText.trim() && !file) return;

    setUploading(true);
    try {
      let mediaUrl = null;
      if (file) {
        mediaUrl = await uploadMediaFile(file, "posts");
      }

      const post = await createCommunityPost({
        uid: user?.uid || "usr_cloud_demo_01",
        author_name: user?.name || "Alex Rivera",
        author_username: user?.username || "alex_clouddev",
        author_avatar: user?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        skill_name: selectedSkill,
        content: newText.trim(),
        media_url: mediaUrl
      });

      setPosts([post, ...posts]);
      setNewText("");
      setFile(null);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleLike = async (postId) => {
    const updated = await toggleLikePost(postId, user?.uid || "usr_cloud_demo_01");
    setPosts(updated);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>REAL-TIME COMMUNITY SOCIAL STREAM</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Community Achievements Feed</h1>
        <p className="text-xs text-slate-400">Share practice breakthroughs, proof certs, and celebrate consistency with peers</p>
      </div>

      {/* Post Creator Box */}
      <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 shadow-xl shadow-cyan-950/20">
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div className="flex gap-3">
            <img
              src={user?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
              alt="Avatar"
              className="w-10 h-10 rounded-full border border-cyan-500/40 object-cover flex-shrink-0"
            />
            <div className="w-full">
              <textarea
                rows={3}
                required
                placeholder="What skill milestone did you conquer today? Share your progress..."
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-space-800 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none placeholder:text-slate-500 resize-none"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
            <div className="flex items-center gap-3">
              
              {/* Skill Tag Selector */}
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-space-800 border border-white/10 text-[11px] font-semibold text-cyan-400 focus:outline-none"
              >
                {skills.map((s) => (
                  <option key={s.skill_id} value={s.skill_name}>{s.skill_name}</option>
                ))}
                <option value="General Mastery">General Mastery</option>
              </select>

              {/* Upload Proof Button */}
              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 cursor-pointer transition-colors">
                <Image className="w-4 h-4 text-cyan-400" />
                <span className="text-[11px]">{file ? file.name.slice(0, 14) + "..." : "Attach Media"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={uploading || (!newText.trim() && !file)}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-black shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{uploading ? "Publishing..." : "Broadcast Update"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Community Stream */}
      <div className="space-y-6">
        {posts.map((post) => (
          <article 
            key={post.post_id} 
            className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 hover:border-white/20 transition-all"
          >
            {/* Author Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.author_avatar}
                  alt={post.author_name}
                  className="w-10 h-10 rounded-full border border-white/10 object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{post.author_name}</h3>
                    <span className="text-[10px] text-slate-400">@{post.author_username}</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    {post.skill_name}
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* Post Content */}
            <p className="text-xs text-slate-200 leading-relaxed">
              {post.content}
            </p>

            {/* Media Attachment (Cloud Object Storage) */}
            {post.media_url && (
              <div className="relative rounded-xl overflow-hidden border border-white/10 max-h-[360px] bg-space-800">
                <img
                  src={post.media_url}
                  alt="Proof of Practice"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}

            {/* Interaction Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs text-slate-400">
              <div className="flex items-center gap-4">
                
                {/* Like Button */}
                <button
                  onClick={() => handleLike(post.post_id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    post.liked_by_me 
                      ? "text-pink-400 bg-pink-500/10 border border-pink-500/30 font-bold" 
                      : "hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.liked_by_me ? 'fill-pink-400' : ''}`} />
                  <span>{post.likes_count}</span>
                </button>

                {/* Comment Counter */}
                <button
                  onClick={() => setCommentingPostId(commentingPostId === post.post_id ? null : post.post_id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.comments_count || 0}</span>
                </button>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Cloud Proof</span>
              </div>
            </div>

            {/* Inline Comment Drawer */}
            {commentingPostId === post.post_id && (
              <div className="pt-3 border-t border-white/5 space-y-2 animate-fade-in">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Leave supportive feedback or ask about their technique..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-space-800 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      if (!commentText.trim()) return;
                      post.comments_count = (post.comments_count || 0) + 1;
                      setCommentText("");
                      setCommentingPostId(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-500 text-black text-xs font-bold hover:bg-cyan-400 transition-colors"
                  >
                    Reply
                  </button>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
