const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

const BASE_URL = process.env.BASE_URL || "http://localhost:3001";

app.use(cors());
app.use(express.static("public"));
app.use("/images", express.static(path.join(__dirname, "images")));

const gear = [
  {
    _id: "rifle1",
    name: "Remington 700 Rifle",
    type: "rifle",
    pricePerDay: 55,
    material: "Steel & Wood",
    img: `${BASE_URL}/images/remington700.jpg`,
    description: "Bolt-action hunting rifle with exceptional accuracy.",
    rating: 4.8
  },
  {
    _id: "shotgun1",
    name: "Benelli Shotgun",
    type: "shotgun",
    pricePerDay: 45,
    material: "Steel & Synthetic",
    img: `${BASE_URL}/images/benelli.jpg`,
    description: "Semi-automatic shotgun ideal for waterfowl.",
    rating: 4.9
  },
  {
    _id: "bp1",
    name: "CVA Wolf Black Powder Rifle",
    type: "black-powder",
    pricePerDay: 40,
    material: "Wood & Iron",
    img: `${BASE_URL}/images/cva.jpg`,
    description: "Classic muzzleloader rifle, accurate and reliable.",
    rating: 4.5
  },
  {
    _id: "scope1",
    name: "Leupold VX-Freedom",
    type: "scope",
    pricePerDay: 20,
    material: "Aluminum & Glass",
    img: `${BASE_URL}/images/leupold.jpg`,
    description: "High-quality rifle scope with crystal-clear optics.",
    rating: 4.8
  },
  {
    _id: "scope2",
    name: "Vortex Diamondback",
    type: "scope",
    pricePerDay: 18,
    material: "Aluminum & Multi-coated Glass",
    img: `${BASE_URL}/images/vortex.jpg`,
    description: "Budget-friendly scope with excellent optics.",
    rating: 4.7
  },
  {
    _id: "boots1",
    name: "Irish Setter Hunting Boots",
    type: "boots",
    pricePerDay: 10,
    material: "Leather & Gore-Tex",
    img: `${BASE_URL}/images/irishsetter.jpg`,
    description: "Waterproof boots suitable for rugged terrain.",
    rating: 4.9
  },
  {
    _id: "pack1",
    name: "Eberlestock Backpack",
    type: "backpack",
    pricePerDay: 8,
    material: "Ripstop Nylon",
    img: `${BASE_URL}/images/eberlestock.jpg`,
    description: "Durable backpack for long hunting trips.",
    rating: 4.8
  },
  {
    _id: "pack2",
    name: "Badlands 2200 Pack",
    type: "backpack",
    pricePerDay: 12,
    material: "Cordura Nylon",
    img: `${BASE_URL}/images/badlands.jpg`,
    description: "Heavy-duty hunting backpack with ample storage.",
    rating: 4.8
  }
];

app.get("/api/gear", (req, res) => {
  res.json(gear);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running at ${BASE_URL}`);
});
