// middlewares/role.js
const authorizeRole = (roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access Denied: Insufficient Permission' });
      }
      next();
    };
  };
  
  module.exports = authorizeRole;
  