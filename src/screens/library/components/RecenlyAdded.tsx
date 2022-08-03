import * as React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/core';


import { DataStore } from '@aws-amplify/datastore';
import { Album } from '../../../models';
import FastImage from 'react-native-fast-image';
import { Text } from 'react-native-paper';
import { Headline } from '../../../components/Headline';

const RecentlyAdded = () => {
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
                        marginVertical: 12,
                    }}
                >
                    <Headline>Recently Added</Headline>
                </View>
                <FlatList data={media} numColumns={2} renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.item]}
                        onPress={() => navigateToPlaylist(item)}
                    >
                        <FastImage
                            source={{
                                uri: item.cover,
                            }}
                            style={[styles.photo]}
                        />

                        <Text numberOfLines={2} style={styles.title}>
                            {item?.title}
                        </Text>
                        <Text numberOfLines={2} style={styles.title}>
                            {item?.author}
                        </Text>
                    </TouchableOpacity>
                )} />
            </View>
        );
    }

    return null;
};

export default RecentlyAdded;

const styles = StyleSheet.create({
    item: {
    //   alignItems: 'center',
      marginBottom: 8,
      marginHorizontal: 8,
      width: 225,
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
      height: 250,
      width: '100%',
      backgroundColor: 'gray'
    },
  });
  