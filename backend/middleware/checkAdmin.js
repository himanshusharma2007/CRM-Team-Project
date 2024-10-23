const checkAdmin = () => {
  return async (req, res, next) => {
    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized access. Please log in.",
      });
    }

    // Check if the user has the admin role
    if (req.user.role !== "admin") {
      return res.status(403).send({
        success: false,
        message: "Admin access required",
      });
    }

    // If the user is authenticated and is an admin, proceed to the next middleware
    next();
  };
};

module.exports = { checkAdmin };
