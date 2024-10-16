const checkPermission = (userAction) => {
    return async (req, res, next) => {
        const user = await req.user;
        const permission = user.permission;
        const actionPermission = userAction.split(" ");
        const resource = actionPermission[0];
        const action = actionPermission[1];

        console.log(`permission[${resource}][${action}]`,permission[resource][action]);
        console.log(`req.user.role`,req.user.role);
        console.log(!permission[resource][action] && !req.user.role === "admin");

        if (!permission[resource][action] && req.user.role !== "admin") {
            return res.status(403).json({ error: "Permission denied" });
        }
        next();
    }
};

module.exports = { checkPermission };

