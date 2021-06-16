import { EmitterSubscription } from 'react-native';
import head from 'lodash/head';
import isEmpty from 'lodash/isEmpty';
import sample from 'lodash/sample';

import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import {
  addSong,
  removeSong,
  getQueuedSongs,
  getPlayedSongs,
  clearAllSongs,
  addAlbum,
  removeAlbum,
  unshiftSong,
} from './realmAction';
import { deserializeSongs } from '../utils/database';
import { log } from '../utils/logging';
import { TrackProps, AlbumProps } from '../utils/types';
import TrackPlayer, { STATE_BUFFERING, STATE_PAUSED, STATE_PLAYING, STATE_STOPPED } from 'react-native-track-player';

let subscription: EmitterSubscription;

const QUEUE_ID = 'user-playlist--000003';
const HISTORY_ID = 'user-playlist--000001';
const FAVOURITE_ID = 'user-playlist--000002';

export const setUpTrackPlayer =
  () => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    try {
      TrackPlayer.updateOptions({
        stopWithApp: true,
        // Media controls capabilities
        capabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
          TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
          TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS
          // TrackPlayer.CAPABILITY_NEXT,
          // TrackPlayer.CAPABILITY_PREVIOUS,
        ],

        // Capabilities that will show up when the notification is in the compact form on Android
        compactCapabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE
        ],
      });
      TrackPlayer.setupPlayer();
      subscription = TrackPlayer.addEventListener('playback-state', event => {
        // handle event
        const { state } = event;
        if (state === STATE_PLAYING) {
          dispatch({
            status: 'playing',
            type: 'STATUS',
          });
        } else if (state === STATE_PAUSED) {
          dispatch({
            status: 'paused',
            type: 'STATUS',
          });
        } else if (state === STATE_STOPPED) {
          dispatch({
            status: 'complete',
            type: 'STATUS',
          });
        }
        else if (state === STATE_BUFFERING) {
          dispatch({
            status: 'loading',
            type: 'STATUS',
          });
        }
      });


    } catch (error) {
      log.error('setUpTrackPlayer', error);
    }
  };

export const loadTrack =
  (track: TrackProps, playOnLoad = true) =>
    async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
      try {
        TrackPlayer.reset();
        const { path } = track;
        let audioUrl = path;
        log.debug('loadTrack', `load track: ${track.path}`);
        if (path) {
          dispatch({
            track,
            type: 'LOAD',
          });
          track.url = audioUrl;
          await TrackPlayer.add([track]);
          TrackPlayer.play();
        } else {
          log.debug(
            'loadTrack',
            `path does not exist for track track: ${track.title} `,
          );
        }
      } catch (error) {
        log.error(`loadTrack`, error);
      }
    };

export const playNext =
  (track: TrackProps) =>
    (dispatch: ThunkDispatch<undefined, undefined, AnyAction>, getState) => {
      try {
        unshiftSong(QUEUE_ID, track);
        if (isEmpty(getState().playerState.active)) {
          const queue = getQueuedSongs();
          dispatch(loadTrack(head(queue)));
        }
      } catch (error) {
        log.error('playNext', error);
      }
    };

export const repeatSongs =
  (type: string) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    try {
      dispatch({
        repeat: type,
        type: 'REPEAT',
      });
    } catch (error) {
      log.error('repeatSongs', error);
    }
  };

export const shufflePlay =
  (songs: TrackProps[]) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    try {
      dispatch({
        songs,
        type: 'SHUFFLE_PLAY',
      });
    } catch (error) {
      log.error('shufflePlay', error);
    }
  };

export const startRadio =
  () => (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState) => {
    try {
      const track = sample(getState().mediaStore.songs);
      if (track) {
        dispatch(loadTrack(track));
        dispatch({
          payload: true,
          type: 'RADIO_MODE',
        });
      }
    } catch (error) {
      log.error('startRadio', error);
    }
  };

export const skipToNext =
  () => (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState) => {
    try {
      const queue = deserializeSongs(getQueuedSongs());
      let track = null;
      const { config } = getState();
      if (config.repeat === 'repeat-one') {
        const playedTrack = getState().playerState.active;
        addSong(HISTORY_ID, playedTrack);
        dispatch(playTrack());
      } else if (config.repeat === 'repeat-all' && queue.length) {
        const playedTrack = getState().playerState.active;
        track = head(queue);
        addSong(HISTORY_ID, playedTrack);
        removeSong(QUEUE_ID, track);
      } else if (config.radio && config.repeat !== 'repeat-off') {
        const playedTrack = getState().playerState.active;
        track = sample(getState().mediaStore.songs);
        addSong(HISTORY_ID, playedTrack);
      }

      if (track) {
        dispatch(loadTrack(track));
      } else {
        TrackPlayer.pause();
        dispatch({
          status: 'paused',
          type: 'STATUS',
        });
      }
    } catch (error) {
      log.error(`skipToNext`, error);
    }
  };

export const skipToPrevious =
  () => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    try {
      const history = getPlayedSongs();
      if (history.length) {
        const track = head(history);
        // addSong(QUEUE_ID, track);
        if (track) {
          dispatch(loadTrack(track));
        }
      } else {
        TrackPlayer.pause();
        dispatch({
          payload: 'Playing prevoius song',
          type: 'NOTIFY',
        });
      }
    } catch (error) {
      log.error('skipToPrevious', error);
    }
  };

export const destroyTrackPlayer =
  () => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    TrackPlayer.destroy();
    if (subscription !== undefined) {
      subscription.remove();
    }
    dispatch({
      payload: 'paused',
      type: 'STATUS',
    });
  };

// NOTE: Queue management

export const addToQueue =
  (songs: TrackProps[] | TrackProps) =>
    (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState) => {
      if (Array.isArray(songs)) {
        songs.forEach(song => {
          addSong(QUEUE_ID, song, true);
        });
      } else {
        addSong(QUEUE_ID, songs, true);
      }

      if (isEmpty(getState().playerState.active)) {
        const queue = getQueuedSongs();
        dispatch(loadTrack(head(queue)));
      } else {
        dispatch({
          payload: `Added ${songs.length || songs.title} songs to queue`,
          type: 'NOTIFY',
        });
      }
    };

export const removeFromQueue =
  (song: TrackProps) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    removeSong(QUEUE_ID, song);
    dispatch({
      payload: song,
      type: 'REMOVE_QUEUE',
    });
  };

export const clearQueue =
  () => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    TrackPlayer.pause();
    clearAllSongs(QUEUE_ID);
    dispatch({
      status: 'init',
      track: {},
      type: 'LOAD',
    });
  };

export const addSongToFavorite =
  (song: TrackProps) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    addSong(FAVOURITE_ID, song, true);
    dispatch({
      payload: `Added song ${song.title}to favorites`,
      type: 'NOTIFY',
    });
  };

export const addAlbumToFavorite =
  (album: AlbumProps) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    addAlbum(album);
    dispatch({
      payload: `Added album ${album.album} to favorite`,
      type: 'NOTIFY',
    });
  };

export const removeAlbumFromFavorite =
  (album: AlbumProps) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    removeAlbum(album.id);
    dispatch({
      payload: `Album removed from favorites`,
      type: 'NOTIFY',
    });
  };

export const addToPlaylist =
  (id: string, song: TrackProps) =>
    (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
      addSong(id, song);
      dispatch({
        payload: 'Added to the playlist',
        type: 'NOTIFY',
      });
    };

export const clearHistory =
  () => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    clearAllSongs(HISTORY_ID);
    dispatch({
      payload: 'Cleared history',
      type: 'NOTIFY',
    });
  };

export const playTrack = () => {
  try {
    TrackPlayer.play();
  } catch (error) {
    log.error(`playTrack`, error);
  }
};

export const pauseTrack = () => {
  try {
    TrackPlayer.pause();
  } catch (error) {
    log.error('pauseTrack', error);
  }
};
