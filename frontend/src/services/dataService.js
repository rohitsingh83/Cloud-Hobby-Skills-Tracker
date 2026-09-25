import { 
  collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, 
  deleteDoc, query, where, orderBy, serverTimestamp, increment 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth, isConfigured } from "../firebase/config";
import { 
  INITIAL_USER, INITIAL_SKILLS, INITIAL_GOALS, 
  INITIAL_LOGS, INITIAL_POSTS, INITIAL_STATS 
} from "./mockData";

// Local storage key helpers for persistent offline demo simulation
const STORAGE_KEYS = {
  USER: "skillsphere_demo_user",
  SKILLS: "skillsphere_demo_skills",
  GOALS: "skillsphere_demo_goals",
  LOGS: "skillsphere_demo_logs",
  POSTS: "skillsphere_demo_posts",
  STATS: "skillsphere_demo_stats"
};

function getLocal(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setLocal(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error("Local storage error:", e);
  }
}

// ==================== USER PROFILE ====================
export async function getUserProfile(userId) {
  if (isConfigured && auth.currentUser) {
    const docSnap = await getDoc(doc(db, "users", userId));
    if (docSnap.exists()) return docSnap.data();
  }
  return getLocal(STORAGE_KEYS.USER, INITIAL_USER);
}

export async function updateUserProfile(userId, profileData) {
  if (isConfigured && auth.currentUser) {
    await updateDoc(doc(db, "users", userId), profileData);
  }
  const current = getLocal(STORAGE_KEYS.USER, INITIAL_USER);
  const updated = { ...current, ...profileData };
  setLocal(STORAGE_KEYS.USER, updated);
  return updated;
}

// ==================== SKILLS MODULE ====================
export async function getSkills(userId) {
  if (isConfigured && auth.currentUser) {
    const q = query(collection(db, "users", userId, "skills"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ skill_id: d.id, ...d.data() }));
  }
  return getLocal(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
}

export async function createSkill(userId, skillData) {
  const newSkill = {
    skill_id: "sk_" + Date.now(),
    uid: userId,
    total_minutes_practiced: 0,
    current_streak: 0,
    status: "ACTIVE",
    ...skillData
  };

  if (isConfigured && auth.currentUser) {
    const docRef = await addDoc(collection(db, "users", userId, "skills"), {
      ...newSkill,
      created_at: serverTimestamp()
    });
    newSkill.skill_id = docRef.id;
  }

  const current = getLocal(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
  const updated = [newSkill, ...current];
  setLocal(STORAGE_KEYS.SKILLS, updated);
  return newSkill;
}

export async function updateSkill(userId, skillId, updates) {
  if (isConfigured && auth.currentUser) {
    await updateDoc(doc(db, "users", userId, "skills", skillId), updates);
  }
  const current = getLocal(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
  const updated = current.map(s => s.skill_id === skillId ? { ...s, ...updates } : s);
  setLocal(STORAGE_KEYS.SKILLS, updated);
  return updated;
}

export async function deleteSkill(userId, skillId) {
  if (isConfigured && auth.currentUser) {
    await deleteDoc(doc(db, "users", userId, "skills", skillId));
  }
  const current = getLocal(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
  const updated = current.filter(s => s.skill_id !== skillId);
  setLocal(STORAGE_KEYS.SKILLS, updated);
  return updated;
}

// ==================== GOALS & MILESTONES ====================
export async function getGoals(userId) {
  if (isConfigured && auth.currentUser) {
    const snap = await getDocs(collection(db, "users", userId, "goals"));
    return snap.docs.map(d => ({ goal_id: d.id, ...d.data() }));
  }
  return getLocal(STORAGE_KEYS.GOALS, INITIAL_GOALS);
}

export async function createGoal(userId, goalData) {
  const newGoal = {
    goal_id: "gl_" + Date.now(),
    uid: userId,
    current_value: 0,
    status: "IN_PROGRESS",
    ...goalData
  };

  if (isConfigured && auth.currentUser) {
    const docRef = await addDoc(collection(db, "users", userId, "goals"), newGoal);
    newGoal.goal_id = docRef.id;
  }

  const current = getLocal(STORAGE_KEYS.GOALS, INITIAL_GOALS);
  const updated = [newGoal, ...current];
  setLocal(STORAGE_KEYS.GOALS, updated);
  return newGoal;
}

// ==================== PRACTICE LOGGING & STREAKS ====================
export function calculateStreak(lastPracticeDate, currentStreak) {
  const today = new Date().toISOString().slice(0, 10);
  if (!lastPracticeDate) return 1;

  const lastDate = new Date(lastPracticeDate);
  const currDate = new Date(today);
  const diffDays = Math.floor((currDate - lastDate) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Practiced again on the same day -> streak maintained
    return currentStreak || 1;
  } else if (diffDays === 1) {
    // Practiced on the consecutive day -> increment streak
    return (currentStreak || 0) + 1;
  } else {
    // Gap of 2 or more days -> reset streak
    return 1;
  }
}

export async function logPracticeSession(userId, logData) {
  const newLog = {
    session_id: "log_" + Date.now(),
    uid: userId,
    practiced_at: new Date().toISOString(),
    ...logData
  };

  // 1. Update practice log
  if (isConfigured && auth.currentUser) {
    await addDoc(collection(db, "users", userId, "logs"), newLog);
  }
  const currentLogs = getLocal(STORAGE_KEYS.LOGS, INITIAL_LOGS);
  setLocal(STORAGE_KEYS.LOGS, [newLog, ...currentLogs]);

  // 2. Update stats and streak
  const stats = getLocal(STORAGE_KEYS.STATS, INITIAL_STATS);
  const newStreak = calculateStreak(stats.last_practice_date, stats.current_streak);
  const updatedTotalHours = Math.round((stats.total_hours + (logData.duration_minutes / 60)) * 10) / 10;
  
  const updatedStats = {
    ...stats,
    current_streak: newStreak,
    longest_streak: Math.max(newStreak, stats.longest_streak || 0),
    total_hours: updatedTotalHours,
    last_practice_date: new Date().toISOString().slice(0, 10)
  };
  setLocal(STORAGE_KEYS.STATS, updatedStats);

  // 3. Update skill total time & skill streak
  const skills = getLocal(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
  const updatedSkills = skills.map(s => {
    if (s.skill_id === logData.skill_id) {
      return {
        ...s,
        total_minutes_practiced: (s.total_minutes_practiced || 0) + logData.duration_minutes,
        current_streak: newStreak
      };
    }
    return s;
  });
  setLocal(STORAGE_KEYS.SKILLS, updatedSkills);

  // 4. Update goal progress if attached
  const goals = getLocal(STORAGE_KEYS.GOALS, INITIAL_GOALS);
  const updatedGoals = goals.map(g => {
    if (g.skill_id === logData.skill_id) {
      const addedVal = g.unit === "hours" ? Math.round((logData.duration_minutes / 60) * 10) / 10 : 1;
      const newVal = g.current_value + addedVal;
      const updatedMilestones = (g.milestones || []).map(m => {
        if (!m.achieved && newVal >= m.target_value) {
          return { ...m, achieved: true, achieved_at: new Date().toISOString().slice(0, 10) };
        }
        return m;
      });
      return {
        ...g,
        current_value: newVal,
        milestones: updatedMilestones,
        status: newVal >= g.target_value ? "COMPLETED" : "IN_PROGRESS"
      };
    }
    return g;
  });
  setLocal(STORAGE_KEYS.GOALS, updatedGoals);

  return { newLog, updatedStats };
}

// ==================== CLOUD OBJECT STORAGE ====================
export async function uploadMediaFile(file, pathPrefix = "uploads") {
  // Validate file size (< 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Payload size limit exceeded: File must be under 5MB.");
  }

  // Validate MIME type
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
  if (!allowed.includes(file.type)) {
    throw new Error("Invalid file type: Only JPG, PNG, WEBP, and PDF are allowed.");
  }

  if (isConfigured && auth.currentUser) {
    const storagePath = `${pathPrefix}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  // Local/Offline preview fallback: FileReader base64/Object URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}

// ==================== COMMUNITY SOCIAL HUB ====================
export async function getCommunityFeed() {
  if (isConfigured && auth.currentUser) {
    const q = query(collection(db, "posts"), orderBy("created_at", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ post_id: d.id, ...d.data() }));
  }
  return getLocal(STORAGE_KEYS.POSTS, INITIAL_POSTS);
}

export async function createCommunityPost(postData) {
  const newPost = {
    post_id: "post_" + Date.now(),
    likes_count: 0,
    comments_count: 0,
    visibility: "public",
    created_at: new Date().toISOString(),
    liked_by_me: false,
    ...postData
  };

  if (isConfigured && auth.currentUser) {
    const docRef = await addDoc(collection(db, "posts"), {
      ...newPost,
      created_at: serverTimestamp()
    });
    newPost.post_id = docRef.id;
  }

  const current = getLocal(STORAGE_KEYS.POSTS, INITIAL_POSTS);
  const updated = [newPost, ...current];
  setLocal(STORAGE_KEYS.POSTS, updated);
  return newPost;
}

export async function toggleLikePost(postId, userId) {
  const current = getLocal(STORAGE_KEYS.POSTS, INITIAL_POSTS);
  const updated = current.map(p => {
    if (p.post_id === postId) {
      const isLiked = p.liked_by_me;
      return {
        ...p,
        liked_by_me: !isLiked,
        likes_count: isLiked ? Math.max(0, p.likes_count - 1) : p.likes_count + 1
      };
    }
    return p;
  });
  setLocal(STORAGE_KEYS.POSTS, updated);

  if (isConfigured && auth.currentUser) {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      likes_count: increment(1)
    });
  }

  return updated;
}

export async function getStats(userId) {
  return getLocal(STORAGE_KEYS.STATS, INITIAL_STATS);
}
