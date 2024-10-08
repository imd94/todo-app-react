const express = require("express");
const path = require("path");
const app = new express();
app.use(express.static(path.join(__dirname, "docs")));
app.get("*", (req, res) => res.sendFile(__dirname + "/docs/index.html"));
app.listen("4000");