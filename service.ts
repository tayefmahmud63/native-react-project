import TrackPlayer from 'react-native-track-player';

module.exports = async function () {
    // This service needs to be registered for the module to work
    TrackPlayer.addEventListener('remote-play', () => TrackPlayer.play());

    TrackPlayer.addEventListener('remote-pause', () => TrackPlayer.pause());

    TrackPlayer.addEventListener('remote-stop', () => TrackPlayer.destroy());
}