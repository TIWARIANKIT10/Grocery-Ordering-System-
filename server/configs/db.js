import mongoose from "mongoose";

// The connection string comes from the environment ONLY.
// A full Atlas URI (username + password) was previously
// hardcoded here and committed to a public repo — that
// password must be rotated in Atlas; removing the line
// does not un-leak a credential already in git history.
const connnectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set — refusing to start without a database.");
    process.exit(1);
  }
  try {
    mongoose.connection.on("connected", () => console.log("Database Connected"));
    await mongoose.connect(uri);
  } catch (error) {
    // Fail fast: starting the HTTP server with a dead DB
    // leaves every request hanging on Mongoose buffering.
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

export default connnectDB;
