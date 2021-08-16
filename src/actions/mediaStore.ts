import RNAndroidAudioStore from '@yajanarao/react-native-get-music-files';
import groupBy from 'lodash/groupBy';
import values from 'lodash/values';
import orderBy from 'lodash/orderBy';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import RNFS from 'react-native-fs';
import { Platform } from 'react-native';

import { log } from '../utils/logging';
import { TrackProps } from '../utils/types';
import { downloadFolderPath } from './consts';

// const DOWNLOADED_ID = "user-playlist--000004";

export const addSongToDownloads = (song: TrackProps) => {
  // addSong(DOWNLOADED_ID, song, true);
};

export const updateQuery =
  (query: string, category: string) =>
    async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
      if (query) {
        const media = [];
        try {
          const offlineMedia = await RNAndroidAudioStore.search({
            searchParam: query,
          });
          if (offlineMedia && offlineMedia.length) {
            media.push({
              title: 'Offline Songs',
              data: offlineMedia,
            });
          }

          dispatch({
            type: 'UPDATE_QUERY',
            payload: media,
          });
        } catch (error) {
          log.error('Search', error);
          dispatch({
            type: 'UPDATE_QUERY',
            payload: false,
          });
        }
      }
    };

export const getOfflineSongs =
  () => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    RNAndroidAudioStore.getAll({})
      .then(media => {
        if (media === 'Something get wrong with musicCursor') {
          media = [];
        }
        dispatch({
          type: 'OFFLINE_SONGS',
          payload: media,
        });
      })
      .catch(er => {
        log.error('getOfflineSongs', er);
        dispatch({
          type: 'OFFLINE_SONGS',
          payload: [],
        });
      });
  };

export const getOfflineArtists =
  () => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    RNAndroidAudioStore.getArtists({})
      .then(media => {
        dispatch({
          type: 'OFFLINE_ARTISTS',
          payload: media,
        });
      })
      .catch(er => {
        log.error('getOfflineArtists', er);
        dispatch({
          type: 'NOTIFY',
          payload: 'Something went wrong',
        });
      });
  };

export const getOfflineAlbums =
  () => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    RNAndroidAudioStore.getAlbums({})
      .then(media => {
        dispatch({
          type: 'OFFLINE_ALBUMS',
          payload: media,
        });
      })
      .catch(er => {
        log.error('getOfflineAlbums', er);
        dispatch({
          type: 'NOTIFY',
          payload: 'Something went wrong',
        });
      });
  };

export const findAlbumSongs = async (album: string) => {
  const songs = await RNAndroidAudioStore.getSongs({
    album,
  })
    .then(media => media)
    .catch(er => log.error('findAlbumSongs', er));
  return songs;
};

export const findArtistSongs = async (artist: string) => {
  const songs = await RNAndroidAudioStore.getSongs({
    artist,
  })
    .then(media => media)
    .catch(er => log.error('findArtistSongs', er));
  return songs;
};

export const filterSongsByGenre = async (genre: string) => {
  try {
    const songs = await RNAndroidAudioStore.getSongsByGenres({ genre });
    return songs;
  } catch (error) {
    log.error('filterSongsByGenre', error);
  }
};

export const mostPlayedSongs = (array: []) => {
  return orderBy(
    values(groupBy(array, 'title')).map(group => ({
      ...group[0],
      count: group.length,
    })),
  );
};
const _downloadFileProgress = data => {
  const percentage = ((100 * data.bytesWritten) / data.contentLength) | 0;
  const text = `Progress ${percentage}%`;
  console.log('download file progress: ', text);
  // if (percentage == 100) {
  // }
};

function download(url: string, filePath: string) {
  // if (Platform.OS === 'ios') {
  //   filePath = 'file://' + filePath;
  // }
  const { promise } = RNFS.downloadFile({
    fromUrl: url,
    toFile: filePath,
    progress: data => _downloadFileProgress(data),
  });
  return promise;
}

async function checkFolderPath(folderPath: string) {
  try {
    const isPresent = await RNFS.exists(folderPath);
    log.debug('is folder present: ', isPresent);
    if (!isPresent) {
      await RNFS.mkdir(folderPath);
    }
  } catch (error) {
    log.error('checkFolderPath', error);
  }
}

export const downloadMedia =
  (item: TrackProps) => async (dispatch, getState) => {
    try {
      if (item) {
        // const {offlineWriteAccessGiven} = getState().user;
        // if (!offlineWriteAccessGiven) {
        //   dispatch({
        //     payload: `Download songs by Granting Storage Permission`,
        //     type: 'NOTIFY',
        //   });
        //   dispatch(giveWriteOfflineAccess());
        //   return;
        // }
        dispatch({
          payload:
            'Started download. You will be notified once the file is downloaded',
          type: 'NOTIFY',
        });

        await checkFolderPath(downloadFolderPath);
        // if (includes(['online'], item.type.toLowerCase())) {
        let fileName = item.title.replace(/\s+/g, '-').toLowerCase();
        const filePath = `${downloadFolderPath}/${fileName}.mp3`;
        const response = await download(item.path, filePath);
        // item.path = filePath;
        console.log(response);
        log.debug('downloadMedia', filePath);

        // }
        // addSongToDownloads(item);
        dispatch({
          payload: `File ${item.title} downloaded successfully`,
          type: 'NOTIFY',
        });
      }
    } catch (error) {
      log.error('downloadMedia', error);
      dispatch({
        payload: `downloadMedia ${item.title} from youtube failed`,
        type: 'NOTIFY',
      });
    }
  };
