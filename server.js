const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 1. Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/employee_db')
  .then(() => console.log('Database Status: LOCAL Connected! ✅'))
  .catch((err) => console.log('Database Connection Error ❌:', err));

// 2. SCHEMAS
// Employee Schema
const employeeSchema = new mongoose.Schema({
  name: String,
  position: String
});
const Employee = mongoose.model('Employee', employeeSchema);

// User Schema (For Authentication)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// 3. RESET & SEED ADMIN USER
const createAdmin = async () => {
  try {
    // This clears all old users to make sure your new one works!
    await User.deleteMany({}); 
    
    await User.create({ username: 'shreyanka', password: 'priya2728' });
    console.log('------------------------------------');
    console.log('Admin account RESET Successful!');
    console.log('User: shreyanka | Pass: priya2728');
    console.log('------------------------------------');
  } catch (err) {
    console.log("Admin creation error:", err);
  }
};
createAdmin();

// 4. ROUTES

// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    res.status(200).json({ success: true, message: 'Login successful!' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
});

// GET: Fetch all employees
app.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// POST: Add employee
app.post('/add-employee', async (req, res) => {
  try {
    const { name, position } = req.body;
    await new Employee({ name, position }).save();
    res.status(201).json({ message: 'Employee Saved!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save' });
  }
});

// PUT: Update employee
app.put('/update-employee/:id', async (req, res) => {
  try {
    const { name, position } = req.body;
    await Employee.findByIdAndUpdate(req.params.id, { name, position });
    res.status(200).json({ message: 'Employee Updated!' });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// DELETE: Remove employee
app.delete('/delete-employee/:id', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Employee Deleted!' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

// 5. Start Server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});