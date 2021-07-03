import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { Headline } from '../../../components/Headline';
import { useNavigation } from '@react-navigation/core';
import { TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { DefaultImage } from '../../../components/DefaultImage';
export interface PlaylistListProps { }

export function PlaylistList(props: PlaylistListProps) {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [playlists, setPlaylists] = useState([]); // Initial empty array of users
  const navigation = useNavigation();
  useEffect(() => {
    const subscriber = firestore()
      .collection('playlists')
      .onSnapshot(querySnapshot => {
        // see next step
        const playlists = [];

        querySnapshot.forEach(documentSnapshot => {
          playlists.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setPlaylists(playlists);
        setLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  console.log(playlists);

  function navigateToPlaylist(playlist) {
    console.log('navigate');
    navigation.navigate('SongList', {
      playlist: playlist,
    });
  }

  return (
    <View>
      <View
        style={{
          marginLeft: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}>
        <Headline>Top Playlists</Headline>
      </View>
      <FlatList
        horizontal
        data={playlists}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item]}
            onPress={() => navigateToPlaylist(item)}>
            {item?.cover ? (
              <FastImage
                source={{
                  uri: item.cover,
                }}
                style={[styles.photo]}
              />
            ) : (
              <DefaultImage style={styles.photo} />
            )}

            <Text numberOfLines={2} style={styles.title}>
              {item?.title}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    marginBottom: 4,
    marginLeft: 12,
    width: 120,
  },
  title: {
    fontSize: 12,
    marginTop: 8,
    padding: 0,
    fontFamily: 'Nunito-Bold',
    includeFontPadding: false,
  },
  photo: {
    borderRadius: 12,
    elevation: 4,
    height: 120,
    width: 120,
    backgroundColor: 'gray',
  },
});
