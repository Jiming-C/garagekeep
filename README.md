# GarageKeep

**Submitted by:** Jiming Chen (jimingc)

**Group Members:** Jiming Chen (jimingc), Daniel Louis (dlouis1), Eric Liu (eliu1213), Tong Zhan (tz2004)

**App Description:** A personal car garage and maintenance journal — log your vehicles, record services, and see at a glance what's overdue, due soon, or good across every car you own.

**YouTube Video Link:** https://youtu.be/k79I8zlGxjQ

**APIs:**
- NHTSA vPIC API (https://vpic.nhtsa.dot.gov/api/) — VIN decode, used to auto-fill make/model/year when adding a car.
- Imagin.studio (https://www.imagin.studio/) — factory-style car renders, used to display each car's photograph.

**Contact Email:** jimingchen2015@gmail.com

**Deployed App Link:** https://garagekeep.onrender.com/

**AI Use:** 1. Claude Code 2. Gemini 3.1 Pro

---

## Stack

- **Backend:** Node.js + Express.js with `express.Router()` for `/api/cars`, `/api/services`, `/api/vin`, `/api/photo`.
- **Database:** MongoDB Atlas + Mongoose.
- **Frontend:** React 18 + Vite, React Router, Framer Motion.
- **CSS:** A single global token sheet plus per-component CSS Modules. Inter and Fraunces from Google Fonts.

## Run locally

```bash
# from the project root
npm install                 # installs root, server, and client
cp server/.env.example server/.env
# edit server/.env: set MONGODB_URI to your MongoDB Atlas connection string
npm run dev                 # starts Express on :3001 and Vite on :5173
```

The client proxies `/api/*` to the server in dev. Visit http://localhost:5173.

## Deploy to Render

1. Push this repo to GitHub.
2. Create a **Web Service** on Render. Connect the repo.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variable `MONGODB_URI` with your Atlas connection string.
6. Deploy. The server serves the built React client from `/client/dist` at `/`, and the API at `/api/*`.

## Project layout

```
.
├── client/                  React frontend (Vite)
│   ├── index.html
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── index.css        Global tokens, Google fonts, base type
│   │   ├── components/
│   │   ├── pages/
│   │   └── lib/
│   └── vite.config.js
├── server/                  Express backend
│   ├── server.js            Entry — mounts routers, serves built client
│   ├── routes/              cars.js, services.js, vin.js, photo.js
│   ├── models/              Car.js, Service.js
│   └── lib/                 intervals.js, status.js
├── PRODUCT.md               Strategic design context
├── DESIGN.md                Visual system tokens
├── package.json             Root scripts
└── README.md
```
