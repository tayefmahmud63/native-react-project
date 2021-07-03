import React, { useState } from 'react';
import { View } from 'react-native';
import TrackPlayer, { useTrackPlayerProgress } from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import { useTheme } from 'react-native-paper';

export const Progress = () => {
  const { colors } = useTheme();
  const [isSeeking, setIsSeeking] = useState(false);
  const [seek, setSeek] = useState(0);
  const progress = useTrackPlayerProgress();
  const { duration, position } = progress;
  return (
    <View style={{ flex: 1, width: '100%' }}>
      <Slider
        value={isSeeking ? seek : position}
        maximumValue={duration}
        onValueChange={value => {
          TrackPlayer.pause();
          setIsSeeking(true);
          setSeek(value);
        }}
        minimumTrackTintColor={colors.primary}
        thumbTintColor={colors.primary}
        onSlidingComplete={value => {
          TrackPlayer.seekTo(value);
          TrackPlayer.play();
        }}
      // style={{ height: 6 }}
      // buffered={this.getBufferedProgress()}
      />
    </View>
  );
};
