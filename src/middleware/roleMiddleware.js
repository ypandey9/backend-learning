// Middleware for checking user roles

exports.authorize = (...roles) => {

  return (req, res, next) => {

    // req.user comes from JWT auth middleware
    if (!roles.includes(req.user.role)) {

      return res.status(403).json({
        message: "Access denied"
      });

    }

    // If role is allowed continue
    next();

  };

};