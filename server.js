const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi");
const mongoose = require("mongoose");
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

mongoose.connect("mongodb+srv://jonathanmshealy:jms123456789@cluster0.c6yfrzv.mongodb.net/gearDB?retryWrites=true&w=majority&appName=Cluster0")
  .then(async () => {
    console.log("Connected to MongoDB...");
    await seedInitialGear();
  })
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const gearSchema = new mongoose.Schema({
  name: { type: String, required: true },
  material: { type: String, required: true },
  pricePerDay: { type: Number, required: true },
  rating: { type: Number, required: true },
  description: { type: String },
  main_image: { type: String }
});
const Gear = mongoose.model("Gear", gearSchema);

async function seedInitialGear() {
  const count = await Gear.countDocuments();
  if (count === 0) {
    await Gear.insertMany([
      { name: "Remington 700 Rifle", material: "Steel & Wood", pricePerDay: 55, rating: 4.8, description: "Bolt-action hunting rifle with exceptional accuracy.", main_image: "remington700.jpg" },
      { name: "Benelli Shotgun", material: "Steel & Synthetic", pricePerDay: 45, rating: 4.9, description: "Semi-automatic shotgun ideal for waterfowl.", main_image: "benelli.jpg" },
      { name: "CVA Wolf Black Powder Rifle", material: "Wood & Iron", pricePerDay: 40, rating: 4.5, description: "Classic muzzleloader rifle, accurate and reliable.", main_image: "cva.jpg" },
      { name: "Leupold VX-Freedom", material: "Aluminum & Glass", pricePerDay: 20, rating: 4.8, description: "High-quality rifle scope with crystal-clear optics.", main_image: "leupold.jpg" },
      { name: "Vortex Diamondback", material: "Aluminum & Multi-coated Glass", pricePerDay: 18, rating: 4.7, description: "Budget-friendly scope with excellent optics.", main_image: "vortex.jpg" },
      { name: "Irish Setter Hunting Boots", material: "Leather & Gore-Tex", pricePerDay: 10, rating: 4.9, description: "Waterproof boots suitable for rugged terrain.", main_image: "irishsetter.jpg" },
      { name: "Eberlestock Backpack", material: "Ripstop Nylon", pricePerDay: 8, rating: 4.8, description: "Durable backpack for long hunting trips.", main_image: "eberlestock.jpg" },
      { name: "Badlands 2200 Pack", material: "Cordura Nylon", pricePerDay: 12, rating: 4.8, description: "Heavy-duty hunting backpack with ample storage.", main_image: "badlands.jpg" }
    ]);
    console.log("✅ Initial gear seeded into database.");
  }
}

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

app.get("/api/gear", async (req, res) => {
  const gear = await Gear.find();
  res.send(gear);
});

app.post("/api/gear", upload.single("main_image"), async (req, res) => {
  const form = {
    name: req.body.name,
    material: req.body.material,
    pricePerDay: parseFloat(req.body.pricePerDay),
    rating: parseFloat(req.body.rating),
    description: req.body.description
  };

  const result = validateGear(form);
  if (result.error) return res.status(400).send({ message: result.error.details[0].message });

  const newGear = new Gear({
    ...form,
    main_image: req.file ? req.file.filename : "default.jpg"
  });

  await newGear.save();
  res.status(200).send(newGear);
});

app.put("/api/gear/:id", upload.single("main_image"), async (req, res) => {
  const form = {
    name: req.body.name,
    material: req.body.material,
    pricePerDay: parseFloat(req.body.pricePerDay),
    rating: parseFloat(req.body.rating),
    description: req.body.description
  };

  const result = validateGear(form);
  if (result.error) return res.status(400).send({ message: result.error.details[0].message });

  const updateData = { ...form };
  if (req.file) updateData.main_image = req.file.filename;

  const updatedGear = await Gear.findByIdAndUpdate(req.params.id, updateData, { new: true });
  if (!updatedGear) return res.status(404).send({ message: "Gear item not found" });

  res.status(200).send(updatedGear);
});

app.delete("/api/gear/:id", async (req, res) => {
  const deletedGear = await Gear.findByIdAndDelete(req.params.id);
  if (!deletedGear) return res.status(404).send("Gear item not found");

  res.status(200).send(deletedGear);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Gear server running on port ${PORT}`);
});
