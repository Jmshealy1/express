const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(express.static("public")); 
app.use(express.json());           
app.use(cors());                  

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

let gear = [
  {
    _id: "rifle1",
    name: "Remington 700 Rifle",
    type: "rifle",
    pricePerDay: 55,
    material: "Steel & Wood",
    main_image: "remington700.jpg",
    description: "Bolt-action hunting rifle with exceptional accuracy.",
    rating: 4.8,
  },
  {
    _id: "shotgun1",
    name: "Benelli Shotgun",
    type: "shotgun",
    pricePerDay: 45,
    material: "Steel & Synthetic",
    main_image: "benelli.jpg",
    description: "Semi-automatic shotgun ideal for waterfowl.",
    rating: 4.9,
  },
  {
    _id: "scope1",
    name: "Leupold VX-Freedom",
    type: "scope",
    pricePerDay: 20,
    material: "Aluminum & Glass",
    main_image: "leupold.jpg",
    description: "High-quality rifle scope with crystal-clear optics.",
    rating: 4.8,
  },
  {
    _id: "boots1",
    name: "Irish Setter Hunting Boots",
    type: "boots",
    pricePerDay: 10,
    material: "Leather & Gore-Tex",
    main_image: "irishsetter.jpg",
    description: "Waterproof boots suitable for rugged terrain.",
    rating: 4.9,
  },
  {
    _id: "pack1",
    name: "Eberlestock Backpack",
    type: "backpack",
    pricePerDay: 8,
    material: "Ripstop Nylon",
    main_image: "eberlestock.jpg",
    description: "Durable backpack for long hunting trips.",
    rating: 4.8,
  },
  {
    _id: "pack2",
    name: "Badlands 2200 Pack",
    type: "backpack",
    pricePerDay: 12,
    material: "Cordura Nylon",
    main_image: "badlands.jpg",
    description: "Heavy-duty hunting backpack with ample storage.",
    rating: 4.8,
  }
];

app.get("/api/gear", (req, res) => {
  res.send(gear);
});

app.post("/api/gear", upload.single("main_image"), (req, res) => {
  const newItem = req.body;
  newItem._id = `gear${Date.now()}`;
  newItem.main_image = req.file ? req.file.originalname : "default.jpg";

  gear.push(newItem);
  res.status(201).send(newItem);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Gear API server listening at http://localhost:${PORT}`);
});
