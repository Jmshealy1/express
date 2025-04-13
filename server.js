const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi");
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
  res.sendFile(__dirname + "/index.html");
});

let gear = [
  {
    _id: 1,
    name: "Remington 700 Rifle",
    type: "rifle",
    pricePerDay: 55,
    material: "Steel & Wood",
    main_image: "remington700.jpg",
    description: "Bolt-action hunting rifle with exceptional accuracy.",
    rating: 4.8
  },
  {
    _id: 2,
    name: "Benelli Shotgun",
    type: "shotgun",
    pricePerDay: 45,
    material: "Steel & Synthetic",
    main_image: "benelli.jpg",
    description: "Semi-automatic shotgun ideal for waterfowl.",
    rating: 4.9
  },
  {
    _id: 3,
    name: "CVA Wolf Black Powder Rifle",
    type: "black-powder",
    pricePerDay: 40,
    material: "Wood & Iron",
    main_image: "cva.jpg",
    description: "Classic muzzleloader rifle, accurate and reliable.",
    rating: 4.5
  },
  {
    _id: 4,
    name: "Leupold VX-Freedom",
    type: "scope",
    pricePerDay: 20,
    material: "Aluminum & Glass",
    main_image: "leupold.jpg",
    description: "High-quality rifle scope with crystal-clear optics.",
    rating: 4.8
  },
  {
    _id: 5,
    name: "Vortex Diamondback",
    type: "scope",
    pricePerDay: 18,
    material: "Aluminum & Multi-coated Glass",
    main_image: "vortex.jpg",
    description: "Budget-friendly scope with excellent optics.",
    rating: 4.7
  },
  {
    _id: 6,
    name: "Irish Setter Hunting Boots",
    type: "boots",
    pricePerDay: 10,
    material: "Leather & Gore-Tex",
    main_image: "irishsetter.jpg",
    description: "Waterproof boots suitable for rugged terrain.",
    rating: 4.9
  },
  {
    _id: 7,
    name: "Eberlestock Backpack",
    type: "backpack",
    pricePerDay: 8,
    material: "Ripstop Nylon",
    main_image: "eberlestock.jpg",
    description: "Durable backpack for long hunting trips.",
    rating: 4.8
  },
  {
    _id: 8,
    name: "Badlands 2200 Pack",
    type: "backpack",
    pricePerDay: 12,
    material: "Cordura Nylon",
    main_image: "badlands.jpg",
    description: "Heavy-duty hunting backpack with ample storage.",
    rating: 4.8
  }
];

app.get("/api/gear", (req, res) => {
  res.send(gear);
});

app.post("/api/gear", upload.single("main_image"), (req, res) => {
  const result = validateGear(req.body);

  if (result.error) {
    res.status(400).send({ message: result.error.details[0].message });
    return;
  }

  const newGear = {
    _id: gear.length + 1,
    name: req.body.name,
    type: req.body.type || "unknown",
    pricePerDay: parseFloat(req.body.pricePerDay),
    material: req.body.material,
    rating: parseFloat(req.body.rating),
    description: req.body.description || "",
    main_image: req.file ? req.file.filename : "default.jpg"
  };

  gear.push(newGear);
  res.status(201).send(newGear);
});

const validateGear = (gearItem) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    type: Joi.string().allow(""),
    pricePerDay: Joi.number().min(0).required(),
    material: Joi.string().required(),
    rating: Joi.number().min(0).max(5).required(),
    description: Joi.string().allow(""),
    main_image: Joi.allow("")
  });

  return schema.validate(gearItem);
};

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Gear API listening on port ${PORT}`);
});