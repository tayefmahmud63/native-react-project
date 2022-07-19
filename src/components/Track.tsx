import React from 'react';
import { IconButton, List, Text, useTheme } from 'react-native-paper';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface TrackProps {
  title: string;
  album?: string;
  artist?: string;
  cover?: string;
  type?: string;
}

interface Props {
  track: TrackProps;
  active: boolean;
  play(): void;
  download(): void;
}

export const Track = React.memo(({ track, active, play, download }: Props) => {
  const theme = useTheme();
  const { colors } = theme;
  return (
      <List.Item title={track.title} onPress={play}/>
  );
});


