const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi");
const mongoose = require("mongoose");
const app = express();

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
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

mongoose
  .connect("mongodb+srv://jonathanmshealy:jms123456789@cluster0.c6yfrzv.mongodb.net/gearDB?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const gearSchema = new mongoose.Schema({
  name: { type: String, required: true },
  material: { type: String, required: true },
  pricePerDay: { type: Number, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  description: { type: String },
  main_image: { type: String, required: true },
});

const Gear = mongoose.model("Gear", gearSchema);

const validateGear = (item) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    material: Joi.string().required(),
    pricePerDay: Joi.number().min(0).required(),
    rating: Joi.number().min(0).max(5).required(),
    description: Joi.string().allow(""),
  });

  return schema.validate(item);
};

app.get("/api/gear", async (req, res) => {
  const gear = await Gear.find();
  res.send(gear);
});

app.post("/api/gear", upload.single("main_image"), async (req, res) => {
  const { error } = validateGear(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const newGear = new Gear({
    name: req.body.name,
    material: req.body.material,
    pricePerDay: parseFloat(req.body.pricePerDay),
    rating: parseFloat(req.body.rating),
    description: req.body.description || "",
    main_image: req.file ? req.file.filename : "default.jpg",
  });

  await newGear.save();
  res.status(200).send(newGear);
});

app.put("/api/gear/:id", upload.single("main_image"), async (req, res) => {
  const { error } = validateGear(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const updatedFields = {
    name: req.body.name,
    material: req.body.material,
    pricePerDay: parseFloat(req.body.pricePerDay),
    rating: parseFloat(req.body.rating),
    description: req.body.description || "",
  };

  if (req.file) {
    updatedFields.main_image = req.file.filename;
  }

  const gear = await Gear.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

  if (!gear) return res.status(404).send({ message: "Gear not found" });

  res.status(200).send(gear);
});

app.delete("/api/gear/:id", async (req, res) => {
  const gear = await Gear.findByIdAndDelete(req.params.id);

  if (!gear) return res.status(404).send({ message: "Gear not found" });

  res.status(200).send(gear);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Gear server running on port ${PORT}`));
