const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/compostfromwaste', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const distributorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);
const Distributor = mongoose.model('Distributor', distributorSchema);

app.use(bodyParser.json());
app.use(cors());

app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: 'Error signing up. Please try again.' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ email: user.email }, 'secret', { expiresIn: '1h' });
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: 'Incorrect password.' });
        }
    } catch (error) {
        res.json({ success: false, message: 'Error logging in. Please try again.' });
    }
});

app.post('/api/distributors', async (req, res) => {
    const { name, address, phone } = req.body;
    try {
        const newDistributor = new Distributor({ name, address, phone });
        await newDistributor.save();
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: 'Error adding distributor. Please try again.' });
    }
});

app.get('/api/distributors', async (req, res) => {
    try {
        const distributors = await Distributor.find();
        res.json(distributors);
    } catch (error) {
        res.json({ success: false, message: 'Error fetching distributors list. Please try again.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
