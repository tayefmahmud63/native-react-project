import * as React from 'react';
import { View } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/core';
import { TrackScrollView } from '../components/TrackScrollView';
import { Headline } from '../components/Headline';

import { DataStore } from '@aws-amplify/datastore';
import { Album } from '../models';

const OnlineSongsContainer = () => {
  const [media, setMedia] = React.useState([]);  
  const netInfo = useNetInfo();
  const navigation = useNavigation();

  const navigateToPlaylist = async (playlist: any) => {
    navigation.navigate('Playlist', {
      playlist: playlist,
    });
  };

  React.useEffect(() => {

    //query the initial todolist and subscribe to data updates
    const subscription = DataStore.observeQuery(Album).subscribe((snapshot) => {
      //isSynced can be used to show a loading spinner when the list is being loaded. 
      const { items, isSynced } = snapshot;
      setMedia(items)
    });

    //unsubscribe to data updates when component is destroyed so that we don’t introduce a memory leak.
    return function cleanup() {
      subscription.unsubscribe();
    }

  }, []);

  // const { media } = data;
  if (netInfo.isConnected) {
    return (
      <View>
        <View
          style={{
            marginLeft: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <Headline>Online Songs</Headline>
        </View>
        <TrackScrollView data={media} play={navigateToPlaylist} />
      </View>
    );
  }

  return null;
};

export default OnlineSongsContainer;
