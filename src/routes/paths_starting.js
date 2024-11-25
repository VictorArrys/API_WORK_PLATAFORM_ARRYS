const { Router } = require("express");
const path = Router();

path.get("/", (req, res) => {
  // 
  res.send('Worksystem API is running')
});

module.exports = path;
