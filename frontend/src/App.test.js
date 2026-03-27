import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';

jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn()
}));

jest.mock('react-chartjs-2', () => ({
  Bar: () => <div>Mock Chart</div>
}));

import App from './App';

beforeEach(() => {
  axios.get.mockResolvedValue({ data: [] });
  axios.post.mockResolvedValue({ data: { message: 'Deployment started' } });
});

test('renders DevOps Dashboard title', async () => {
  render(<App />);
  await waitFor(() => expect(axios.get).toHaveBeenCalled());
  const element = screen.getByText(/DevOps Dashboard/i);
  expect(element).toBeInTheDocument();
});
