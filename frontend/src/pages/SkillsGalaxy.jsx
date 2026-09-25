import React, { useState } from "react";
import { Search, Plus, Filter, Sparkles } from "lucide-react";
import SkillCard3D from "../components/3d/SkillCard3D";

const CATEGORIES = ["All", "Coding", "Music", "Photography", "Fitness", "Art", "Cooking", "Chess"];

export default function SkillsGalaxy({ skills, onOpenLogModal, onOpenSkillModal }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredSkills = skills.filter((s) => {
    const matchesCat = selectedCategory === "All" || s.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = s.skill_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (s.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || s.status === statusFilter;
    return matchesCat && matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-purple-400 bg-purple-500/10 border border-purple-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>3D INTERACTIVE SKILL PORTFOLIO</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Skills Galaxy</h1>
          <p className="text-xs text-slate-400">Curate, practice, and monitor your personal learning catalog</p>
        </div>

        <button
          onClick={onOpenSkillModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/25 transition-all transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Skill</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search skills, topics, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-space-800 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none placeholder:text-slate-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                  : "bg-space-800/80 text-slate-400 hover:text-white border border-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Skills Grid */}
      {filteredSkills.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-2xl border border-white/5">
          <p className="text-sm text-slate-400">No skills found matching your filters.</p>
          <button 
            onClick={onOpenSkillModal}
            className="mt-3 text-xs font-semibold text-cyan-400 hover:underline"
          >
            Create this skill now →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSkills.map((skill) => (
            <SkillCard3D
              key={skill.skill_id}
              skill={skill}
              onLogPractice={onOpenLogModal}
            />
          ))}
        </div>
      )}
    </div>
  );
}
