import React, { useState } from "react";
import { X, Clock, UploadCloud, Flame, CheckCircle, AlertCircle } from "lucide-react";
import { logPracticeSession, uploadMediaFile } from "../../services/dataService";
import { triggerMilestoneCelebration } from "../3d/CelebrationCanvas";

export default function PracticeLogModal({ isOpen, onClose, skills, onSessionLogged, preselectedSkill }) {
  const [skillId, setSkillId] = useState(preselectedSkill?.skill_id || (skills[0]?.skill_id || ""));
  const [duration, setDuration] = useState("45");
  const [activity, setActivity] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!skillId) {
      setError("Please select a skill to log practice for.");
      return;
    }
    if (!activity.trim()) {
      setError("Please describe what activity you practiced.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      let proofUrl = null;
      if (file) {
        proofUrl = await uploadMediaFile(file, "practice_proofs");
      }

      const logData = {
        skill_id: skillId,
        duration_minutes: parseInt(duration, 10) || 30,
        activity: activity.trim(),
        notes: notes.trim(),
        proof_media_url: proofUrl
      };

      const result = await logPracticeSession("usr_cloud_demo_01", logData);
      
      // Trigger 3D Particle Fireworks
      triggerMilestoneCelebration();

      if (onSessionLogged) {
        onSessionLogged(result);
      }

      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to log practice session.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl border border-cyan-500/30 p-6 shadow-2xl shadow-cyan-500/10">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Log Practice Session</h2>
              <p className="text-xs text-slate-400">Updates streaks, goal progress, and cloud analytics</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Skill Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select Hobby / Skill
            </label>
            <select
              value={skillId}
              onChange={(e) => setSkillId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-space-800 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
            >
              {skills.map((s) => (
                <option key={s.skill_id} value={s.skill_id}>
                  {s.skill_name} ({s.category})
                </option>
              ))}
            </select>
          </div>

          {/* Duration Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Duration (Minutes)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {["15", "30", "45", "60"].map((mins) => (
                <button
                  type="button"
                  key={mins}
                  onClick={() => setDuration(mins)}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                    duration === mins
                      ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/60 shadow-sm"
                      : "bg-space-800 text-slate-400 border-white/5 hover:text-white"
                  }`}
                >
                  {mins} mins
                </button>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Activity Summary
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Practiced fingerstyle guitar chords, Rust async channels"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-space-800 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none placeholder:text-slate-500"
            />
          </div>

          {/* Reflection Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Key Insights & Reflections
            </label>
            <textarea
              rows={2}
              placeholder="What clicked today? Any obstacles solved?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-space-800 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none placeholder:text-slate-500"
            />
          </div>

          {/* Cloud Object Storage Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Attach Proof / Milestone Photo (Cloud Object Storage)
            </label>
            <label className="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-dashed border-white/15 bg-space-800/60 hover:bg-space-800 cursor-pointer transition-colors">
              <UploadCloud className="w-5 h-5 text-cyan-400 mb-1" />
              <span className="text-xs text-slate-300 font-medium">
                {file ? file.name : "Click to attach screenshot, audio sample, or certificate"}
              </span>
              <span className="text-[10px] text-slate-500">Max size 5MB (JPG, PNG, PDF)</span>
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-black hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-black border-t-transparent animate-spin" />
                  <span>Syncing to Cloud...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 stroke-[2.5]" />
                  <span>Commit Session</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
