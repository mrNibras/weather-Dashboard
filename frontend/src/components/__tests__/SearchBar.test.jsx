import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../SearchBar';

describe('SearchBar Component', () => {
  test('renders input field with placeholder', () => {
    render(<SearchBar onSearch={jest.fn()} />);
    
    const input = screen.getByPlaceholderText('Search for a city...');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('bg-white/10');
  });

  test('updates input value when typing', () => {
    render(<SearchBar onSearch={jest.fn()} />);
    
    const input = screen.getByPlaceholderText('Search for a city...');
    fireEvent.change(input, { target: { value: 'New York' } });
    
    expect(input.value).toBe('New York');
  });

  test('calls onSearch prop when form is submitted', () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search for a city...');
    fireEvent.change(input, { target: { value: 'London' } });
    
    const form = screen.getByRole('textbox').closest('form');
    fireEvent.submit(form);
    
    expect(mockOnSearch).toHaveBeenCalledWith('London');
  });

  test('does not call onSearch when input is empty', () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const form = screen.getByRole('textbox').closest('form');
    fireEvent.submit(form);
    
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  test('trims whitespace from input before calling onSearch', () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search for a city...');
    fireEvent.change(input, { target: { value: '  Tokyo  ' } });
    
    const form = screen.getByRole('textbox').closest('form');
    fireEvent.submit(form);
    
    expect(mockOnSearch).toHaveBeenCalledWith('Tokyo');
  });
});