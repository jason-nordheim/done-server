const mongoose = require("mongoose");
const mongoConfig = require("./mongo").mongo;

const connectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};
const mongooseClient = new mongoose.Mongoose();

const userSchema = new mongooseClient.Schema({
  first_name: { type: String },
  last_name: { type: String },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (val) => {
      return /^[^@]+@\w+(\.\w+)+\w$/.test(val);
    },
  },
  password_digest: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});
const userModel = mongooseClient.model("user", userSchema);

mongooseClient.connect(mongoConfig.dbUri, connectOptions);

const connection = mongooseClient.connection;
connection.on("error", console.error.bind(console, "connection error:"));
connection.once("open", function () {
  console.info("Database Connection established");
});

module.exports = {
  models: {
    user: userModel,
  },
  connection,
};
