// src/setupTests.js
import '@testing-library/jest-dom';  // if you want jest-dom matchers

// 1. transformIgnorePatterns only allows Jest to *parse* axios,
//    but we still need to stub its network calls in our tests:
jest.mock('axios', () => ({
  get:    jest.fn(),
  post:   jest.fn(),
  put:    jest.fn(),
  delete: jest.fn()
}));

// 2. Prevent the canvas errors from Chart.js in JSDOM:
jest.mock('react-chartjs-2', () => ({
  Line: () => null,
  Bar:  () => null
}));
