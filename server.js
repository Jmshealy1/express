const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.static("public"));

const gear = [
  {
    _id: "rifle1",
    name: "Remington 700 Rifle",
    type: "rifle",
    pricePerDay: 55,
    material: "Steel & Wood",
    img: "images/remington700.jpg",
    description: "Bolt-action hunting rifle with exceptional accuracy.",
    rating: 4.8,
  },
  {
    _id: "shotgun1",
    name: "Benelli Shotgun",
    type: "shotgun",
    pricePerDay: 45,
    material: "Steel & Synthetic",
    img: "images/benelli.jpg",
    description: "Semi-automatic shotgun ideal for waterfowl.",
    rating: 4.9,
  },
  {
    _id: "bp1",
    name: "CVA Wolf Black Powder Rifle",
    type: "black-powder",
    pricePerDay: 40,
    material: "Wood & Iron",
    img: "images/cva.jpg",
    description: "Classic muzzleloader rifle, accurate and reliable.",
    rating: 4.5,
  },
  {
    _id: "scope1",
    name: "Leupold VX-Freedom",
    type: "scope",
    pricePerDay: 20,
    material: "Aluminum & Glass",
    img: "images/leupold.jpg",
    description: "High-quality rifle scope with crystal-clear optics.",
    rating: 4.8,
  },
  {
    _id: "scope2",
    name: "Vortex Diamondback",
    type: "scope",
    pricePerDay: 18,
    material: "Aluminum & Multi-coated Glass",
    img: "images/vortex.jpg",
    description: "Budget-friendly scope with excellent optics.",
    rating: 4.7,
  },
  {
    _id: "boots1",
    name: "Irish Setter Hunting Boots",
    type: "boots",
    pricePerDay: 10,
    material: "Leather & Gore-Tex",
    img: "images/irishsetter.jpg",
    description: "Waterproof boots suitable for rugged terrain.",
    rating: 4.9,
  },
  {
    _id: "pack1",
    name: "Eberlestock Backpack",
    type: "backpack",
    pricePerDay: 8,
    material: "Ripstop Nylon",
    img: "images/eberlestock.jpg",
    description: "Durable backpack for long hunting trips.",
    rating: 4.8,
  },
  {
    _id: "pack2",
    name: "Badlands 2200 Pack",
    type: "backpack",
    pricePerDay: 12,
    material: "Cordura Nylon",
    img: "images/badlands.jpg",
    description: "Heavy-duty hunting backpack with ample storage.",
    rating: 4.8,
  }
];

app.get("/api/gear", (req, res) => {
  res.json(gear);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Gear API server running on port ${PORT}`);
});
