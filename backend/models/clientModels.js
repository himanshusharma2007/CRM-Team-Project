const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Client name is required"]
    },
    company: {
        type: String,
        required: [true, "Company name is required"]
    },
    phone: {
        type: String,
        required: [true, "phone no. is required"],
        unique: [true, "phone no. already exists"]
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: [true, "email already exists"]
    },
    timeZone: {
        type: String,
        default: "Asia/Kolkata"
    },
    location: {
        type: String
    },
    projectId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "project"
    }]
}, {timestamps:true});


const client = mongoose.model('client', clientSchema);
module.exports = client;


/*




*/