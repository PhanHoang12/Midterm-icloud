const mongoose = require("mongoose");

const readConnection = mongoose.createConnection(
  process.env.MONGO_READ_URI
);

const writeConnection = mongoose.createConnection(
  process.env.MONGO_WRITE_URI
);

readConnection.on("connected", () => {
  console.log("READ database connected");
});

readConnection.on("error", (err) => {
  console.error("READ database error:", err.message);
});

writeConnection.on("connected", () => {
  console.log("WRITE database connected");
});

writeConnection.on("error", (err) => {
  console.error("WRITE database error:", err.message);
});

module.exports = {
  readConnection,
  writeConnection
};

// Separate connections for read-only and write-only database users