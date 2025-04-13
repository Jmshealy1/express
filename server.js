const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi");

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

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

let gear = [
  {
    _id: 1,
    name: "Remington 700 Rifle",
    material: "Steel & Wood",
    pricePerDay: 55,
    rating: 4.8,
    description: "Bolt-action hunting rifle with exceptional accuracy.",
    main_image: "images/remington700.jpg",
  },
  {
    _id: 2,
    name: "Benelli Shotgun",
    material: "Steel & Synthetic",
    pricePerDay: 45,
    rating: 4.9,
    description: "Semi-automatic shotgun ideal for waterfowl.",
    main_image: "images/benelli.jpg",
  }
];

app.get("/api/gear", (req, res) => {
  res.send(gear);
});

app.post("/api/gear", upload.single("main_image"), (req, res) => {
  const result = validateGear(req.body);

  if (result.error) {
    return res.status(400).send({ message: result.error.details[0].message });
  }

  const newGear = {
    _id: gear.length + 1,
    name: req.body.name,
    material: req.body.material,
    pricePerDay: parseFloat(req.body.pricePerDay),
    rating: parseFloat(req.body.rating),
    description: req.body.description || "",
  };

  if (req.file) {
    newGear.main_image = "images/" + req.file.filename;
  }

  gear.push(newGear);
  res.status(200).send(newGear);
});

app.delete("/api/gear/:id", (req, res) => {
  const gearItem = gear.find((g) => g._id === parseInt(req.params.id));

  if (!gearItem) {
    return res.status(404).send("Gear item not found");
  }

  const index = gear.indexOf(gearItem);
  gear.splice(index, 1);
  res.send(gearItem);
});

const validateGear = (item) => {
  const schema = Joi.object({
    _id: Joi.allow(""),
    name: Joi.string().min(3).required(),
    material: Joi.string().required(),
    pricePerDay: Joi.number().min(0).required(),
    rating: Joi.number().min(0).max(5).required(),
    description: Joi.string().allow("").optional(),
  });

  return schema.validate(item);
};

app.listen(3001, () => {
  console.log("Gear server running on port 3001");
});
