import { getWeatherDataByCity, getWeatherDataByCoords } from '../services/weatherService';

// Mock the global fetch function
global.fetch = jest.fn();

describe('Weather Service', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('getWeatherDataByCity', () => {
    it('should call the API with the correct city parameter', async () => {
      const mockData = { name: 'London', weather: [] };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await getWeatherDataByCity('London');

      expect(fetch).toHaveBeenCalledWith('/api/weather?city=London');
      expect(result).toEqual(mockData);
    });

    it('should encode city names with special characters', async () => {
      const mockData = { name: 'New York', weather: [] };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await getWeatherDataByCity('New York, USA');

      expect(fetch).toHaveBeenCalledWith('/api/weather?city=New%20York%2C%20USA');
    });

    it('should throw an error when the response is not ok', async () => {
      const mockError = { message: 'City not found' };
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      });

      await expect(getWeatherDataByCity('InvalidCity')).rejects.toThrow('City not found');
    });
  });

  describe('getWeatherDataByCoords', () => {
    it('should call the API with the correct coordinates', async () => {
      const mockData = { name: 'London', coord: { lat: 51.5074, lon: -0.1278 } };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await getWeatherDataByCoords(51.5074, -0.1278);

      expect(fetch).toHaveBeenCalledWith('/api/weather?lat=51.5074&lon=-0.1278');
      expect(result).toEqual(mockData);
    });

    it('should throw an error when the response is not ok', async () => {
      const mockError = { message: 'Coordinates not found' };
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      });

      await expect(getWeatherDataByCoords(999, 999)).rejects.toThrow('Coordinates not found');
    });
  });
});