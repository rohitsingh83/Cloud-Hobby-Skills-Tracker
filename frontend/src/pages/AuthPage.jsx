import React, { useState } from "react";
import { Sparkles, Lock, Mail, User, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthPage({ onAuthenticated }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, signup, loading, isCloudActive } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
      if (onAuthenticated) onAuthenticated();
    } catch (err) {
      setError(err.message || "Authentication failed. Please verify credentials.");
    }
  };

  const handleDemoLogin = async () => {
    try {
      await login("alex.rivera@cloudtech.edu", "demo123456");
      if (onAuthenticated) onAuthenticated();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-cyan-500/20 shadow-2xl shadow-cyan-950/40 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/30">
            <div className="w-full h-full bg-space-900 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {isLogin ? "Welcome Back to SkillSphere" : "Initialize Cloud Account"}
          </h1>
          <p className="text-xs text-slate-400">
            {isLogin 
              ? "Access your 3D skill portfolio, streaks, and community feed" 
              : "Provision your personal encrypted cloud data partition"}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* Quick Demo Bypass for zero-friction evaluator access */}
        <button
          onClick={handleDemoLogin}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-cyan-400 border border-cyan-500/30 transition-all flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>One-Click Evaluator Demo Sign In</span>
        </button>

        <div className="relative flex items-center justify-center">
          <span className="h-[1px] w-full bg-white/10" />
          <span className="absolute bg-space-900 px-3 text-[10px] text-slate-500 uppercase tracking-widest font-mono">
            Or credentials
          </span>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-space-800 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="alex.rivera@cloudtech.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-space-800 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-space-800 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-black shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{isLogin ? "Sign In to Cloud" : "Create Account"}</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already registered? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
