import React, { useState } from "react";
import { X, Plus, Sparkles } from "lucide-react";
import { createSkill, createGoal } from "../../services/dataService";

const CATEGORIES = [
  "Coding", "Music", "Photography", "Fitness", 
  "Art", "Cooking", "Gardening", "Writing", "Chess"
];

export default function AddSkillModal({ isOpen, onClose, onSkillCreated }) {
  const [skillName, setSkillName] = useState("");
  const [category, setCategory] = useState("Coding");
  const [currentLevel, setCurrentLevel] = useState("BEGINNER");
  const [targetLevel, setTargetLevel] = useState("ADVANCED");
  const [targetHours, setTargetHours] = useState("40");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    setLoading(true);
    try {
      const newSkill = await createSkill("usr_cloud_demo_01", {
        skill_name: skillName.trim(),
        category,
        current_level: currentLevel,
        target_level: targetLevel,
        description: description.trim(),
        start_date: new Date().toISOString().slice(0, 10),
        target_date: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10)
      });

      // Also auto-provision primary goal for this skill
      if (parseInt(targetHours, 10) > 0) {
        await createGoal("usr_cloud_demo_01", {
          skill_id: newSkill.skill_id,
          title: `Reach ${targetHours} Hours of ${skillName}`,
          target_value: parseInt(targetHours, 10),
          unit: "hours",
          deadline: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
          milestones: [
            { milestone_id: "m_1", title: `First 10 Hours of ${skillName}`, target_value: 10, achieved: false, achieved_at: null },
            { milestone_id: "m_2", title: `Halfway Point (${Math.floor(targetHours / 2)} Hours)`, target_value: Math.floor(targetHours / 2), achieved: false, achieved_at: null },
            { milestone_id: "m_3", title: `Mastery Target (${targetHours} Hours)`, target_value: parseInt(targetHours, 10), achieved: false, achieved_at: null }
          ]
        });
      }

      if (onSkillCreated) {
        onSkillCreated(newSkill);
      }
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-md glass-panel rounded-2xl border border-purple-500/30 p-6 shadow-2xl shadow-purple-500/10">
        
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Add New Hobby or Skill</h2>
              <p className="text-xs text-slate-400">Provisions 3D node & tracking containers</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Skill Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Classical Piano, Chess, Unreal Engine 5"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-space-800 border border-white/10 text-white text-sm focus:border-purple-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-space-800 border border-white/10 text-white text-xs focus:border-purple-400 focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Goal (Target Hours)
              </label>
              <input
                type="number"
                min="5"
                max="500"
                value={targetHours}
                onChange={(e) => setTargetHours(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-space-800 border border-white/10 text-white text-xs focus:border-purple-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Current Level
              </label>
              <select
                value={currentLevel}
                onChange={(e) => setCurrentLevel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-space-800 border border-white/10 text-white text-xs focus:border-purple-400 focus:outline-none"
              >
                <option value="BEGINNER">BEGINNER</option>
                <option value="INTERMEDIATE">INTERMEDIATE</option>
                <option value="ADVANCED">ADVANCED</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Level
              </label>
              <select
                value={targetLevel}
                onChange={(e) => setTargetLevel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-space-800 border border-white/10 text-white text-xs focus:border-purple-400 focus:outline-none"
              >
                <option value="INTERMEDIATE">INTERMEDIATE</option>
                <option value="ADVANCED">ADVANCED</option>
                <option value="MASTER">MASTER</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description / Learning Syllabus
            </label>
            <textarea
              rows={2}
              placeholder="What techniques or milestones will you master?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-space-800 border border-white/10 text-white text-xs focus:border-purple-400 focus:outline-none placeholder:text-slate-500"
            />
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-400 hover:to-indigo-500 transition-all shadow-lg shadow-purple-500/25"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{loading ? "Creating..." : "Initialize Skill Node"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
