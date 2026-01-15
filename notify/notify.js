import mqtt from "mqtt";
import axios from "axios";
import fs from "fs";
import path from "path";
import FormData from "form-data";

/* Thay BOT_TOKEN và CHAT ID của bạn vào đây */
const TELEGRAM_TOKEN = "YOUR_BOT_TOKEN";
const CHAT_ID = "YOUR_CHAT_ID";

/* MQTT */
const MQTT_URL = "mqtt://127.0.0.1:1883";
const MQTT_TOPIC = "frigate/events";

/* FRIGATE MEDIA */
const FRIGATE_MEDIA = "/home/USERNAME/frigate/media";

/* Thời gian COOLDOWN (ms) để chụp ảnh ,muốn nhanh hơn thì thay đổi số 30 */
const COOLDOWN_MS = 30 * 1000;
const lastSent = {};

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function findLatestClipImage(camera) {
  const dir = path.join(FRIGATE_MEDIA, "clips");
  if (!fs.existsSync(dir)) return null;

  const files = fs.readdirSync(dir)
    .filter(f => f.startsWith(camera + "-") && f.endsWith(".jpg"))
    .map(f => ({
      name: f,
      time: fs.statSync(path.join(dir, f)).mtimeMs
    }))
    .sort((a, b) => b.time - a.time);

  return files.length ? path.join(dir, files[0].name) : null;
}

/* MQTT CONNECT */
const client = mqtt.connect(MQTT_URL);

client.on("connect", () => {
  console.log("✅ MQTT connected");
  client.subscribe(MQTT_TOPIC);
});

client.on("message", async (_, msg) => {
  const data = JSON.parse(msg.toString());
  if (data.type !== "new") return;
  if (data.after?.label !== "person") return;

  const cam = data.after.camera;
  const now = Date.now();
  if (lastSent[cam] && now - lastSent[cam] < COOLDOWN_MS) return;
  lastSent[cam] = now;

  const timeStr = new Date(
    data.after.start_time * 1000
  ).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

  const caption =
`🚨 PHÁT HIỆN NGƯỜI
📷 Camera: ${cam}
🎯 Độ tin cậy: ${data.after.score?.toFixed(2)}
🕒 ${timeStr}`;

  await sleep(3000);
  const img = findLatestClipImage(cam);

  if (img) {
    const form = new FormData();
    form.append("chat_id", CHAT_ID);
    form.append("caption", caption);
    form.append("photo", fs.createReadStream(img));
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendPhoto`,
      form,
      { headers: form.getHeaders() }
    );
    console.log("📸 Telegram sent (image)");
  } else {
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      { chat_id: CHAT_ID, text: caption }
    );
    console.log("📨 Telegram sent (text)");
  }
});

