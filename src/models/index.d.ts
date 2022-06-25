import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type AlbumMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type SongMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Album {
  readonly id: string;
  readonly title?: string | null;
  readonly cover?: string | null;
  readonly Songs?: (Song | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Album, AlbumMetaData>);
  static copyOf(source: Album, mutator: (draft: MutableModel<Album, AlbumMetaData>) => MutableModel<Album, AlbumMetaData> | void): Album;
}

export declare class Song {
  readonly id: string;
  readonly title?: string | null;
  readonly artist?: string | null;
  readonly album?: string | null;
  readonly cover?: string | null;
  readonly path?: string | null;
  readonly albumID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Song, SongMetaData>);
  static copyOf(source: Song, mutator: (draft: MutableModel<Song, SongMetaData>) => MutableModel<Song, SongMetaData> | void): Song;
}