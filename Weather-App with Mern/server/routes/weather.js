const express = require('express');
const axios = require('axios');
const router = express.Router();

const popularCities = ['Delhi', 'Kanpur', 'Lucknow', 'Mumbai', 'Pune', 'Chandigarh', 'Mathura', 'Noida'];

router.get('/', async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: 'City is required' });

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const urlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    const [currentRes, forecastRes] = await Promise.all([
      axios.get(urlCurrent),
      axios.get(urlForecast)
    ]);

    const currentData = currentRes.data;
    const forecastData = forecastRes.data;

    const forecast = forecastData.list.slice(0, 5).map(item => ({
      date: item.dt_txt,
      temperature: item.main.temp,
      weather: item.weather[0].description,
      icon: item.weather[0].icon
    }));

    const result = {
      city: currentData.name,
      temperature: currentData.main.temp,
      weather: currentData.weather[0].description,
      icon: currentData.weather[0].icon,
      humidity: currentData.main.humidity,
      windSpeed: currentData.wind.speed,
      forecast
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch weather data' });
  }
});

router.get('/suggestions', (req, res) => {
  res.json({ suggestions: popularCities });
});

module.exports = router;