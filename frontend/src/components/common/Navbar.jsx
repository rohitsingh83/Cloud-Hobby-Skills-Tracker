import React from "react";
import { 
  Flame, Sparkles, LayoutDashboard, Compass, 
  Users, Cloud, LogOut, PlusCircle, ShieldCheck
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar({ activeTab, setActiveTab, onOpenLogModal, onOpenSkillModal, streak = 0 }) {
  const { user, logout, isCloudActive } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10 px-4 lg:px-8 py-3.5 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo with 3D Core Icon */}
        <div 
          onClick={() => setActiveTab("dashboard")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
            <div className="w-full h-full bg-space-900 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 group-hover:rotate-45 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
                SkillSphere
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold tracking-widest uppercase bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded">
                3D
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-0.5 font-mono">Cloud Hobby & Skills Hub</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-space-800/80 p-1.5 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "dashboard"
                ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab("skills")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "skills"
                ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Skills Galaxy</span>
          </button>

          <button
            onClick={() => setActiveTab("feed")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "feed"
                ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Community Feed</span>
          </button>

          <button
            onClick={() => setActiveTab("architecture")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "architecture"
                ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>Cloud Architecture</span>
          </button>
        </nav>

        {/* Right Actions & Profile */}
        <div className="flex items-center gap-3">
          
          {/* Quick Log Action */}
          <button
            onClick={onOpenLogModal}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-lg shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Log Practice</span>
          </button>

          {/* Cloud Connection Badge */}
          <div 
            title={isCloudActive ? "Connected to Live Google Firebase Cloud" : "Running in Zero-Friction Preview Mode"} 
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-space-800 border border-white/5 text-[11px] font-mono text-slate-300"
          >
            <span className={`w-2 h-2 rounded-full ${isCloudActive ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'}`} />
            <span className="hidden lg:inline">{isCloudActive ? "Firebase Live" : "Cloud Ready"}</span>
          </div>

          {/* User Avatar & Logout */}
          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <img
                src={user.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                alt={user.name}
                className="w-8 h-8 rounded-full border border-cyan-500/40 object-cover"
              />
              <button
                onClick={logout}
                title="Logout / Switch User"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
