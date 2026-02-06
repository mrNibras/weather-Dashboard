import React from 'react';
import { render, screen } from '@testing-library/react';
import CurrentWeather from '../CurrentWeather';

describe('CurrentWeather Component', () => {
  const mockWeatherData = {
    name: 'London',
    weather: [
      {
        main: 'Clear',
        description: 'clear sky',
        icon: '01d'
      }
    ],
    main: {
      temp: 15.5,
      humidity: 70
    },
    wind: {
      speed: 3.5
    },
    sys: {
      country: 'GB',
      sunrise: 1620000000,
      sunset: 1620050000
    }
  };

  test('renders city name and country', () => {
    render(<CurrentWeather data={mockWeatherData} />);
    
    expect(screen.getByText('London, GB')).toBeInTheDocument();
    expect(screen.getByText('clear sky')).toBeInTheDocument();
  });

  test('renders temperature', () => {
    render(<CurrentWeather data={mockWeatherData} />);
    
    expect(screen.getByText('16°')).toBeInTheDocument(); // Rounded temperature
  });

  test('renders weather icon', () => {
    render(<CurrentWeather data={mockWeatherData} />);
    
    const img = screen.getByAltText('clear sky');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://openweathermap.org/img/wn/01d@4x.png');
  });

  test('renders weather details', () => {
    render(<CurrentWeather data={mockWeatherData} />);
    
    expect(screen.getByText('3.5 m/s')).toBeInTheDocument(); // Wind speed
    expect(screen.getByText('70%')).toBeInTheDocument(); // Humidity
  });

  test('formats time correctly for sunrise/sunset', () => {
    render(<CurrentWeather data={mockWeatherData} />);
    
    // Note: Time format depends on the user's locale, so we just check if the elements exist
    const timeElements = screen.getAllByText(/:/); // Look for time separators
    expect(timeElements).toHaveLength(2); // Sunrise and sunset
  });

  test('renders nothing when no data is provided', () => {
    const { container } = render(<CurrentWeather data={null} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders nothing when weather data is missing', () => {
    const { container } = render(<CurrentWeather data={{}} />);
    expect(container.firstChild).toBeNull();
  });
});