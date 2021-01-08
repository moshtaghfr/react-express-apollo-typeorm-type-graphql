import path from 'path';
import { Stream } from 'stream';
import {
  Column,
  Generated,
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { writeFileToPicturesDirectory } from '../utils';

@Entity()
@ObjectType()
export default class Picture extends BaseEntity {
  @PrimaryGeneratedColumn()
  _id!: string;

  @Index()
  @Column()
  @Generated('uuid')
  @Field(() => ID)
  id!: string;

  @Column()
  @Field(() => String)
  extension!: string;
}

const saveAndWritePictureToFile = async (
  originalFilename: string,
  stream: Stream
): Promise<Picture> => {
  const extension = path.extname(originalFilename);
  const picture = Picture.create({ extension });
  await picture.save();
  const newFilename = `${picture.id}${extension}`;
  await writeFileToPicturesDirectory(stream, newFilename);
  return picture;
};

export { saveAndWritePictureToFile };
