require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDb = require("./config/db");
const routes = require("./routes/v1/index");

const app = express();

connectDb();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1", routes);

// Default Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "DB Udaan API Running"
    });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`);
});