import * as React from 'react';
import { View } from "react-native";
import { ProgressBar } from "react-native-paper";
import TrackPlayer from 'react-native-track-player';
export class Progress extends TrackPlayer.ProgressComponent {

  render() {
    return (
      // Note: formatTime and ProgressBar are just examples:
      <View style={{ flex: 1, width: "100%" }}>
        <ProgressBar
          progress={this.getProgress()}
        // style={{ height: 6 }}
        // buffered={this.getBufferedProgress()}
        />
      </View>
    );
  }

}