import jwt from 'jsonwebtoken';
import 'dotenv/config';
export const authMiddleware = (req, res, next) => {
  // get the token from the header
  const authHeader = req.headers['authorization'];

  // check if the token is present and extract it into an array;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'access denied. no token provided , please login again',
    });
  }
// verify the user info
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userInfo = decodedToken;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'invalid or expired token',
    });
  }
};
