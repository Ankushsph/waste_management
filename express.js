const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/compostfromwaste', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

const User = require('./models/user');
const Distributor = require('./models/distributor');

// Routes
app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = new User({ email, password });
        await user.save();
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && user.password === password) {
            res.json({ success: true });
        } else {
            res.status(401).json({ success: false, message: 'Incorrect password.' });
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

app.post('/api/distributors', async (req, res) => {
    const { name, address, phone } = req.body;
    try {
        const distributor = new Distributor({ name, address, phone });
        await distributor.save();
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

app.get('/api/distributors', async (req, res) => {
    try {
        const distributors = await Distributor.find();
        res.json(distributors);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
