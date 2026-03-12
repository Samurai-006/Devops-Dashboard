import { render, screen } from '@testing-library/react';
import App from './App';

test('renders DevOps Dashboard title', () => {
  render(<App />);
  const element = screen.getByText(/DevOps Dashboard/i);
  expect(element).toBeInTheDocument();
});
