import { Router, Request, Response } from 'express';
import type { RequestHandler } from 'express';
import HistoryService from '../../service/historyService.js';
import weatherService from '../../service/weatherService.js';
const router = Router();

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  try {
    const { cityName } = req.body;
    if (!cityName) {
      return res.status(400).json({ error: 'City name is required' });
    }

    const weatherData = await weatherService.getWeatherForCity(cityName);
    await HistoryService.addCity(cityName);
    return res.json(weatherData);
  } catch (error: any) {
    console.error('Weather route error:', error);
    if (error.message === 'City not found') {
      return res.status(404).json({ error: 'City not found' });
    }
    return res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities();
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    await HistoryService.removeCity(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete city' });
  }
});

export default router;
