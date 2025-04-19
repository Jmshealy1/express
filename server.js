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
  .connect("mongodb+srv://jonathanmshealy:jms123456789@cluster0.c6yfrzv.mongodb.net/testdb?retryWrites=true&w=majority")
  .then(() => console.log("Connected to mongodb..."))
  .catch((err) => console.error("could not connect to mongodb...", err));

const schema = new mongoose.Schema({ name: String });
const Message = mongoose.model("Message", schema);
const message = new Message({ name: "Hello World" });
message.save().then(console.log);

let gear = [ /* gear objects with image paths like "images/remington700.jpg" */ ];

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

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
    main_image: req.file ? "images/" + req.file.filename : "images/default.jpg"
  };

  gear.push(newGear);
  res.status(200).send(newGear);
});

app.delete("/api/gear/:id", (req, res) => {
  const gearItem = gear.find((g) => g._id === parseInt(req.params.id));
  if (!gearItem) return res.status(404).send("Gear item not found");

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
    description: Joi.string().allow("").optional()
  });
  return schema.validate(item);
};

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Gear server running on port ${PORT}`);
});
