import * as React from 'react';
import {
  Title,
  Button,
  Divider,
  Subheading,
  IconButton,
  useTheme,
  Text,
  Caption,
  List,
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
import { DataStore } from 'aws-amplify';
import { Song } from '../../models';

export const SongsList = ({ route, navigation }) => {

  const { playlist } = route.params;
  const [songs, setSongs] = React.useState();

  const { colors } = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);

  const dispatch = useDispatch();

  const addSongToQueue = () => {
    dispatch(addToQueue(values(songs)));
  };

  const onRefresh = () => {
    setRefreshing(false);
  };

  async function getSongs() {
    const songs = (await DataStore.query(Song)).filter(song => song.albumID === playlist.id);
    setSongs(songs);
  }
  React.useEffect(() => {
    getSongs();
  }, [])

  return (
    <Screen>
      {isEmpty(songs) ? (
        <EmptyPlaylist />
      ) : (
        <FlatList
          ListHeaderComponent={() => (
            <View>
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
                  <Title style={{ textTransform: 'uppercase', fontSize: 30 }}>{playlist.title}</Title>
                  <Title style={{ color: colors.primary }}>{playlist.author}</Title>
                  <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                    <Text>{`Starts at $${playlist.price}`}</Text>
                    <Text>{`${playlist.availableCopies} For Sale`}</Text>
                  </View>
                </View>
                <View style={styles.buttonContainer}>
                  <Button mode="contained" uppercase={false} onPress={addSongToQueue} style={{ paddingVertical: 6, borderRadius: 40, width: '100%', height: 52 }}>
                    Purchase
                  </Button>
                </View>
                <Caption>{`Release on ${playlist.releasedAt}`}</Caption>
                <Text>{playlist.description}</Text>
              </View>
              <List.Item title={"Preview the tracks"} titleStyle={{ color: colors.primary }} right={props => <List.Icon {...props} icon='play-circle-outline' />} />
              <Divider />
            </View>
          )}
          data={songs}
          renderItem={({ item }: { item: TrackProps }) => (
            <TrackContainer track={item} />
          )}
          ItemSeparatorComponent={() => <Divider />}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={() => <View style={{ height: 100 }} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
    marginBottom: 24,
  },
  artCover: { width: '100%', height: 400, elevation: 4, borderRadius: 12 },
  titleContainer: {
    margin: 16,
  },
});
