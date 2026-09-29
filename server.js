require("dotenv").config();
require("./config/db-connection");

const express = require("express");
const path = require("path");
const morgan = require('morgan');

const PORT = process.env.PORT || 3000;
const app = express();


app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded());
app.use(express.json());
app.use(morgan("dev"));

const authRouter = require("./routes/user-routes");
app.use("/api/auth", authRouter);

const notesRouter = require("./routes/notes-routes");
app.use("/api/notes", notesRouter);


app.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}`);
});