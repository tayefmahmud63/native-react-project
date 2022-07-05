import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  Title,
  Button,
  Divider,
  Subheading,
  IconButton,
  ActivityIndicator,
} from 'react-native-paper';
import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import { useDispatch } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import values from 'lodash/values';
import FastImage from 'react-native-fast-image';
import { addToQueue } from '../../actions/playerState';
import { TrackContainer } from '../../containers/TrackContainer';
import { DefaultImage } from '../../components/DefaultImage';
import { Screen } from '../../components/Screen';
import { EmptyPlaylist } from '../../components/EmptyPlaylist';

import { TrackProps } from '../../utils/types';

export const SongList = ({ route, navigation }) => {
  const { playlist } = route.params;
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [songs, setSongs] = useState([]);
  // Initial empty array of users

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: playlist.title,
      headerRight: () => (
        <IconButton
          icon="play-circle-outline"
          onPress={() => addSongToQueue()}
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    // const subscriber = firestore()
    //   .collection('playlists')
    //   .doc('l1yi5FvJI3Cm2Y0WOJ7W')
    //   .collection('songs')
    //   .onSnapshot(querySnapshot => {
    //     // see next step
    //     const songs = [];

    //     querySnapshot.forEach(documentSnapshot => {
    //       songs.push({
    //         ...documentSnapshot.data(),
    //         key: documentSnapshot.id,
    //       });
    //     });

    //     setSongs(songs);
    //     setLoading(false);
    //   });

    // // Unsubscribe from events when no longer in use
    // return () => subscriber();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  const addSongToQueue = () => {
    dispatch(addToQueue(values(songs)));
  };

  const onRefresh = () => {
    setLoading(false);
  };

  return (
    <Screen>
      {isEmpty(songs) ? (
        <EmptyPlaylist />
      ) : (
        <FlatList
          ListHeaderComponent={() => (
            <View style={{ margin: 12 }}>
              <View style={styles.coverContainer}>
                {playlist.cover ? (
                  <FastImage
                    source={{ uri: playlist.cover }}
                    style={styles.artCover}
                  />
                ) : (
                  <DefaultImage style={styles.artCover} />
                )}
              </View>
              <View style={styles.titleContainer}>
                <Title>{playlist.title}</Title>
                <Subheading>{`by ${playlist.description}`}</Subheading>
              </View>
              <View style={styles.buttonContainer}>
                <Button mode="contained" onPress={addSongToQueue}>
                  Play All
                </Button>
              </View>
            </View>
          )}
          data={songs}
          renderItem={({ item }: { item: TrackProps }) => (
            <TrackContainer track={item} />
          )}
          ItemSeparatorComponent={() => <Divider inset />}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={() => <View style={{ height: 100 }} />}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
          }
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coverContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  artCover: { width: 200, height: 200, elevation: 4, borderRadius: 12 },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
});
