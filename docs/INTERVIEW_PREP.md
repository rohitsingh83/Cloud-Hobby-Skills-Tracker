# SkillSphere 3D: Technical Interview Preparation Guide
### 10 Critical Questions & Placement-Ready Answers

---

### Question 1: Explain your project.
**Answer:**
"I developed **SkillSphere 3D**, an Online Hobby & Skills Tracker with Community Sharing built on cloud infrastructure. The platform enables lifelong learners to define learning goals, record daily practice sessions, track compounding streaks, and monitor progress across multiple devices. Users can attach practice certificates or screenshots directly to Google Cloud Object Storage and broadcast their achievements to a real-time community feed where peers can like and comment.

On the frontend, I engineered an immersive 3D user experience using React and Three.js WebGL with dynamic, category-specific 3D perspective cards. On the backend, I utilized Firebase Authentication for identity, Cloud Firestore for structured entity storage, Cloud Storage for binary media assets, and Serverless Cloud Functions to compute streaks and aggregates asynchronously. The project showcases core cloud computing tenets including SaaS/PaaS orchestration, decoupled storage architecture, event-driven compute, security rules enforcement, and feed scalability."

---

### Question 2: Why did you use cloud computing instead of a traditional local server?
**Answer:**
"Cloud computing ensures high availability, cross-device data consistency, and automatic elasticity without manual server maintenance. If a user logs a guitar session on mobile, their progress and streak instantly synchronize to their desktop dashboard. Furthermore, cloud services provide out-of-the-box global CDN distribution, managed TLS certificate renewal, automated backups, and serverless compute that scales down to zero when idle, making it cost-efficient and resilient."

---

### Question 3: How does your architecture decouple the database from object storage?
**Answer:**
"Databases are engineered for high-throughput indexing and querying of structured documents, whereas storing binary objects like high-resolution photos or certificates directly inside documents causes database bloat and excessive I/O costs. In SkillSphere 3D, actual image binaries are streamed directly to Google Cloud Storage. Once uploaded, the storage engine returns a secure public/signed URL, which is the only artifact stored in the Firestore document. This keeps document payloads lightweight and speeds up query response times."

---

### Question 4: How does your automated streak calculation engine work?
**Answer:**
"The streak calculation compares the timestamp of the incoming practice log against the user's recorded `last_practice_date`. If the difference in calendar days is zero—meaning the user practiced multiple times today—the session duration is added to total hours while the streak count remains unchanged to prevent inflation. If the difference is exactly one day, the streak increments by one. If the gap is two or more days, the streak resets to one. This calculation is executed idempotently in serverless Cloud Functions on document creation."

---

### Question 5: How did you implement security and authorization?
**Answer:**
"I applied defense-in-depth principles:
1. **Authentication**: Handled via OAuth and Firebase Auth, issuing signed JWT tokens.
2. **Authorization & RBAC**: Implemented through server-side Firestore Security Rules where write and delete operations enforce `request.auth.uid == resource.data.uid`.
3. **Storage Security**: Enforced size limits (< 5MB) and strict MIME type matching (`image/*` or `application/pdf`) directly in Cloud Storage rules.
4. **Social Idempotency**: Handled double-liking by using composite primary keys `postId_uid` to ensure a user can only like a post once."

---

### Question 6: What is the role of REST APIs and how does the client communicate with the cloud?
**Answer:**
"The RESTful service layer abstracts cloud queries into standard HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`). The client uses Bearer tokens in headers to authenticate requests. For instance, `POST /api/practice` accepts JSON payloads detailing duration and activity tags, updates the ledger, and returns standard HTTP 201 Created or 400 Bad Request status codes. This decoupling ensures the backend logic can be tested and modified independently of the frontend UI."

---

### Question 7: How does your community feed scale to 100,000+ users?
**Answer:**
"At scale, querying feeds naively using table scans becomes a major bottleneck. I evaluated two architectures:
- **Fan-out on Read (Pull)**: Posts are fetched from followed users on request. Efficient for high-frequency posters, but read-heavy for large follower graphs.
- **Fan-out on Write (Push)**: When a user posts, a serverless background worker fans out the post ID into the timeline document of every active follower. Reading the feed becomes an \(O(1)\) lookup from cache.
I designed the schema to support cursor-based pagination and Firestore composite indexes (`visibility` ASC, `created_at` DESC) to ensure sub-100ms response times."

---

### Question 8: What happens if an image upload succeeds but the database write fails?
**Answer:**
"This is a classic distributed consistency challenge. To handle it:
1. The client catches the database write exception.
2. In the catch block, a compensation cleanup call is made to Cloud Storage to delete the orphaned uploaded file.
3. For enterprise backends, I would use an asynchronous task queue or Cloud Function trigger that reconciles orphaned storage objects that have no corresponding database record after a 24-hour expiration window."

---

### Question 9: How did you test your application?
**Answer:**
"I created a comprehensive testing matrix spanning 27 test cases:
1. **Automated Unit Tests**: Verified streak arithmetic, calendar edge cases, progress percentage capping, and duplicate like prevention.
2. **Integration Tests**: Tested multipart file uploads to object storage and document updates in Firestore.
3. **Security Testing**: Validated that unauthenticated requests to modify foreign skills were rejected with HTTP 403 Forbidden errors."

---

### Question 10: How can this project be evolved in a production roadmap?
**Answer:**
"Next steps would include:
1. **AI Recommendation Engine**: Sentence-BERT or Gemini API embeddings running on Cloud Run to match learners with practice buddies based on interest vectors.
2. **IoT Integration**: An ESP32 RFID desk kiosk enabling tap-to-log practice via NFC cards.
3. **Global Push Notifications**: Web Push notifications alerting users before their daily streak expires."
