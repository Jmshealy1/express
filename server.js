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

let gear = [
  {
    _id: 1,
    name: "Remington 700 Rifle",
    material: "Steel & Wood",
    pricePerDay: 55,
    rating: 4.8,
    description: "Bolt-action hunting rifle with exceptional accuracy.",
    main_image: "remington700.jpg",
  },

];

app.get("/api/gear", (req, res) => {
  res.send(gear);
});

app.post("/api/gear", upload.single("main_image"), (req, res) => {
  const validation = validateGear(req.body);

  if (validation.error) {
    return res.status(400).send({ message: validation.error.details[0].message });
  }

  const newGear = {
    _id: gear.length + 1,
    name: req.body.name,
    material: req.body.material,
    pricePerDay: parseFloat(req.body.pricePerDay),
    rating: parseFloat(req.body.rating),
    description: req.body.description,
    main_image: req.file ? req.file.filename : null,
  };

  gear.push(newGear);
  res.status(200).send(newGear);
});

app.delete("/api/gear/:id", (req, res) => {
  const id = req.params.id;
  const index = gear.findIndex((item) => item._id == id);

  if (index === -1) {
    return res.status(404).send({ message: "Gear not found" });
  }

  gear.splice(index, 1);
  res.send({ message: "Gear deleted" });
});

const validateGear = (gear) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    material: Joi.string().required(),
    pricePerDay: Joi.number().min(0).required(),
    rating: Joi.number().min(0).max(5).required(),
    description: Joi.string().allow("").optional(),
    main_image: Joi.allow(""),
  });

  return schema.validate(gear);
};

app.listen(3001, () => {
  console.log("Express server listening on port 3001...");
});
