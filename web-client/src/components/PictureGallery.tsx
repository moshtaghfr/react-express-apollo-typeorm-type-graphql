import React from 'react';
import styled from 'styled-components';

import { InputTypeFileButton } from './elements/Buttons';

const StyledPictureGallery = styled.ul`
  list-style-type: none;
  padding-inline-start: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(293px, 1fr));
  gap: 18px;
`;

const StyledPictureGalleryItem = styled.li``;

const StyledPictureGalleryItemImage = styled.img``;

const PictureGallery = (): JSX.Element => {
  const data = {
    pictures: [],
  };

  return (
    <>
      <h1>Galerie</h1>
      <InputTypeFileButton type="file" id="file" required accept="image/*" />
      <label htmlFor="file">Ajouter une image</label>
      <StyledPictureGallery>
        {data?.pictures.map(({ id }) => (
          <StyledPictureGalleryItem key={id}>
            <StyledPictureGalleryItemImage src={`/media/pictures/${id}`} />
          </StyledPictureGalleryItem>
        ))}
      </StyledPictureGallery>
    </>
  );
};

export default PictureGallery;
