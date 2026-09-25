// Synthetic Seed Data for Offline / Demonstration Mode
export const INITIAL_USER = {
  uid: "usr_cloud_demo_01",
  name: "Alex Rivera",
  username: "alex_clouddev",
  email: "alex.rivera@cloudtech.edu",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  bio: "Full-Stack Cloud Developer & Creative technologist. Striving for 100 days of guitar and modern AI architectures.",
  interests: ["Coding", "Guitar", "Photography", "Fitness", "Digital Art"],
  created_at: new Date(Date.now() - 30 * 86400000).toISOString()
};

export const INITIAL_SKILLS = [
  {
    skill_id: "sk_guitar_01",
    uid: "usr_cloud_demo_01",
    skill_name: "Acoustic Guitar",
    category: "Music",
    current_level: "INTERMEDIATE",
    target_level: "ADVANCED",
    start_date: "2026-08-01",
    target_date: "2026-12-31",
    status: "ACTIVE",
    description: "Fingerstyle techniques, bar chords, and blues scales improvisation.",
    total_minutes_practiced: 1980, // 33 hours
    current_streak: 8,
    themeColor: "#F59E0B"
  },
  {
    skill_id: "sk_coding_02",
    uid: "usr_cloud_demo_01",
    skill_name: "Rust & Cloud Architecture",
    category: "Coding",
    current_level: "INTERMEDIATE",
    target_level: "ADVANCED",
    start_date: "2026-08-15",
    target_date: "2026-11-30",
    status: "ACTIVE",
    description: "Async Tokio runtimes, distributed microservices, and gRPC services.",
    total_minutes_practiced: 3420, // 57 hours
    current_streak: 14,
    themeColor: "#00F0FF"
  },
  {
    skill_id: "sk_photo_03",
    uid: "usr_cloud_demo_01",
    skill_name: "Portrait & Street Photography",
    category: "Photography",
    current_level: "BEGINNER",
    target_level: "INTERMEDIATE",
    start_date: "2026-09-01",
    target_date: "2026-10-31",
    status: "ACTIVE",
    description: "Natural light diffusion, prime 50mm framing, and Lightroom color grading.",
    total_minutes_practiced: 720, // 12 hours
    current_streak: 3,
    themeColor: "#EC4899"
  },
  {
    skill_id: "sk_fitness_04",
    uid: "usr_cloud_demo_01",
    skill_name: "Calisthenics & Mobility",
    category: "Fitness",
    current_level: "INTERMEDIATE",
    target_level: "ADVANCED",
    start_date: "2026-07-10",
    target_date: "2026-12-01",
    status: "ACTIVE",
    description: "Handstands, muscle-up progression, and thoracic spine flexibility.",
    total_minutes_practiced: 2160, // 36 hours
    current_streak: 6,
    themeColor: "#10B981"
  }
];

export const INITIAL_GOALS = [
  {
    goal_id: "gl_01",
    skill_id: "sk_guitar_01",
    uid: "usr_cloud_demo_01",
    title: "Master 5 Acoustic Fingerstyle Tracks",
    target_value: 50,
    current_value: 33,
    unit: "hours",
    deadline: "2026-11-15",
    status: "IN_PROGRESS",
    milestones: [
      { milestone_id: "m1", title: "10 Hours Chords Foundations", target_value: 10, achieved: true, achieved_at: "2026-08-10" },
      { milestone_id: "m2", title: "25 Hours Fingerpicking Rhythm", target_value: 25, achieved: true, achieved_at: "2026-09-02" },
      { milestone_id: "m3", title: "50 Hours Full Song Repertoire", target_value: 50, achieved: false, achieved_at: null }
    ]
  },
  {
    goal_id: "gl_02",
    skill_id: "sk_coding_02",
    uid: "usr_cloud_demo_01",
    title: "Build Distributed Storage Service in Rust",
    target_value: 60,
    current_value: 57,
    unit: "hours",
    deadline: "2026-10-15",
    status: "IN_PROGRESS",
    milestones: [
      { milestone_id: "m4", title: "20 Hours Concurrency & Channels", target_value: 20, achieved: true, achieved_at: "2026-08-25" },
      { milestone_id: "m5", title: "40 Hours Raft Consensus Implementation", target_value: 40, achieved: true, achieved_at: "2026-09-12" },
      { milestone_id: "m6", title: "60 Hours Production Benchmarks", target_value: 60, achieved: false, achieved_at: null }
    ]
  }
];

export const INITIAL_LOGS = [
  {
    session_id: "log_01",
    uid: "usr_cloud_demo_01",
    skill_id: "sk_guitar_01",
    duration_minutes: 60,
    activity: "Blues scales in A-minor & Travis picking",
    notes: "Focused on clean finger transitions without buzzing strings.",
    proof_media_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    practiced_at: new Date(Date.now() - 86400000 * 0).toISOString()
  },
  {
    session_id: "log_02",
    uid: "usr_cloud_demo_01",
    skill_id: "sk_coding_02",
    duration_minutes: 90,
    activity: "Async pipeline with Tokio channels",
    notes: "Zero memory allocation bottlenecks solved with VecDeque.",
    proof_media_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
    practiced_at: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

export const INITIAL_POSTS = [
  {
    post_id: "post_01",
    uid: "usr_cloud_demo_01",
    author_name: "Alex Rivera",
    author_username: "alex_clouddev",
    author_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    skill_name: "Rust & Cloud Architecture",
    skill_category: "Coding",
    content: "🚀 Just logged session #45! Finished implementing Raft log replication over gRPC in Rust. Cloud analytics indicate 57 practice hours logged this month!",
    media_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    likes_count: 24,
    comments_count: 4,
    visibility: "public",
    created_at: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    liked_by_me: true
  },
  {
    post_id: "post_02",
    uid: "usr_sarah_02",
    author_name: "Sarah Chen",
    author_username: "sarah_art",
    author_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    skill_name: "Digital Painting",
    skill_category: "Art",
    content: "🎨 Golden hour lighting study finished! Day 12 of my daily digital art streak. Storing high-res layered files in Cloud Object Storage.",
    media_url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    likes_count: 38,
    comments_count: 7,
    visibility: "public",
    created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    liked_by_me: false
  },
  {
    post_id: "post_03",
    uid: "usr_marcus_03",
    author_name: "Marcus Vance",
    author_username: "marcus_strum",
    author_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    skill_name: "Acoustic Guitar",
    skill_category: "Music",
    content: "🎸 Hit the 30-hour practice milestone today! Finally nailed the chord transitions on Neon by John Mayer. Consistency is everything.",
    media_url: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80",
    likes_count: 19,
    comments_count: 2,
    visibility: "public",
    created_at: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    liked_by_me: false
  }
];

export const INITIAL_STATS = {
  uid: "usr_cloud_demo_01",
  current_streak: 8,
  longest_streak: 21,
  last_practice_date: new Date().toISOString().slice(0, 10),
  total_hours: 138,
  weekly_minutes_map: {
    "Mon": 75,
    "Tue": 90,
    "Wed": 60,
    "Thu": 110,
    "Fri": 45,
    "Sat": 130,
    "Sun": 85
  },
  badges_earned: [
    { id: "b_streak7", title: "7-Day Ignition", icon: "Flame", desc: "Practiced 7 days in a row without breaking streak" },
    { id: "b_century", title: "Century Club", icon: "Award", desc: "Surpassed 100 total hours of structured practice" },
    { id: "b_community", title: "Community Beacon", icon: "Share2", desc: "Shared 10 verified progress proofs with community" }
  ]
};
