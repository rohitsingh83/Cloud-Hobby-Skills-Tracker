import React from "react";
import { 
  Flame, Clock, Target, Award, ArrowUpRight, 
  Sparkles, Calendar, Plus, CheckCircle2, ChevronRight 
} from "lucide-react";
import HeroScene from "../components/3d/HeroScene";
import SkillCard3D from "../components/3d/SkillCard3D";

export default function Dashboard({ 
  skills, goals, logs, stats, 
  onOpenLogModal, onOpenSkillModal, setActiveTab 
}) {
  const activeSkillsCount = skills.filter(s => s.status === "ACTIVE").length;
  const completedGoalsCount = goals.filter(g => g.status === "COMPLETED").length;

  return (
    <div className="space-y-10 pb-16">
      
      {/* 3D HERO SECTION WITH INTERACTIVE SKILL GALAXY */}
      <section className="relative w-full rounded-3xl glass-panel border border-cyan-500/20 overflow-hidden shadow-2xl shadow-cyan-950/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[460px]">
          
          {/* Left Column: Mission & Metrics */}
          <div className="lg:col-span-6 p-8 lg:p-12 z-10 flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>CLOUD-NATIVE REALTIME SYNC</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
              Master Any Skill. <br />
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Tracked on the Cloud.
              </span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed max-w-lg">
              Log daily practice sessions, build compounding streaks, store verified proof in Cloud Object Storage, and share milestone triumphs with your peers.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenLogModal}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-cyan-400 hover:bg-cyan-300 text-black shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <span>Log Today's Practice</span>
                <ArrowUpRight className="w-4 h-4 stroke-[3]" />
              </button>

              <button
                onClick={onOpenSkillModal}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Skill</span>
              </button>
            </div>
          </div>

          {/* Right Column: 3D WebGL Three.js Canvas */}
          <div className="lg:col-span-6 relative w-full h-[380px] lg:h-full flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-space-900 via-transparent to-transparent lg:hidden z-10 pointer-events-none" />
            <HeroScene />
          </div>
        </div>
      </section>

      {/* COMPREHENSIVE STATS OVERVIEW CARDS */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Streak Card */}
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/20 hover:border-amber-500/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-mono font-semibold uppercase">Daily Streak</span>
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Flame className="w-5 h-5 fill-amber-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white">{stats.current_streak || 0} <span className="text-sm font-normal text-slate-400">days</span></div>
            <p className="text-[11px] text-slate-400 mt-1">Best streak: {stats.longest_streak || 0} days</p>
          </div>
        </div>

        {/* Practice Hours */}
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-cyan-400">
            <span className="text-xs font-mono font-semibold uppercase">Total Hours</span>
            <div className="p-2 rounded-lg bg-cyan-500/10">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white">{stats.total_hours || 0} <span className="text-sm font-normal text-slate-400">hrs</span></div>
            <p className="text-[11px] text-slate-400 mt-1">Calculated across all hobbies</p>
          </div>
        </div>

        {/* Active Skills */}
        <div className="glass-panel p-5 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-purple-400">
            <span className="text-xs font-mono font-semibold uppercase">Active Skills</span>
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white">{activeSkillsCount} <span className="text-sm font-normal text-slate-400">skills</span></div>
            <p className="text-[11px] text-slate-400 mt-1">Pursuing active milestones</p>
          </div>
        </div>

        {/* Goals Mastered */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-mono font-semibold uppercase">Goals Target</span>
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white">{completedGoalsCount} / {goals.length}</div>
            <p className="text-[11px] text-slate-400 mt-1">Milestone targets achieved</p>
          </div>
        </div>
      </section>

      {/* WEEKLY ACTIVITY BREAKDOWN & GOAL PROGRESS */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Minutes Bar Chart */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Weekly Practice Rhythm</span>
              </h3>
              <span className="text-xs font-mono text-cyan-400">Last 7 Days</span>
            </div>
            
            {/* Visual Bar Graph */}
            <div className="grid grid-cols-7 gap-2 items-end h-40 pt-4">
              {Object.entries(stats.weekly_minutes_map || {}).map(([day, mins]) => {
                const max = 150;
                const heightPct = Math.min(100, Math.max(15, (mins / max) * 100));
                return (
                  <div key={day} className="flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-[10px] text-slate-400 font-mono">{mins}m</span>
                    <div 
                      style={{ height: `${heightPct}%` }}
                      className="w-full rounded-lg bg-gradient-to-t from-cyan-600 via-cyan-400 to-purple-400 shadow-sm shadow-cyan-500/30 transition-all duration-500 hover:brightness-125"
                    />
                    <span className="text-xs font-semibold text-slate-300">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <p className="text-[11px] text-slate-400 pt-4 border-t border-white/5 mt-4">
            Aggregated in real-time via Serverless Event Handlers.
          </p>
        </div>

        {/* Goals & Milestones Progress */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Learning Goals & Milestones</span>
              </h3>
              <span className="text-xs text-slate-400">Capped at 100% target</span>
            </div>

            <div className="space-y-4">
              {goals.map((goal) => {
                const pct = Math.min(100, Math.round((goal.current_value / goal.target_value) * 100));
                return (
                  <div key={goal.goal_id} className="p-4 rounded-xl bg-space-800/80 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">{goal.title}</h4>
                      <span className="text-xs font-mono font-bold text-cyan-400">{pct}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2.5 rounded-full bg-space-900 overflow-hidden border border-white/5">
                      <div 
                        style={{ width: `${pct}%` }}
                        className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-700"
                      />
                    </div>

                    {/* Milestones chips */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {(goal.milestones || []).map((m) => (
                        <div 
                          key={m.milestone_id}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] border ${
                            m.achieved 
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
                              : "bg-space-900/60 text-slate-400 border-white/5"
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{m.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS SECTION WITH 3D INTERACTIVE TILT CARDS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Active Hobbies & Skills</h2>
            <p className="text-xs text-slate-400">Interactive 3D perspective cards with dynamic lighting and category themes</p>
          </div>
          <button 
            onClick={() => setActiveTab("skills")}
            className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>Explore All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.slice(0, 4).map((skill) => (
            <SkillCard3D 
              key={skill.skill_id} 
              skill={skill} 
              onLogPractice={onOpenLogModal}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
