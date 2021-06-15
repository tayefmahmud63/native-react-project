import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ProgressBar, Text } from 'react-native-paper';
import TrackPlayer from 'react-native-track-player';
export class Progress extends TrackPlayer.ProgressComponent {

  render() {
    return (
      // Note: formatTime and ProgressBar are just examples:
      <View style={styles.view}>
        <Text>{this.state.position}</Text>

        <ProgressBar
          progress={this.getProgress()}
          buffered={this.getBufferedProgress()}
        />
      </View>
    );
  }

}


const styles = StyleSheet.create({
  view: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 40,
    width: '100%',
  },
  bar: {
    height: 30,
    width: '100%',
  },
});
