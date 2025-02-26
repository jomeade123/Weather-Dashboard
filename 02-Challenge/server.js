// server.js
const express = require('express');
const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public')); // Serve static files from the public directory

// Load search history from JSON file
const loadSearchHistory = () => {
    if (fs.existsSync('searchHistory.json')) {
        const data = fs.readFileSync('searchHistory.json');
        return JSON.parse(data);
    }
    return [];
};

// Save search history to JSON file
const saveSearchHistory = (history) => {
    fs.writeFileSync('searchHistory.json', JSON.stringify(history, null, 2));
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html'); // Serve index.html
});

// Get search history
app.get('/api/weather/history', (req, res) => {
    const history = loadSearchHistory();
    res.json(history);
});

// Post a new city to search history and fetch weather data
app.post('/api/weather', async (req, res) => {
    const city = req.body.city;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    // Fetch geographical coordinates
    const geoResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
    const { lat, lon } = geoResponse.data.coord;

    // Fetch weather data using coordinates
    const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    
    // Load search history
    const history = loadSearchHistory();
    const newEntry = { id: history.length + 1, city: city };
    history.push(newEntry);
    saveSearchHistory(history);

    res.json(weatherResponse.data);
});

// Delete a city from search history
app.delete('/api/weather/history/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let history = loadSearchHistory();
    history = history.filter(entry => entry.id !== id);
    saveSearchHistory(history);
    res.json({ message: 'City deleted from search history' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});