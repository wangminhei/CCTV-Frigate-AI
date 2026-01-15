🚨 **Frigate AI + Telegram Notify (Using Existing IP Camera)**

Hệ thống camera AI sử dụng Frigate + Docker + MQTT, gửi thông báo kèm ảnh về Telegram khi phát hiện người, không cần thay camera cũ (Dahua / Hikvision / ONVIF).

============================================================

✅ **Yêu cầu hệ thống**

Ubuntu / Debian / WSL2

Docker + Docker Compose

Node.js ≥ 18

IP Camera hỗ trợ RTSP (Dahua đã test OK)

Telegram account

============================================================

📁 **Cấu trúc thư mục**
CCTV-Frigate-AI/

├─ docker-compose.yml

├─ config/

│  └─ config.yml

├─ media/

│  ├─ clips/

│  └─ recordings/


notify/

├─ notify.js

├─ package.json

└─ node_modules/

============================================================

**CÀI ĐẶT DOCKER + DOCKER COMPOSE**

sudo apt update

sudo apt install -y docker.io docker-compose

sudo systemctl enable docker

sudo systemctl start docker

▶️ **Chạy Frigate:**

cd CCTV-Frigate-AI

docker-compose up -d

============================================================

🌐 **Truy cập trình duyệt,nhập:** http://IP_PC:5000

❓ **http://IP_PC:5000 là gì?**

👉 IP_PC = địa chỉ IP của máy PC / máy chủ đang chạy Frigate + Docker

Cổng 5000 là cổng Web UI của Frigate.

✅ **CÁCH DỄ NHẤT LẤY IP CỦA MÁY PC**

🔹 **Trên máy PC cài Frigate (Ubuntu)**

Mở Terminal, gõ:

ip a

Hoặc:

hostname -I

Ví dụ kết quả:

192.168.1.50

➡️ IP_PC = 192.168.1.50

============================================================

🌐 **CÁCH TRUY CẬP FRIGATE**

👉 Trên trình duyệt (Chrome, Edge…)

Gõ vào thanh địa chỉ:

http://192.168.1.50:5000

📌 KHÔNG gõ trong Terminal

📌 Gõ vào trình duyệt web

============================================================

**TẠO TELEGRAM BOT**

Mở Telegram → chat @BotFather

Gõ /newbot

Lưu lại:

BOT TOKEN

CHAT_ID

Lấy CHAT_ID:

curl https://api.telegram.org/bot<BOT_TOKEN>/getUpdates

============================================================

**CÀI NODE.JS + THƯ VIỆN**

cd ~

mkdir notify

cd notify

npm init -y

npm install mqtt axios form-data

▶️ CHẠY
node notify.js


Bạn sẽ thấy:

✅ MQTT connected

📡 Subscribed to frigate/events

🧪 TEST ĐÚNG

Đi trước camera 10–15 giây

Telegram sẽ nhận:

🚨 Thông báo

📸 Ảnh CLIP JPG thật

Terminal log:

📸 Đã gửi Telegram (clip image)

============================================================
