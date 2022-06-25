// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Album, Song } = initSchema(schema);

export {
  Album,
  Song
};