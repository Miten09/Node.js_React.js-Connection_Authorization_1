const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signupController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("All Fields are Required");
    }

    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(409).send("User is already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      user,
    });
  } catch (err) {
    console.log(err);
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("All Fields are Required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User is not registered");
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(403).send("Incorrect Password");
    }

    const accessToken = generateAccessToken({
      id: user._id,
    });

    const refreshToken = generateRefreshToken({
      id: user._id,
    });

    return res.json({ accessToken, refreshToken });
  } catch (err) {
    console.log(err);
  }
};

//this api will check the refresh token validity(it is valid or not) and generate a new access token
const refreshAccessTokenController = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).send("Refresh Token is required");
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );

    const _id = decoded._id;
    const accessToken = generateAccessToken({ _id });

    return res.status(201).json({ accessToken });
  } catch (err) {
    console.log(err);
    return res.status(401).send("Invalid Refresh Token");
  }
};

//Internal Function
const generateAccessToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "15m",
    });
    console.log(token);
    return token;
  } catch (err) {
    console.log(err);
  }
};

const generateRefreshToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
      expiresIn: "1y",
    });
    console.log(token);
    return token;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  signupController,
  loginController,
  refreshAccessTokenController,
};
