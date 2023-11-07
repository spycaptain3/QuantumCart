const jwt = require("jsonwebtoken");
const User = require("../models/user");

require("dotenv").config();

const verifyTokenAndRefresh = async (req, res, next) => {
  try {
    // Extract the access token from the cookies of request
    const AccessToken = req.cookies.access_token;
    // Check if the token is provided or not
    if (!AccessToken) {
      return res.status(401).json({ error: "No token provided" ,validate:0});
    }
    // Verify the access token
    jwt.verify(
      AccessToken,
      process.env.ACCESS_TOKEN_PRIVATE_KEY,
      async (err, decoded) => {
        if (err) {
          // Token is expired or invalid
          if (err.name === "TokenExpiredError") {
            try {
              // Retrieve the refresh token from the request body or headers

              const refreshToken = req.cookies.refresh_token;

              if (!refreshToken) {
                return res.status(401).json({
                  error:
                    "Access token expired or invalid. Please provide a refresh token.",
                    validate:0
                });
              }

              // Verify the refresh token
              const refreshDecoded = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_PRIVATE_KEY
              );

              // Retrieve the user associated with the refresh token
              const user = await User.findOne({ Email: refreshDecoded.email });

              if (!user) {
                return res.status(401).json({ error: "Invalid refresh token" ,validate:0 });
              }

              // Generate a new access token
              const newAccessToken = jwt.sign(
                { email: user.Email },
                process.env.ACCESS_TOKEN_PRIVATE_KEY,
                { expiresIn: "9000s" }
              );

              // Attach the new access token to the cookies
              res.cookie("access_token", newAccessToken, {
                // secure: true,
                httpOnly: true,
                sameSite: "lax",
              });
              req.user = user;
              next();
            } catch (error) {
              if (error.name === "JsonWebTokenError") {
                return res.status(401).json({ error: "Invalid refresh token" ,validate:0});
              }
              console.log("Error refreshing token:", error);
              res.status(500).json({ error: "Server error",validate:0 });
            }
          } else {
            // Token is invalid

            return res.status(401).json({ error: "Invalid token",validate:0 });
          }
        } else {
          // Token is valid
          // Retrieve the user associated with the token

          const user = await User.findOne({ Email: decoded.email });
          if (!user) {
            return res.status(401).json({ error: "Invalid token",validate:0 });
          }
          // Attach the user object to the request for further use
          req.user = user;

          next();
        }
      }
    );
  } catch (error) {
    console.log("Error verifying token:", error);
    res.status(500).json({ error: "Server error" ,validate:0});
  }
};

module.exports = verifyTokenAndRefresh;
