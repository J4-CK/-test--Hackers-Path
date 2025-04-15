import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from '../../../components/Loading';

describe('Loading Component', () => {
  it('renders loading spinner and text', () => {
    render(<Loading />);
    
    // Check for loading container
    const loadingContainer = screen.getByText('Loading...').closest('.loading-container');
    expect(loadingContainer).toBeInTheDocument();
    
    // Check for spinner
    const spinner = loadingContainer.querySelector('.loading-spinner');
    expect(spinner).toBeInTheDocument();
    
    // Check for text
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
}); 