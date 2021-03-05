const bcrypt = require("bcrypt");

const hash = async (text) => await bcrypt.hash(text, 12);

module.exports = {
  hash,
};
