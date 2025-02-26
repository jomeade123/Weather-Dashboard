export interface Coordinates {
  lat: number;
  lon: number;
}

export interface Weather {
  temp: number;
  wind: number;
  humidity: number;
  icon: string;
  description: string;
  date: string;
}

export interface City {
  id: string;
  name: string;
} 