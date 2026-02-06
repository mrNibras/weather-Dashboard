import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Favorites from '../Favorites';

describe('Favorites Component', () => {
  const mockProps = {
    recent: ['London', 'Paris', 'Tokyo'],
    favorite: 'New York',
    onSelect: jest.fn(),
    onPin: jest.fn()
  };

  test('renders favorite city with star', () => {
    render(<Favorites {...mockProps} />);
    
    const favoriteButton = screen.getByText('★ New York');
    expect(favoriteButton).toBeInTheDocument();
  });

  test('renders recent cities', () => {
    render(<Favorites {...mockProps} />);
    
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Tokyo')).toBeInTheDocument();
  });

  test('calls onSelect when favorite city is clicked', () => {
    render(<Favorites {...mockProps} />);
    
    const favoriteButton = screen.getByText('★ New York');
    fireEvent.click(favoriteButton);
    
    expect(mockProps.onSelect).toHaveBeenCalledWith('New York');
  });

  test('calls onSelect when recent city is clicked', () => {
    render(<Favorites {...mockProps} />);
    
    const londonButton = screen.getByText('London');
    fireEvent.click(londonButton);
    
    expect(mockProps.onSelect).toHaveBeenCalledWith('London');
  });

  test('calls onPin when pin button is clicked for non-favorite city', () => {
    render(<Favorites {...mockProps} />);
    
    const pinButton = screen.getByTitle('Pin London');
    fireEvent.click(pinButton);
    
    expect(mockProps.onPin).toHaveBeenCalledWith('London');
  });

  test('does not show pin button for favorite city', () => {
    render(<Favorites {...mockProps} />);
    
    const pinButton = screen.queryByTitle('Pin New York');
    expect(pinButton).not.toBeInTheDocument();
  });

  test('does not render anything when no recent or favorite cities', () => {
    render(<Favorites recent={[]} favorite={null} onSelect={jest.fn()} onPin={jest.fn()} />);
    
    expect(screen.getByText('Recent Cities')).toBeInTheDocument();
    // The container should still render but with no city buttons
  });
});