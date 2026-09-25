import React from "react";
import { 
  Cloud, Database, HardDrive, Shield, 
  Cpu, Layers, Zap, Network, Server, ArrowRight 
} from "lucide-react";

export default function CloudArchitecture() {
  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          <Cloud className="w-4 h-4" />
          <span>CLOUD COMPUTING COURSE PROJECT ARCHITECTURE</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">System & Cloud Topology</h1>
        <p className="text-sm text-slate-300 max-w-2xl mx-auto">
          Deep-dive into the architectural tiers, serverless event loops, managed databases, object storage decoupling, and security models powering SkillSphere 3D.
        </p>
      </div>

      {/* CLOUD PARADIGMS MAPPING MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Layers className="w-4 h-4" />
            <span>SaaS Layer</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The finished responsive 3D web application consumed directly by end users across mobile, tablet, and desktop without installing local software.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-purple-500/20 space-y-2">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
            <Server className="w-4 h-4" />
            <span>PaaS Tier</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Managed Google Cloud Firebase Hosting & CDN edge nodes handling automated TLS certificates, compression, and high-availability DNS routing.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-amber-500/20 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Zap className="w-4 h-4" />
            <span>Serverless (FaaS)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Event-driven Cloud Functions executing idempotently on document creation (`onCreate`) to update streaks, badges, and weekly summaries.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <HardDrive className="w-4 h-4" />
            <span>Object Storage</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Decoupled binary storage (GCS) storing practice proof images and certificates, referencing metadata URLs in the structured database.
          </p>
        </div>
      </div>

      {/* ARCHITECTURE FLOW DIAGRAM */}
      <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Network className="w-5 h-5 text-cyan-400" />
          <span>End-to-End Cloud Data Flow</span>
        </h2>

        <div className="p-6 rounded-2xl bg-space-800/80 border border-white/5 font-mono text-xs text-slate-300 space-y-4 overflow-x-auto">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">Client Tier</span>
            <span>React + Three.js 3D Canvas + JWT Bearer Tokens</span>
          </div>
          <div className="pl-6 border-l-2 border-dashed border-cyan-500/40 space-y-3 py-1">
            <div className="flex items-center gap-2 text-slate-400">
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              <span>TLS 1.3 / HTTPS Encrypted Traffic → Cloudflare / Firebase CDN Edge</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              <span>OAuth 2.0 / Firebase Authentication validates identity & issues claims</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">Cloud Service Tier</span>
            <span>Decoupled Storage & Managed Realtime Database</span>
          </div>
          <div className="pl-6 border-l-2 border-dashed border-purple-500/40 space-y-3 py-1">
            <div className="flex items-center gap-2 text-slate-400">
              <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
              <span><strong>Cloud Firestore:</strong> Stores structured documents (`/users/{uid}/skills`, `/posts/{id}`)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
              <span><strong>Cloud Storage:</strong> Direct multi-part upload for media blobs with MIME validation</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">Event & Analytics Tier</span>
            <span>Background Triggers & Aggregates</span>
          </div>
          <div className="pl-6 border-l-2 border-dashed border-amber-500/40 space-y-2 py-1">
            <div className="flex items-center gap-2 text-slate-400">
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              <span>`onLogCreate` trigger computes consecutive calendar streak & unlocks badges</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              <span>Scheduled Cron job generates Monday morning weekly recap documents</span>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED COMPARISON: DATABASE VS OBJECT STORAGE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Cloud Database (Firestore)</span>
          </h3>
          <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
            <li>Optimized for indexing, atomic transactions, and querying.</li>
            <li>Stores user profile metadata, skill configurations, goal deadlines.</li>
            <li>Enforces ownership security rules at document and field levels.</li>
            <li>Prevents duplicate social likes via composite primary document keys.</li>
          </ul>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-purple-400" />
            <span>Cloud Object Storage (GCS)</span>
          </h3>
          <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
            <li>Designed for high-throughput unstructured binary assets (images, audio).</li>
            <li>Drastically cheaper per GB compared to database document storage.</li>
            <li>Validates maximum payload size (&lt; 5MB) and MIME image headers.</li>
            <li>Delivered through global edge CDN caches for lightning-fast latency.</li>
          </ul>
        </div>
      </div>

      {/* SCALABILITY: FAN-OUT ON READ VS WRITE */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>Scalability Analysis: Feed Generation at 100,000+ Users</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-space-800 border border-white/5 space-y-2">
            <h4 className="font-bold text-cyan-400">Fan-out on Read (Pull Model)</h4>
            <p>
              When a user opens their community feed, the backend queries posts from followed creators ordered by timestamp.
            </p>
            <p className="text-[11px] text-slate-400">
              <strong>Pros:</strong> Writes are instant and cheap.<br />
              <strong>Cons:</strong> Read queries become computationally heavy when users follow thousands of people.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-space-800 border border-white/5 space-y-2">
            <h4 className="font-bold text-purple-400">Fan-out on Write (Push Model)</h4>
            <p>
              When a user publishes a post, serverless workers push the post ID into each follower's private timeline cache.
            </p>
            <p className="text-[11px] text-slate-400">
              <strong>Pros:</strong> Reading the feed is an instant \(O(1)\) lookup from cache.<br />
              <strong>Cons:</strong> High write overhead when celebrities or major creators publish updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
