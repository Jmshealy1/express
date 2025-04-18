const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi");
const app = express();

app.use(express.static("public"));
app.use("/images", express.static("public/images"));
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
const upload = multer({ storage });

let gear = [
  {
    _id: 1,
    name: "Remington 700 Rifle",
    material: "Steel & Wood",
    pricePerDay: 55,
    rating: 4.8,
    description: "Bolt-action hunting rifle with exceptional accuracy.",
    main_image: "remington700.jpg"
  },
  {
    _id: 2,
    name: "Benelli Shotgun",
    material: "Steel & Synthetic",
    pricePerDay: 45,
    rating: 4.9,
    description: "Semi-automatic shotgun ideal for waterfowl.",
    main_image: "benelli.jpg"
  },
  {
    _id: 3,
    name: "CVA Wolf Black Powder Rifle",
    material: "Wood & Iron",
    pricePerDay: 40,
    rating: 4.5,
    description: "Classic muzzleloader rifle, accurate and reliable.",
    main_image: "cva.jpg"
  },
  {
    _id: 4,
    name: "Leupold VX-Freedom",
    material: "Aluminum & Glass",
    pricePerDay: 20,
    rating: 4.8,
    description: "High-quality rifle scope with crystal-clear optics.",
    main_image: "leupold.jpg"
  },
  {
    _id: 5,
    name: "Vortex Diamondback",
    material: "Aluminum & Multi-coated Glass",
    pricePerDay: 18,
    rating: 4.7,
    description: "Budget-friendly scope with excellent optics.",
    main_image: "vortex.jpg"
  },
  {
    _id: 6,
    name: "Irish Setter Hunting Boots",
    material: "Leather & Gore-Tex",
    pricePerDay: 10,
    rating: 4.9,
    description: "Waterproof boots suitable for rugged terrain.",
    main_image: "irishsetter.jpg"
  },
  {
    _id: 7,
    name: "Eberlestock Backpack",
    material: "Ripstop Nylon",
    pricePerDay: 8,
    rating: 4.8,
    description: "Durable backpack for long hunting trips.",
    main_image: "eberlestock.jpg"
  },
  {
    _id: 8,
    name: "Badlands 2200 Pack",
    material: "Cordura Nylon",
    pricePerDay: 12,
    rating: 4.8,
    description: "Heavy-duty hunting backpack with ample storage.",
    main_image: "badlands.jpg"
  }
];

const validateGear = (item) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    material: Joi.string().required(),
    pricePerDay: Joi.number().min(0).required(),
    rating: Joi.number().min(0).max(5).required(),
    description: Joi.string().allow("").optional()
  });
  return schema.validate(item);
};


app.get("/api/gear", (req, res) => {
  res.send(gear);
});


app.post("/api/gear", upload.single("main_image"), (req, res) => {
  const form = {
    name: req.body.name,
    material: req.body.material,
    pricePerDay: parseFloat(req.body.pricePerDay),
    rating: parseFloat(req.body.rating),
    description: req.body.description
  };

  const result = validateGear(form);
  if (result.error) return res.status(400).send({ message: result.error.details[0].message });

  const newGear = {
    _id: gear.length ? Math.max(...gear.map((g) => g._id)) + 1 : 1,
    ...form,
    main_image: req.file ? req.file.filename : "default.jpg"
  };

  gear.push(newGear);
  res.status(200).send(newGear);
});


app.put("/api/gear/:id", upload.single("main_image"), (req, res) => {
  const id = parseInt(req.params.id);
  const gearItem = gear.find((g) => g._id === id);
  if (!gearItem) return res.status(404).send({ message: "Gear item not found" });

  const form = {
    name: req.body.name,
    material: req.body.material,
    pricePerDay: parseFloat(req.body.pricePerDay),
    rating: parseFloat(req.body.rating),
    description: req.body.description
  };

  const result = validateGear(form);
  if (result.error) return res.status(400).send({ message: result.error.details[0].message });

  gearItem.name = form.name;
  gearItem.material = form.material;
  gearItem.pricePerDay = form.pricePerDay;
  gearItem.rating = form.rating;
  gearItem.description = form.description;
  if (req.file) gearItem.main_image = req.file.filename;

  res.status(200).send(gearItem);
});


app.delete("/api/gear/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = gear.findIndex((g) => g._id === id);
  if (index === -1) return res.status(404).send("Gear item not found");

  const deleted = gear.splice(index, 1)[0];
  res.status(200).send(deleted);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Gear server running on port ${PORT}`);
});
