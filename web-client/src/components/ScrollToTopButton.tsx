import React from 'react';
import { FixedButton } from './elements/Buttons';

const ScrollToTopButton = (): JSX.Element => (
  <FixedButton
    onClick={() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }}
  >
    Revenir en haut
  </FixedButton>
);

export default ScrollToTopButton;
