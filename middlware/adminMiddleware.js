export const isAdmin = (req, res, next) => {
  if (req.userInfo.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'only admins can access this route',
    });
  }

  next();
};
