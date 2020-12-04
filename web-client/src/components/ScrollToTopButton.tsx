import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 12px;
  border: none;
  border-radius: 19px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.375);
  background-color: black;
  color: #fafafa;
  text-transform: uppercase;
  font-weight: bold;
`;

const ScrollToTopButton = (): JSX.Element => (
  <StyledButton
    onClick={() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }}
  >
    Revenir en haut
  </StyledButton>
);

export default ScrollToTopButton;
