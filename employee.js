const mongoose = require('mongoose');

// This is the blueprint for an employee record
const EmployeeSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    position: { 
        type: String, 
        required: true 
    },
    salary: { 
        type: Number, 
        required: true 
    },
    dateJoined: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Employee', EmployeeSchema);