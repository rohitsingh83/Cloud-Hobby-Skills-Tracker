# SkillSphere 3D: Formal Testing & Quality Assurance Matrix

| Test ID | Test Scenario | Input Data | Expected Result | Pass / Fail |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | User Registration | Valid email & password | User document created in `/users/{uid}` with timestamp | PASS |
| **TC-02** | Duplicate Registration | Existing registered email | Returns `auth/email-already-in-use` error | PASS |
| **TC-03** | Valid User Login | Correct credentials | JWT token issued, user state loaded | PASS |
| **TC-04** | Invalid User Login | Incorrect password | Authentication rejected with clear warning | PASS |
| **TC-05** | Profile Update | Updated bio and interests | Profile document updated; changes reflect on UI | PASS |
| **TC-06** | Add New Skill | Name: Guitar, Cat: Music | Skill document created with 0 streak and hours | PASS |
| **TC-07** | Update Skill Details | Change target level to Advanced | Document updated in Firestore subcollection | PASS |
| **TC-08** | Delete Skill | Valid skill ID | Document deleted from `/users/{uid}/skills` | PASS |
| **TC-09** | Create Learning Goal | Target: 30 hours, Unit: hrs | Goal document created with milestones array | PASS |
| **TC-10** | Practice Session Entry | Duration: 60 mins, Activity: Chords | Log created, total hours incremented by 1.0 hr | PASS |
| **TC-11** | Streak Calculation (Day 1) | First recorded session | Current streak initialized to 1 | PASS |
| **TC-12** | Same-Day Duplicate Practice | 2nd session logged on same date | Total hours incremented; streak remains unchanged | PASS |
| **TC-13** | Consecutive Day Practice | Session on Date + 1 day | Current streak increments by 1 | PASS |
| **TC-14** | Multi-Day Missed Practice | Session logged after 4 days gap | Current streak resets to 1 | PASS |
| **TC-15** | Milestone Progress Calculation | 18 hrs out of 30 hrs target | Progress displays exactly 60% | PASS |
| **TC-16** | Progress Capping | 35 hrs logged for 30 hr goal | Progress capped cleanly at 100% | PASS |
| **TC-17** | Milestone Unlock & Confetti | Threshold reaches milestone value | Milestone marked `achieved: true`; 3D confetti fires | PASS |
| **TC-18** | Valid Object Storage Upload | Image JPEG under 5MB | File saved to Cloud Storage; download URL returned | PASS |
| **TC-19** | Invalid File Size Upload | File exceeding 5MB | Upload rejected with `Payload size limit exceeded` | PASS |
| **TC-20** | Invalid MIME Type Upload | Executable `.exe` file | Security rules reject non-media MIME types | PASS |
| **TC-21** | Create Community Post | Text content + Storage URL | Post published in `/posts`; visible on feed | PASS |
| **TC-22** | Retrieve Community Feed | Authenticated GET request | Paginated posts returned in reverse chronological order | PASS |
| **TC-23** | Like Community Post | User clicks heart button | Likes counter increments; liked state toggled | PASS |
| **TC-24** | Duplicate Like Prevention | Repeated clicks by same user | Composite key `postId_uid` prevents duplicate likes | PASS |
| **TC-25** | Unauthorized Data Mutation | User A attempts edit on User B skill | Blocked by Firestore security rules (`isOwner` check) | PASS |
| **TC-26** | User Session Persistence | Page refresh with stored token | User session retained without requiring re-login | PASS |
| **TC-27** | User Logout | User triggers logout action | Token cleared, local cache sanitized, redirects to auth | PASS |
