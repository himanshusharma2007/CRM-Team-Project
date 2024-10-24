const User = require("../models/userModels")
const Lead = require("../models/leadModels")
const Project = require("../models/projectModels")
const Client = require("../models/clientModels")
const ContactUs = require("../models/contactUsModels")
const Contact = require("../models/contactModels")
const team = require("../models/teamModels")


const leadStatics = async () => {
    try {
        let leadData = {}
        leadData.total = await Lead.countDocuments(); // Total leads
        // Use `for...of` to iterate over stages and await the results
        leadData.stages = await Lead.aggregate([
            {
                $group: {
                    _id: "$currentStage",  // Group by the department field
                    count: { $sum: 1 }  // Count the number of teams in each department
                }
            }
        ]);
        leadData.monthlyCounts = await Lead.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1,
                },
            },
        ]);
        return leadData;
    } catch (error) {
        console.log(error)
        throw error;

    }
}

const projectStatics = async () => {
    try {
        let projectData = {}
        projectData.total = await Project.countDocuments()
        // ["pending", "ongoing", "completed", "cancelled"],
        projectData.status = await Project.aggregate([
            {
                $group: {
                    _id: "$projectStatus",  // Group by the department field
                    count: { $sum: 1 }  // Count the number of teams in each department
                }
            }
        ]);
        projectData.monthlyCounts = await Project.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1,
                },
            },
        ]);
        return projectData;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

const userStatics = async (req) => {
  try {
    const userData = {};
    userData.total = await User.countDocuments();
    userData.active = await User.countDocuments({ isActive: true });
    userData.verify = await User.countDocuments({
      verify: true,
      _id: { $ne: req.user._id },
    });
    userData.unVerify = await User.countDocuments({
      verify: false,
      _id: { $ne: req.user._id },
    });
    userData.subAdmin = await User.countDocuments({ role: "subAdmin" });
    userData.emp = await User.countDocuments({ role: "emp" });
    return userData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const clientStatics = async () => {
    try {
        const clientData = {}
        clientData.total = await Client.countDocuments()
        clientData.indian = await Client.countDocuments({
            $or: [
                { "timeZone": "Asia/Kolkata" },
                { "timeZone": "Asia/Delhi" }
            ]
        });
        clientData.foreigner = await Client.countDocuments({
            $nor: [
                { "timeZone": "Asia/Kolkata" },
                { "timeZone": "Asia/Delhi" }
            ]
        });
        clientData.monthlyCounts = await Client.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1,
                },
            },
        ]);
        return clientData
    } catch (error) {
        console.log(error)
        throw error;
    }
}

const queryStatics = async () => {
    try {
        const queryData = {}
        queryData.total = await ContactUs.countDocuments()
        queryData.status = await ContactUs.aggregate([
            {
                $group: {
                    _id: "$status",  // Group by the department field
                    count: { $sum: 1 }  // Count the number of teams in each department
                }
            }
        ]);
        queryData.monthlyCounts = await ContactUs.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1,
                },
            },
        ]);
        return queryData;
    } catch (error) {
        console.log(error)
        throw error;
    }

}

const connectionStatics = async () => {
  try {
    const connectionData = {};
    connectionData.total = await Contact.countDocuments();
    connectionData.data = await Contact.find({})
      .sort({ _id: -1 }) // Sort by _id in descending order (most recent first)
      .limit(2);
    return connectionData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const teamStatics = async () => {
  try {
    const teamData = {};
    teamData.total = await team.countDocuments();
    teamData.department = await team.aggregate([
      {
        $group: {
          _id: "$department", // Group by the department field
          count: { $sum: 1 }, // Count the number of teams in each department
        },
      },
    ]);
    return teamData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.getAdminDashboardData = async (req, res) => {
  try {
    const leadData = await leadStatics();
    const projectData = await projectStatics();
    const userData = await userStatics(req);
    const clientData = await clientStatics();
    const queryData = await queryStatics();
    const connectionData = await connectionStatics();
    const teamData = await teamStatics();
    console.log({
        leadData,
        projectData,
        userData,
        clientData,
        queryData,
        connectionData,
        teamData,
      })
    return res.status(200).send({
      leadData,
      projectData,
      userData,
      clientData,
      queryData,
      connectionData,
      teamData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
