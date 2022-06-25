import React, { useState } from 'react';
import { View } from 'react-native';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import { Caption, useTheme } from 'react-native-paper';
import moment from 'moment';

export const Progress = () => {
  const { colors } = useTheme();
  const [isSeeking, setIsSeeking] = useState(false);
  const [seek, setSeek] = useState(0);
  const progress = useProgress();
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
      <View
        style={{
          width: '100%',
          height: 20,
          justifyContent: 'space-between',
          flexDirection: 'row',
          paddingHorizontal: 8,
        }}>
        <Caption>{moment.utc(position * 1000).format('mm:ss')}</Caption>
        <Caption>{moment.utc(duration * 1000).format('mm:ss')}</Caption>
      </View>
    </View>
  );
};
