import React, { useState } from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: 12px;
  border: none;
  border-radius: 19px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.375);
  background-color: black;
  color: #fafafa;
  text-transform: uppercase;
  font-weight: bold;
`;

const CreateWilderForm = (): JSX.Element => {
  const [showForm, setShowForm] = useState(false);

  return showForm ? (
    <>
      <StyledButton
        onClick={() => {
          setShowForm(false);
        }}
      >
        Cacher le formulaire
      </StyledButton>
      <form aria-label="form">TODO: formulaire</form>
    </>
  ) : (
    <StyledButton
      onClick={() => {
        setShowForm(true);
      }}
    >
      Montrer le formulaire
    </StyledButton>
  );
};

export default CreateWilderForm;
