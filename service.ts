import TrackPlayer from 'react-native-track-player';
import {
    pauseTrack,
    playTrack,
    skipToNext,
    skipToPrevious,
} from './src/actions/playerState';
import configureStore from './src/store';
const { store } = configureStore();

module.exports = async function () {
    // This service needs to be registered for the module to work
    TrackPlayer.addEventListener('remote-play', () => {
        store.dispatch(playTrack());
    });

    TrackPlayer.addEventListener('remote-pause', () => {
        store.dispatch(pauseTrack());
    });

    TrackPlayer.addEventListener('remote-stop', () => TrackPlayer.destroy());

    TrackPlayer.addEventListener('remote-next', () => {
        store.dispatch(skipToNext());
        console.log('skip to previous');
    });

    TrackPlayer.addEventListener('remote-previous', () => {
        store.dispatch(skipToPrevious());
        console.log('skip to previous');
    });
};
