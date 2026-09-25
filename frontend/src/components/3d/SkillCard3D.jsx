import React, { useState } from "react";
import { 
  Code, Music, Camera, Activity, Palette, 
  Flame, Clock, ChevronRight, Award, Utensils,
  BookOpen, Sparkles, Sprout
} from "lucide-react";

export default function SkillCard3D({ skill, onLogPractice, onSelect }) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Dynamic Theme Config based on category
  const getTheme = (category = "") => {
    const cat = category.toLowerCase();
    if (cat.includes("code") || cat.includes("tech") || cat.includes("rust") || cat.includes("python")) {
      return {
        name: "Coding",
        glow: "rgba(0, 240, 255, 0.4)",
        border: "border-cyan-500/40",
        badgeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
        accent: "#00F0FF",
        icon: Code,
        animationType: "coding"
      };
    } else if (cat.includes("music") || cat.includes("guitar") || cat.includes("piano")) {
      return {
        name: "Music",
        glow: "rgba(245, 158, 11, 0.4)",
        border: "border-amber-500/40",
        badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        accent: "#F59E0B",
        icon: Music,
        animationType: "music"
      };
    } else if (cat.includes("photo") || cat.includes("video") || cat.includes("camera")) {
      return {
        name: "Photography",
        glow: "rgba(236, 72, 153, 0.4)",
        border: "border-pink-500/40",
        badgeBg: "bg-pink-500/10 text-pink-400 border-pink-500/30",
        accent: "#EC4899",
        icon: Camera,
        animationType: "photography"
      };
    } else if (cat.includes("fit") || cat.includes("health") || cat.includes("run") || cat.includes("workout")) {
      return {
        name: "Fitness",
        glow: "rgba(16, 185, 129, 0.4)",
        border: "border-emerald-500/40",
        badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        accent: "#10B981",
        icon: Activity,
        animationType: "fitness"
      };
    } else if (cat.includes("art") || cat.includes("paint") || cat.includes("draw")) {
      return {
        name: "Art",
        glow: "rgba(168, 85, 247, 0.4)",
        border: "border-purple-500/40",
        badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/30",
        accent: "#A855F7",
        icon: Palette,
        animationType: "art"
      };
    } else if (cat.includes("cook")) {
      return {
        name: "Cooking",
        glow: "rgba(239, 68, 68, 0.4)",
        border: "border-red-500/40",
        badgeBg: "bg-red-500/10 text-red-400 border-red-500/30",
        accent: "#EF4444",
        icon: Utensils,
        animationType: "cooking"
      };
    } else if (cat.includes("garden")) {
      return {
        name: "Gardening",
        glow: "rgba(34, 197, 94, 0.4)",
        border: "border-green-500/40",
        badgeBg: "bg-green-500/10 text-green-400 border-green-500/30",
        accent: "#22C55E",
        icon: Sprout,
        animationType: "gardening"
      };
    } else {
      return {
        name: "Skill",
        glow: "rgba(99, 102, 241, 0.4)",
        border: "border-indigo-500/40",
        badgeBg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
        accent: "#6366F1",
        icon: Sparkles,
        animationType: "general"
      };
    }
  };

  const theme = getTheme(skill.category || skill.skill_name);
  const IconComponent = theme.icon;

  // 3D Tilt calculation
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * 12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const totalHours = Math.round(((skill.total_minutes_practiced || 0) / 60) * 10) / 10;

  return (
    <div 
      className="perspective-1000 w-full"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
          boxShadow: isHovered ? `0 20px 40px -10px ${theme.glow}` : "none",
          transition: "transform 0.15s ease-out, box-shadow 0.25s ease-out"
        }}
        className={`preserve-3d relative rounded-2xl glass-panel p-6 border ${theme.border} overflow-hidden cursor-pointer flex flex-col justify-between min-h-[340px]`}
        onClick={() => onSelect && onSelect(skill)}
      >
        {/* Dynamic Category 3D Visual Header */}
        <div className="relative w-full h-36 rounded-xl bg-space-800/90 border border-white/5 overflow-hidden flex items-center justify-center mb-4">
          
          {/* 1. CODING: Matrix Matrix Circuit Visual */}
          {theme.animationType === "coding" && (
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="relative z-10 w-20 h-20 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex flex-col items-center justify-center shadow-lg shadow-cyan-500/30 transform group-hover:scale-110 transition-transform">
                <Code className="w-10 h-10 text-cyan-400 animate-pulse" />
                <div className="flex gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 opacity-60" />
                </div>
              </div>
            </div>
          )}

          {/* 2. MUSIC: Animated Soundwave Equalizer */}
          {theme.animationType === "music" && (
            <div className="absolute inset-0 flex items-center justify-center gap-1.5">
              <div className="absolute w-28 h-28 rounded-full border border-amber-500/30 animate-spin-slow" />
              {[32, 54, 24, 68, 45, 80, 40, 20].map((h, i) => (
                <div 
                  key={i} 
                  style={{ height: `${h}%`, animationDelay: `${i * 0.15}s` }}
                  className="w-2 bg-gradient-to-t from-amber-600 to-amber-300 rounded-full animate-pulse shadow-sm shadow-amber-500"
                />
              ))}
              <div className="absolute z-10 w-12 h-12 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400 flex items-center justify-center">
                <Music className="w-6 h-6 text-amber-300" />
              </div>
            </div>
          )}

          {/* 3. PHOTOGRAPHY: Optical Aperture Shutter */}
          {theme.animationType === "photography" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-pink-400/40 animate-spin-slow flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-pink-500/60 flex items-center justify-center bg-pink-950/40">
                  <Camera className="w-8 h-8 text-pink-400 animate-pulse" />
                </div>
              </div>
              <div className="absolute w-2 h-2 rounded-full bg-pink-400 shadow-lg shadow-pink-500 animate-ping" />
            </div>
          )}

          {/* 4. FITNESS: Pulsing Cardio Ring */}
          {theme.animationType === "fitness" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center animate-ping duration-1000 opacity-30" />
              <div className="w-20 h-20 rounded-full bg-emerald-950/80 border border-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Activity className="w-9 h-9 text-emerald-400 animate-bounce" />
              </div>
            </div>
          )}

          {/* 5. ART & GENERAL: Chromatic Palette */}
          {(theme.animationType === "art" || theme.animationType === "general" || theme.animationType === "cooking" || theme.animationType === "gardening") && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                style={{ background: `radial-gradient(circle, ${theme.accent}33 0%, transparent 70%)` }}
                className="w-32 h-32 rounded-full animate-pulse-glow"
              />
              <div className="relative z-10 w-20 h-20 rounded-2xl bg-space-700/80 border border-white/15 flex items-center justify-center shadow-lg">
                <IconComponent style={{ color: theme.accent }} className="w-10 h-10 animate-float-slow" />
              </div>
            </div>
          )}

          {/* Level Pill */}
          <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md bg-black/40 border border-white/10 text-slate-300">
            {skill.current_level}
          </div>
        </div>

        {/* Skill Details */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${theme.badgeBg}`}>
              {skill.category}
            </span>
            <div className="flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>{skill.current_streak || 0}d streak</span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-cyan-400 transition-colors">
            {skill.skill_name}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {skill.description || "Structured practice goals towards mastery."}
          </p>
        </div>

        {/* Footer Metrics & Action */}
        <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-white">{totalHours}h</span> logged
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onLogPractice(skill);
            }}
            style={{ borderColor: theme.accent }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/15 transition-all text-white border"
          >
            <span>Log Practice</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
