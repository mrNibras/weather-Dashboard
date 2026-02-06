const request = require('supertest');
const express = require('express');
const app = require('../server'); // Import the configured app

describe('Weather API Endpoints', () => {
  jest.setTimeout(10000); // Increase timeout for API calls

  // Mock environment variable for tests
  beforeAll(() => {
    process.env.WEATHER_API_KEY = 'test_api_key';
  });

  describe('GET /api/weather', () => {
    test('should return error when no city or coordinates are provided', async () => {
      const response = await request(app)
        .get('/api/weather')
        .expect(400);
      
      expect(response.body).toEqual({
        message: 'City or coordinates must be provided.'
      });
    });

    test('should return error when API key is not configured', async () => {
      // Temporarily remove the API key
      delete process.env.WEATHER_API_KEY;
      
      const response = await request(app)
        .get('/api/weather?city=London')
        .expect(500);
      
      expect(response.body).toEqual({
        message: 'Weather API key is not configured on the server.'
      });
      
      // Restore the API key
      process.env.WEATHER_API_KEY = 'test_api_key';
    });

    test('should accept city parameter and return appropriate response structure', async () => {
      const response = await request(app)
        .get('/api/weather?city=London')
        .expect(401); // Expect 401 since we're using a fake API key
      
      // When using a fake API key, we expect an error from OpenWeatherMap
      expect(response.body).toHaveProperty('message');
    });

    test('should accept coordinates and return appropriate response structure', async () => {
      const response = await request(app)
        .get('/api/weather?lat=51.5074&lon=-0.1278')
        .expect(401); // Expect 401 since we're using a fake API key
      
      // When using a fake API key, we expect an error from OpenWeatherMap
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Static file serving', () => {
    test('should serve the main index.html file', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      expect(response.text).toContain('<div id="root"></div>');
    });
  });

  describe('Catch-all route', () => {
    test('should serve index.html for non-API routes', async () => {
      const response = await request(app)
        .get('/non-existent-route')
        .expect(200);
      
      expect(response.text).toContain('<div id="root"></div>');
    });

    test('should not interfere with API routes', async () => {
      const response = await request(app)
        .get('/api/non-existent-endpoint')
        .expect(404);
    });
  });
});