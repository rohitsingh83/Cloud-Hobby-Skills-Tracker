import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/common/Navbar";
import Dashboard from "./pages/Dashboard";
import SkillsGalaxy from "./pages/SkillsGalaxy";
import CommunityFeed from "./pages/CommunityFeed";
import CloudArchitecture from "./pages/CloudArchitecture";
import AuthPage from "./pages/AuthPage";
import PracticeLogModal from "./components/common/PracticeLogModal";
import AddSkillModal from "./components/common/AddSkillModal";
import { 
  getSkills, getGoals, getCommunityFeed, 
  getStats 
} from "./services/dataService";
import { INITIAL_LOGS } from "./services/mockData";

function MainContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [skills, setSkills] = useState([]);
  const [goals, setGoals] = useState([]);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [stats, setStats] = useState({});
  const [posts, setPosts] = useState([]);
  
  // Modals state
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [preselectedSkill, setPreselectedSkill] = useState(null);

  // Load data
  const loadData = async () => {
    try {
      const [skillsData, goalsData, feedData, statsData] = await Promise.all([
        getSkills(user?.uid || "usr_cloud_demo_01"),
        getGoals(user?.uid || "usr_cloud_demo_01"),
        getCommunityFeed(),
        getStats(user?.uid || "usr_cloud_demo_01")
      ]);
      setSkills(skillsData);
      setGoals(goalsData);
      setPosts(feedData);
      setStats(statsData);
    } catch (err) {
      console.error("Error loading application state:", err);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const handleOpenLogModal = (skill = null) => {
    setPreselectedSkill(skill);
    setIsLogModalOpen(true);
  };

  const handleSessionLogged = () => {
    loadData();
  };

  const handleSkillCreated = () => {
    loadData();
  };

  if (!user) {
    return <AuthPage onAuthenticated={() => loadData()} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-space-900 text-slate-100">
      {/* Sticky Global Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLogModal={() => handleOpenLogModal(null)}
        onOpenSkillModal={() => setIsSkillModalOpen(true)}
        streak={stats.current_streak || 0}
      />

      {/* Main Routed Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 pt-8">
        {activeTab === "dashboard" && (
          <Dashboard
            skills={skills}
            goals={goals}
            logs={logs}
            stats={stats}
            onOpenLogModal={handleOpenLogModal}
            onOpenSkillModal={() => setIsSkillModalOpen(true)}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "skills" && (
          <SkillsGalaxy
            skills={skills}
            onOpenLogModal={handleOpenLogModal}
            onOpenSkillModal={() => setIsSkillModalOpen(true)}
          />
        )}

        {activeTab === "feed" && (
          <CommunityFeed
            posts={posts}
            setPosts={setPosts}
            skills={skills}
          />
        )}

        {activeTab === "architecture" && (
          <CloudArchitecture />
        )}
      </main>

      {/* Modals */}
      <PracticeLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        skills={skills}
        preselectedSkill={preselectedSkill}
        onSessionLogged={handleSessionLogged}
      />

      <AddSkillModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        onSkillCreated={handleSkillCreated}
      />

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 glass-panel mt-auto">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>SkillSphere 3D &copy; 2026 — Cloud Computing Capstone Project</span>
          </div>
          <div>
            Built with React, Three.js, Firebase Auth/Firestore/Storage, and Serverless Event Triggers
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
