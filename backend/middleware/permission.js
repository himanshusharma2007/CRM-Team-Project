const checkPermission = (userAction) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      const permission = user.permission;
      const actionPermission = userAction.split(" ");
      const resource = actionPermission[0];
      const action = actionPermission[1];
      console.log("user in permission", req.user);
      // console.log(`permission[${resource}][${action}]`,permission[resource][action]);
      console.log(`req.user.role`, req.user.role);
    //   console.log(!permission[resource][action] && !req.user.role === "admin");

      if (!permission[resource][action] && req.user.role !== "admin") {
        return res.status(403).json({ error: "Permission denied" });
      }
      next();
    } catch (err) {
      console.log("error in check permission ", err);
      return res.status(403).json({ error: "Permission denied" });
    }
  };
};

module.exports = { checkPermission };
