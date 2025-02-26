import dotenv from 'dotenv';
import type { Coordinates, Weather } from '../types.js';

dotenv.config();

class WeatherService {
  private baseURL = 'https://api.openweathermap.org/data/2.5';
  private apiKey: string;

  constructor() {
    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
      throw new Error('WEATHER_API_KEY environment variable is not set');
    }
    this.apiKey = apiKey;
  }

  private async fetchLocationData(query: string) {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=${this.apiKey}`
    );
    const data = await response.json();
    return data;
  }

  private destructureLocationData(locationData: any[]): Coordinates {
    if (!locationData || !locationData.length) {
      throw new Error('City not found');
    }
    const [location] = locationData;
    return {
      lat: location.lat,
      lon: location.lon
    };
  }

  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
  }

  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    return await response.json();
  }

  private parseWeatherData(data: any): Weather {
    return {
      temp: data.main.temp,
      wind: data.wind.speed,
      humidity: data.main.humidity,
      icon: data.weather[0].icon,
      description: data.weather[0].description,
      date: data.dt_txt || new Date().toISOString()
    };
  }

  async getWeatherForCity(city: string): Promise<Weather[]> {
    try {
      const locationData = await this.fetchLocationData(city);
      const coordinates = this.destructureLocationData(locationData);
      const weatherData = await this.fetchWeatherData(coordinates);
      
      // Get current weather and next 5 days (every 24 hours)
      const forecasts = weatherData.list.filter((_: any, index: number) => index % 8 === 0);
      return forecasts.map((forecast: any) => this.parseWeatherData(forecast));
    } catch (error) {
      console.error('Error fetching weather:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export default new WeatherService();
