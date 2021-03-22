var jwt = require("jsonwebtoken");
const privateKey = "sdgkjlafg!kgn546tewsdg";
module.exports = {
  createToken: (payload) => {
    return jwt.sign({ payload }, privateKey, {
      expiresIn: "24h",
    });
  },
};
