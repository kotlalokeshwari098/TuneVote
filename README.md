# 🎵 TuneVote

**TuneVote** is a real-time music jam and voting platform that lets users create, join, and vote for songs in collaborative jam sessions. Users can fetch songs from Spotify, vote live, and track rankings all in an interactive web interface.



## 💡 Solution Overview

Collaborative music selection can be chaotic in group events, parties, or study sessions. TuneVote solves this by offering:

- Real-time jam rooms with song voting.
- Unique room codes for secure participation.
- Live vote tracking with Redis.
- Spotify integration for fetching song metadata.
- Caching of fetched songs for better performance.

With TuneVote, users can:

- 🎶 Create personalized jam sessions with multiple songs.
- 🏷 Generate unique room codes or share QR codes for quick access.
- 😊 Chat with the other jammers in real time.
- 📊 Vote on songs in real-time.
- 🔁 See live rankings and vote counts.
- 💾 Store jam sessions and songs for future sessions.



## 🚀 Features

1. **🎼 Jam Session Management**
   - Create jams with unique names and IDs.
   - Add song lists fetched from Spotify.
   - Share via room code or QR code.

2. **🗳 Real-Time Voting**
   - Votes updated instantly using Redis.
   - Tracks per-user votes to prevent duplicates.

3. **🎵 Spotify Integration & Caching**
   - Fetch songs dynamically from the Spotify API.
   - Cached songs in backend for temporary storage to reduce repeated API calls.
   - Uses React Query on frontend for efficient fetching and caching.

4. **💻 Users Views**.
   - Create jam sessions, join via code, vote, and see live rankings.

5. **⚡ Performance & Load Testing**
   - Artillery scenarios test `/api/songs/search-song` endpoint.
   - Example config:
     ```yaml
     config:
       target: "http://localhost:5656"
       phases:
         - duration: 60
           arrivalRate: 10

     scenarios:
       - name: "search for songs"
         flow:
           - get:
               url: "/api/songs/search-song?query=jeffsatur"
     ```



## 🛠️ Tech Stack

| Layer        | Technology                                           |
|-------------|------------------------------------------------------|
| 🌐 Frontend | React.js, TailwindCSS, TypeScript, React Query      |
| 🖥 Backend  | Node.js, Express.js                                     |
| 🗄 Database | PostgreSQL, Redis                                   |
| 🔐 Auth     | JWT Authentication                                   |
| 🔗 Real-Time| Socket.IO                                           |
| 🎵 Music API| Spotify API                                         |
| ☁️ Cloud   | Cloudinary (QR codes)                        |
| ⚡ Testing | Artillery (Load testing)                             |


## Getting Started

1️. Clone the repository
```
git clone https://github.com/your-username/TuneVote.git
cd TuneVote
```

2️. Set up environment variables


Copy the example .env file:
```
cp .env.example .env
```
```
Fill in your real secrets for:
PostgreSQL (PGUSER, PGPASSWORD, PGDATABASE)
Redis (REDIS_HOST, REDIS_PORT)
JWT secret (JWT_SECRET)
Spotify API (SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET)
Cloudinary (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)
```

3️. Run with Docker Compose in background
```
docker compose up -d --build
```
```
This builds and starts Postgres, Redis, backend server and frontend client.
Postgres container automatically initializes tables from server/db/db-init/001-init.sql.
Redis is ready for caching songs, votes and chats.
```

4️. Access the application
```
Frontend: http://localhost:5173
```
5️. Check services inside containers

Postgres:
```
docker exec -it postgres-db psql -U $PGUSER -d $PGDATABASE
\dt  # list tables
SELECT * FROM users;  # sample query
```
Redis:
```
docker exec -it tunevote-redis redis-cli
KEYS *  # list all keys
```

## ⚠️ Notes

- Real-time votes and chats are handled with Redis for performance.
- Cached song data prevents redundant Spotify API calls.
- Currently a **personal project**, not open for external contributions.
