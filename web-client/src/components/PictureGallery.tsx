import { gql, useMutation, useQuery } from '@apollo/client';
import React from 'react';
import styled from 'styled-components';
import { GetPictures, UploadPicture } from '../schemaTypes';

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

export const GET_PICTURES = gql`
  query GetPictures {
    pictures {
      id
      extension
    }
  }
`;

const UPLOAD_PICTURE = gql`
  mutation UploadPicture($file: Upload!) {
    uploadPicture(file: $file) {
      id
      extension
    }
  }
`;

const PictureGallery = (): JSX.Element => {
  const { loading, error, data } = useQuery<GetPictures>(GET_PICTURES);
  const [mutate] = useMutation<UploadPicture>(UPLOAD_PICTURE);

  const uploadPicture = ({
    target: {
      validity,
      files: [file],
    },
  }: any) => {
    validity.valid &&
      mutate({
        variables: { file },
        update: (cache, { data }) => {
          const existingData: GetPictures | null = cache.readQuery({
            query: GET_PICTURES,
          });
          if (existingData && data) {
            cache.writeQuery({
              query: GET_PICTURES,
              data: {
                ...existingData,
                pictures: [...existingData.pictures, data.uploadPicture],
              },
            });
          }
        },
      });
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
      {loading ? (
        <div>Chargement en cours…</div>
      ) : error ? (
        <div>Erreur de chargement.</div>
      ) : (
        <StyledPictureGallery>
          {data?.pictures.map(({ id, extension }) => (
            <StyledPictureGalleryItem key={id}>
              <StyledPictureGalleryItemImage
                src={`http://localhost:4000/public/media/pictures/${id}${extension}`}
              />
            </StyledPictureGalleryItem>
          ))}
        </StyledPictureGallery>
      )}
    </>
  );
};

export default PictureGallery;
