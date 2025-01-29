const db = require('../models/db')
const { findUserByEmail,
  totalUsers,
  createUser,
  comparePassword,
  updateUserByEmail } = require('../models/users');
const { createToken } = require('../utils/jsonwebtoken');


exports.register = async (req, res) => {
  const { name, email, password, phone, gender } = req.body;
  try {
    if (!name || !email || !password || !phone || !gender) {
      return res.status(400).json({ success: false, message: "Missing details" })
    }
    const isEmailAlreadyExist = await findUserByEmail(email);
    if (isEmailAlreadyExist) {
      return res.status(400).json({ success: false, message: "Email already exists" })
    }
    const user = {
      name,
      email,
      password,
      phone,
      gender
    };
    await createUser(user);
    return res.status(201).json({
      success: true,
      message: "User Created",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error with request: " + error })
  }

};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Missing details" })
    }
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: "Email not found" })
    }

    const unhashPassword = await comparePassword(password, user.password);

    if (!unhashPassword) {
      return res.status(400).json({ success: false, message: "Incorrect Password" })
    }
    let jwtPayload = { email: email, user_id: user.id }

    const token = createToken(jwtPayload)


    return res.status(200).json({
      success: true,
      message: "Login Success",
      data: token
    })

  } catch (error) {
    return res.status(500).json({ success: false, message: "Error with request: " + error })
  }
}
