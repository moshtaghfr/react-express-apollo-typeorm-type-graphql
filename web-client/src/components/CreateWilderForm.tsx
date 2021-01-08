import React, { useState } from 'react';
import { Button } from './elements/Buttons';

const CreateWilderForm = (): JSX.Element => {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <Button
        onClick={() => {
          setShowForm(!showForm);
        }}
      >
        {showForm ? 'Cacher le formulaire' : 'Montrer le formulaire'}
      </Button>
      {showForm && <form aria-label="form">TODO: formulaire</form>}
    </>
  );
};

export default CreateWilderForm;
