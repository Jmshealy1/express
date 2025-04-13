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
    pricePerDay: 55,
    material: "Steel & Wood",
    rating: 4.8,
    description: "Bolt-action hunting rifle with exceptional accuracy.",
    main_image: "remington700.jpg"
  },
  {
    _id: 2,
    name: "Benelli Shotgun",
    pricePerDay: 45,
    material: "Steel & Synthetic",
    rating: 4.9,
    description: "Semi-automatic shotgun ideal for waterfowl.",
    main_image: "benelli.jpg"
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