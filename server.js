const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.static("public"));

const gear = [
  {
    id: 1,
    name: "Remington 700",
    type: "Rifle",
    brand: "Remington",
    image: "images/remington-700.jpg"
  },
  {
    id: 2,
    name: "Leupold VX-5HD",
    type: "Scope",
    brand: "Leupold",
    image: "images/leupold-vx5hd.jpg"
  },
  {
    id: 3,
    name: "Danner Pronghorn",
    type: "Boots",
    brand: "Danner",
    image: "images/danner-pronghorn.jpg"
  },
  {
    id: 4,
    name: "Sitka Mountain Hauler",
    type: "Backpack",
    brand: "Sitka",
    image: "images/sitka-mountain-hauler.jpg"
  },
  {
    id: 5,
    name: "Vortex Diamondback",
    type: "Scope",
    brand: "Vortex",
    image: "images/vortex-diamondback.jpg"
  },
  {
    id: 6,
    name: "Lowa Tibet GTX",
    type: "Boots",
    brand: "Lowa",
    image: "images/lowa-tibet.jpg"
  },
  {
    id: 7,
    name: "Mystery Ranch Metcalf",
    type: "Backpack",
    brand: "Mystery Ranch",
    image: "images/mystery-ranch-metcalf.jpg"
  },
  {
    id: 8,
    name: "Savage 110",
    type: "Rifle",
    brand: "Savage Arms",
    image: "images/savage-110.jpg"
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