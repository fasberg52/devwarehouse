const jwt = require("jsonwebtoken");
const config = require("../config/config.json");
const { models } = require("../models/index");
async function adminMiddelware(req, res, next) {
  console.log(`headers >>> ${JSON.stringify(req.headers)}`);
  const token = req.headers.authorization;
  const bearer = token.split(" ");
  console.log(`bearer >>> ${bearer}`);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const findAdmin = await models.User.findOne({
    where: { token: bearer },
  });
  if (!findAdmin) {
    res.status(400).json("not admin");
  }
  if (findAdmin.role && findAdmin.role === "admin") {
    jwt.verify(findAdmin.token, config.development.JWT_SECRET, (err, dec) => {
      isAdmin(dec);
    });
  } else {
    res.status(400).json("not admin");
  }

  function isAdmin(verifyToken) {
    if (verifyToken) {
      next();
    } else {
      res.status(400).json("ادمین نیستید");
    }
  }
}

module.exports = adminMiddelware;
