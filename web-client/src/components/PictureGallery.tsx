import { gql, useMutation } from '@apollo/client';
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

const StyledPictureGalleryItemImage = styled.img`
  width: 100%;
`;

const UPLOAD_PICTURE = gql`
  mutation UploadPicture($file: Upload!) {
    uploadPicture(file: $file) {
      id
    }
  }
`;

const PictureGallery = (): JSX.Element => {
  const data = {
    pictures: [],
  };
  const [mutate, { loading, error }] = useMutation(UPLOAD_PICTURE);

  const uploadPicture = ({
    target: {
      validity,
      files: [file],
    },
  }: any) => {
    validity.valid && mutate({ variables: { file } });
  };

  return (
    <>
      <h1>Galerie</h1>
      <form>
        <InputTypeFileButton
          type="file"
          id="file"
          required
          accept="image/*"
          onChange={uploadPicture}
        />
        <label htmlFor="file">Ajouter une image</label>
      </form>
      <StyledPictureGallery>
        {data?.pictures.map(({ id }) => (
          <StyledPictureGalleryItem key={id}>
            <StyledPictureGalleryItemImage
              src={`http://localhost:4000/public/media/pictures/${id}.jpg`}
            />
          </StyledPictureGalleryItem>
        ))}
      </StyledPictureGallery>
    </>
  );
};

export default PictureGallery;
