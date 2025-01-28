const bcrypt = require("bcryptjs");
const db = require("./db");
const crypto = require("crypto");

// Find a user by email
exports.findUserByEmail = async (email) => {
  return await db("users").where({ email }).first();
};

// total number users
exports.totalUsers = async () => {
  return await db("users").count("* as count").first();
};

// create a new user
exports.createUser = async (userObject) => {
  const salt = await bcrypt.genSalt(10);
  userObject.password = await bcrypt.hash(userObject.password, salt);
  const [user] = await db("users").insert(userObject).returning("*");
  return user;
};

// Compare the hashed password with the provided password
exports.comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Update user by email
exports.updateUserByEmail = async (email, updates) => {
  const query = db("users").where({ email }).update(updates);
  await query;
  const [updatedUser] = await db("users").where({ email }).select("*");
  return updatedUser;
};