const dotenv = require("dotenv");
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cors());
app.use(cookieParser());

const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const instructorRoute = require("./routes/instructorRoute");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config({ path: "./config.env" });
//DataBase connection
const PORT = process.env.PORT || 5000;
const db = require("./db/connection");

app.get("/health", (req, res) => {
  res.send("<h1>Helth is OK!!</h1>");
});

app.use(express.static("public"));
//route middleware

app.use("/api/v1/users", userRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/instructor", instructorRoute);
// server listening

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server is running...${PORT}`);
});
