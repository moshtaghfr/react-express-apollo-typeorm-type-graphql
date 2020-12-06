import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import ScrollToTopButton from './ScrollToTopButton';

describe('ScrollToTopButton', () => {
  it('renders button', () => {
    render(<ScrollToTopButton />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  describe('when clicked', () => {
    it('scrolls to page top', () => {
      window.scrollTo = jest.fn();
      render(<ScrollToTopButton />);

      fireEvent.click(screen.getByRole('button'));
      expect(window.scrollTo).toHaveBeenCalledTimes(1);
    });
  });
});
