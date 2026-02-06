import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import * as weatherService from '../services/weatherService';

// Mock the weather service
jest.mock('../services/weatherService');
jest.mock('lucide-react', () => ({
  MapPin: () => <div data-testid="map-pin-icon" />,
}));

// Mock localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
};

Object.defineProperty(navigator, 'geolocation', {
  value: mockGeolocation,
});

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
    
    // Mock successful geolocation by default
    mockGeolocation.getCurrentPosition.mockImplementation((success) => 
      Promise.resolve(success({
        coords: {
          latitude: 51.5074,
          longitude: -0.1278,
          accuracy: 10
        }
      }))
    );
  });

  test('renders search bar and location button', () => {
    render(<App />);
    
    expect(screen.getByPlaceholderText('Search for a city...')).toBeInTheDocument();
    expect(screen.getByTestId('map-pin-icon')).toBeInTheDocument();
  });

  test('allows searching for a city', async () => {
    const mockWeatherData = {
      name: 'London',
      weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
      main: { temp: 15, humidity: 70 },
      wind: { speed: 3.5 },
      sys: { country: 'GB', sunrise: 1620000000, sunset: 1620050000 }
    };
    
    weatherService.getWeatherDataByCity.mockResolvedValue(mockWeatherData);
    
    render(<App />);
    
    const searchInput = screen.getByPlaceholderText('Search for a city...');
    fireEvent.change(searchInput, { target: { value: 'London' } });
    
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(screen.getByText('London, GB')).toBeInTheDocument();
    });
  });

  test('handles search errors gracefully', async () => {
    weatherService.getWeatherDataByCity.mockRejectedValue(
      new Error({ response: { data: { message: 'City not found' } } })
    );
    
    render(<App />);
    
    const searchInput = screen.getByPlaceholderText('Search for a city...');
    fireEvent.change(searchInput, { target: { value: 'InvalidCity' } });
    
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
    });
  });

  test('uses geolocation when location button is clicked', async () => {
    const mockWeatherData = {
      name: 'London',
      weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
      main: { temp: 15, humidity: 70 },
      coord: { lat: 51.5074, lon: -0.1278 }
    };
    
    weatherService.getWeatherDataByCoords.mockResolvedValue(mockWeatherData);
    
    render(<App />);
    
    const locationButton = screen.getByTestId('map-pin-icon');
    fireEvent.click(locationButton);
    
    await waitFor(() => {
      expect(weatherService.getWeatherDataByCoords).toHaveBeenCalledWith(51.5074, -0.1278);
    });
  });

  test('shows loading state during API calls', async () => {
    const mockWeatherData = { name: 'London', weather: [] };
    weatherService.getWeatherDataByCity.mockResolvedValue(mockWeatherData);
    
    render(<App />);
    
    const searchInput = screen.getByPlaceholderText('Search for a city...');
    fireEvent.change(searchInput, { target: { value: 'London' } });
    
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    
    expect(screen.getByText('Seeking the elements...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByText('Seeking the elements...')).not.toBeInTheDocument();
    });
  });
});