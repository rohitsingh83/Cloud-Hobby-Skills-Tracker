const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

function getIsoDate(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

/**
 * Cloud Function Trigger: onLogCreate
 * Fired automatically when a user records a practice session in Firestore.
 * Calculates daily consecutive streaks, aggregates weekly totals, and awards achievement badges.
 */
exports.onLogCreate = functions.firestore
  .document("users/{uid}/logs/{logId}")
  .onCreate(async (snap, context) => {
    const { uid } = context.params;
    const log = snap.data(); // { skill_id, duration_minutes, practiced_at }

    const statsRef = db.collection("users").doc(uid).collection("stats").doc("main");
    const statsDoc = await statsRef.get();
    const stats = statsDoc.exists ? statsDoc.data() : {};

    const today = getIsoDate(new Date());
    const logDate = log.practiced_at ? getIsoDate(new Date(log.practiced_at)) : today;
    const lastDate = stats.last_practice_date || null;

    let streak = stats.current_streak || 0;

    if (!lastDate) {
      streak = 1;
    } else {
      const diffMs = new Date(today) - new Date(lastDate);
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        // Practiced again today -> maintain current streak
        streak = streak || 1;
      } else if (diffDays === 1) {
        // Practiced on the following day -> increment streak
        streak += 1;
      } else {
        // Missed one or more days -> reset streak to 1
        streak = 1;
      }
    }

    // Weekly bucket calculation (ISO week format)
    const weekKey = `${new Date().getUTCFullYear()}-W${Math.ceil((((new Date() - new Date(new Date().getFullYear(), 0, 1)) / 86400000) + new Date(new Date().getFullYear(), 0, 1).getDay() + 1) / 7)}`;
    const weeklyMap = stats.weekly_minutes_map || {};
    weeklyMap[weekKey] = (weeklyMap[weekKey] || 0) + (log.duration_minutes || 0);

    const totalHours = Math.round(((stats.total_hours || 0) + ((log.duration_minutes || 0) / 60)) * 10) / 10;

    // Badges automation logic
    const badges = stats.badges_earned || [];
    if (streak >= 7 && !badges.some(b => b.id === "b_streak7")) {
      badges.push({ id: "b_streak7", title: "7-Day Ignition", icon: "Flame", desc: "Practiced 7 days continuously" });
    }
    if (totalHours >= 100 && !badges.some(b => b.id === "b_century")) {
      badges.push({ id: "b_century", title: "Century Club", icon: "Award", desc: "100+ Total Practice Hours" });
    }

    await statsRef.set({
      uid,
      current_streak: streak,
      longest_streak: Math.max(streak, stats.longest_streak || 0),
      last_practice_date: today,
      total_hours: totalHours,
      weekly_minutes_map: weeklyMap,
      badges_earned: badges,
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log(`[Streak Engine] Successfully updated stats for user ${uid}. New streak: ${streak}`);
    return null;
  });

/**
 * Scheduled Cloud Function: weeklyRecap
 * Runs every Monday at 08:00 AM to generate recap digests for each active learner.
 */
exports.weeklyRecap = functions.pubsub
  .schedule("every monday 08:00")
  .timeZone("Asia/Kolkata")
  .onRun(async (context) => {
    const usersSnap = await db.collection("users").get();
    const batch = db.batch();

    usersSnap.forEach((userDoc) => {
      const uid = userDoc.id;
      const recapRef = db.collection("users").doc(uid).collection("recaps").doc();
      batch.set(recapRef, {
        generated_at: admin.firestore.FieldValue.serverTimestamp(),
        summary: "Weekly automated recap ready. Keep up your consistency!"
      });
    });

    await batch.commit();
    console.log("[Recap Cron] Weekly recap batch execution finished.");
    return null;
  });

/**
 * HTTP Cloud Function: tapLog
 * Enables IoT / Desk NFC Kiosk integration: Tap an RFID card to log 25 mins instantly!
 */
exports.tapLog = functions.https.onRequest(async (req, res) => {
  const { uid, tag, minutes } = req.query;
  if (!uid || !tag) {
    return res.status(400).json({ error: "Missing required query parameters: uid and tag" });
  }

  // Find skill mapped to this RFID tag
  const tagDoc = await db.collection("users").doc(uid).collection("tags").doc(tag).get();
  const skillId = tagDoc.exists ? tagDoc.data().skill_id : "sk_general";

  await db.collection("users").doc(uid).collection("logs").add({
    skill_id: skillId,
    duration_minutes: parseInt(minutes, 10) || 25,
    activity: "Tap-to-Log NFC Kiosk Practice",
    notes: `Logged via hardware tag UID: ${tag}`,
    practiced_at: new Date().toISOString(),
    created_at: admin.firestore.FieldValue.serverTimestamp()
  });

  return res.status(200).json({ success: true, message: "Practice logged via NFC tap!" });
});
