# Hardware IoT Tap-to-Log NFC Kiosk & AI Recommendation Engine

---

## Part 1: IoT Tap-to-Log Desk Kiosk (ESP32 + RC522 RFID)

Place a small NFC pad on your desk—tap an RFID card or key fob to instantly log 25 minutes of practice for a selected hobby without opening your computer.

### 1. Hardware Components & Purpose
- **ESP32-WROOM-32**: Wi-Fi MCU that transmits HTTP GET requests to the Cloud Function endpoint.
- **RC522 RFID Module (MFRC522)**: Reads 13.56 MHz NFC/RFID tags (one card per hobby or user).
- **Power**: 3.3V power supplied directly from ESP32 development board via USB.

### 2. Pin Mapping (SPI Mode)
```
RC522 Pin       ESP32 GPIO Pin
------------------------------
SDA (SS)   ---> GPIO 5
SCK        ---> GPIO 18
MOSI       ---> GPIO 23
MISO       ---> GPIO 19
RST        ---> GPIO 22
3.3V       ---> 3V3 (Do NOT connect to 5V!)
GND        ---> GND
```

### 3. Hardware Wiring Diagram
```
+---------------+                    +---------------+
|   MFRC522     |                    |    ESP32      |
|               |                    |               |
|       SDA(SS) +------------------->| GPIO 5        |
|           SCK +------------------->| GPIO 18       |
|          MOSI +------------------->| GPIO 23       |
|          MISO +------------------->| GPIO 19       |
|           RST +------------------->| GPIO 22       |
|          3.3V +------------------->| 3V3           |
|           GND +------------------->| GND           |
+---------------+                    +---------------+
```

### 4. Arduino C++ Firmware (`firmware.ino`)
```cpp
#include <SPI.h>
#include <MFRC522.h>
#include <WiFi.h>
#include <HTTPClient.h>

#define SS_PIN 5
#define RST_PIN 22
MFRC522 rfid(SS_PIN, RST_PIN);

const char* ssid = "YOUR_WIFI_SSID";
const char* pass = "YOUR_WIFI_PASSWORD";

// Cloud Function endpoint
const char* cloudEndpoint = "https://us-central1-skillsphere-3d-cloud.cloudfunctions.net/tapLog?uid=usr_cloud_demo_01&minutes=25";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
    Serial.print(".");
  }
  Serial.println("\n[IoT Kiosk] WiFi Connected!");

  SPI.begin();
  rfid.PCD_Init();
  Serial.println("[IoT Kiosk] RFID Reader Initialized. Ready for tap...");
}

void loop() {
  // Check if a new RFID card is presented
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) {
    delay(100);
    return;
  }

  // Read Card UID
  String tag = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    tag += String(rfid.uid.uidByte[i], HEX);
  }
  tag.toUpperCase();
  Serial.println("\n[IoT Kiosk] Card Detected! Tag UID: " + tag);

  // Send practice log to cloud
  HTTPClient http;
  String fullUrl = String(cloudEndpoint) + "&tag=" + tag;
  http.begin(fullUrl);
  int httpCode = http.GET();
  
  if (httpCode == 200) {
    Serial.println("[Cloud Sync] Practice logged successfully! (+25 mins)");
  } else {
    Serial.printf("[Cloud Sync Error] Status code: %d\n", httpCode);
  }
  http.end();

  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
  delay(1500); // Debounce to prevent multiple logs on single tap
}
```

---

## Part 2: AI Hobby Suggestions & Buddy Matching (Sentence-BERT on Cloud Run)

Uses Sentence-BERT embeddings to rank hobbies and match learners based on semantic interest overlap.

### 1. Python Flask/FastAPI Service (`ai_service.py`)
```python
from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util

app = FastAPI(title="SkillSphere AI Recommendation Engine")
model = SentenceTransformer("all-MiniLM-L6-v2")

HOBBIES_CATALOG = [
    {"id": "guitar", "desc": "Acoustic fingerstyle guitar practice chords strumming musical theory"},
    {"id": "coding", "desc": "Rust cloud microservices async programming algorithms and distributed data"},
    {"id": "photo", "desc": "Portrait and street photography lighting composition shutter speed Lightroom editing"},
    {"id": "fitness", "desc": "Calisthenics bodyweight training mobility strength handstands workout"},
    {"id": "art", "desc": "Digital painting concept art character sketching Photoshop colors and shading"}
]

class UserPreferences(BaseModel):
    interests: str = "music sound acoustic fingerpicking"

@app.post("/api/suggest-hobbies")
def suggest_hobbies(pref: UserPreferences):
    query_embedding = model.encode(pref.interests, convert_to_tensor=True)
    corpus_embeddings = model.encode([h["desc"] for h in HOBBIES_CATALOG], convert_to_tensor=True)
    
    similarities = util.cos_sim(query_embedding, corpus_embeddings)[0].tolist()
    ranked = sorted(zip(HOBBIES_CATALOG, similarities), key=lambda x: x[1], reverse=True)
    
    return {
        "suggestions": [
            {"hobby_id": h["id"], "description": h["desc"], "similarity_score": round(float(score), 3)}
            for h, score in ranked
        ]
    }
```
