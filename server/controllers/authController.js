const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { error, success } = require("../utils/responseWrapper");

const signupController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      // return res.status(400).send("All Fields are Required");
      return res.send(error(400, "All Fields are Required"));
    }

    const oldUser = await User.findOne({ email });
    if (oldUser) {
      // return res.status(409).send("User is already registered");
      return res.send(error(409, "User is already registered"));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    // return res.status(201).json({
    //   user,
    // });
    return res.send(
      success(201, {
        user,
      })
    );
  } catch (err) {
    console.log(err);
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      // return res.status(400).send("All Fields are Required");
      return res.send(error(400, "All Fields are Required"));
    }

    const user = await User.findOne({ email });
    if (!user) {
      // return res.status(404).send("User is not registered");
      return res.send(error(404, "User is not registered"));
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      // return res.status(403).send("Incorrect Password");
      return res.send(error(403, "Incorrect Password"));
    }

    const accessToken = generateAccessToken({
      id: user._id,
    });

    const refreshToken = generateRefreshToken({
      id: user._id,
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return res.send(success(200, { accessToken }));
  } catch (err) {
    console.log(err);
  }
};

//this api will check the refresh token validity(it is valid or not) and generate a new access token
const refreshAccessTokenController = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    // return res.status(401).send("Refresh Token in cookie is required");
    return res.send(error(401, "Refresh Token in cookie is required"));
  }

  const refreshToken = cookies.jwt;

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );

    const _id = decoded._id;
    const accessToken = generateAccessToken({ _id });

    return res.send(success(201, { accessToken }));
  } catch (e) {
    console.log(e);
    // return res.status(401).send("Invalid Refresh Token");
    return res.send(error(401, "Invalid Refresh Token"));
  }
};

//Internal Function
const generateAccessToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "20s",
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
