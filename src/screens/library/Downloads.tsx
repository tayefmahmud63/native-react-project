import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Text, View } from 'react-native';
import { Button, Divider, Subheading, Title } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { deleteDownload, listDownloads } from '../../actions/downloads';
import { addToQueue } from '../../actions/playerState';
import { DefaultImage } from '../../components/DefaultImage';
// import { TrackItem } from './components/TrackItem';
import { TrackProps } from '../../utils/types';
// import RNFS from 'react-native-fs';

export interface DownloadScreenProps { }

async function parseSongs(response) {
  const songs = [];
  for (const index in response) {
    const each = response[index];
    const song = {};
    console.log('data', each.isFile());
    song.id = each.mtime;
    song.title = decodeURI(each.name);
    song.path = each.path;
    song.album = 'Downloads';
    songs.push(song);
  }
  return songs;
}

export function DownloadScreen({ }: DownloadScreenProps) {
  const [refreshing, setRefreshing] = useState(true);
  const [songs, setSongs] = useState([]);

  const dispatch = useDispatch();

  const addSongToQueue = () => {
    dispatch(addToQueue(songs));
  };

  useEffect(() => {
    listDownloads()
      .then(response => parseSongs(response))
      .then(tracks => {
        setSongs(tracks);
        setRefreshing(false);
      })
      .catch(error => {
        console.log(error);
        setRefreshing(false);
      });
  }, []);

  function onRefresh() {
    setRefreshing(true);
    listDownloads()
      .then(response => parseSongs(response))
      .then(tracks => {
        console.log('tracks', tracks);
        setSongs(tracks);
        setRefreshing(false);
      })
      .catch(error => {
        console.log(error);
        setRefreshing(false);
      });
  }



  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ListHeaderComponent={() => (
          <View style={{ margin: 12 }}>
            <View style={styles.coverContainer}>
              <DefaultImage style={styles.artCover} />
            </View>
            <View style={styles.titleContainer}>
              <Title>{'Downloads'}</Title>
              <Subheading>{'by You'}</Subheading>
            </View>
            <View style={styles.buttonContainer}>
              <Button mode="contained" onPress={addSongToQueue}>
                Play All
              </Button>
            </View>
          </View>
        )}
        data={songs}
        // renderItem={({ item }: { item: TrackProps }) => (
        //   <TrackItem track={item} onRightIconPress={deleteMedia} />
        // )}
        ItemSeparatorComponent={() => <Divider inset />}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={() => <View style={{ height: 100 }} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

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
