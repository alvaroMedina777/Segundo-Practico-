// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = 'mongodb+srv://alvaro-2001:Guillee.2211@cluster0.jvrst4o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Mongoose schema and model
const historySchema = new mongoose.Schema({
  city: String,
  country: String,
  temp: String,
  condition: String,
  icon: String,
  conditionText: String,
  date: { type: Date, default: Date.now }
});

const History = mongoose.model('History', historySchema);

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Weather App API');
});

app.post('/api/history', async (req, res) => {
  const { city, country, temp, condition, icon, conditionText } = req.body;

  const newEntry = new History({ city, country, temp, condition, icon, conditionText });

  try {
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(400).json({ message: 'Error saving to database', error: err });
  }
});

app.get('/api/history', async (req, res) => {
  try {
    const history = await History.find().sort({ date: -1 });
    res.status(200).json(history);
  } catch (err) {
    res.status(400).json({ message: 'Error retrieving history', error: err });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
