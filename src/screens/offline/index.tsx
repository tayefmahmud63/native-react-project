import React from 'react';
import { IconButton, useTheme } from 'react-native-paper';
import { View } from 'react-native';


const ArtistPortal = () => {
  const theme = useTheme();
  const { colors } = theme;
  return (
    // <Tab.Navigator
    //   tabBarOptions={{
    //     activeTintColor: colors.primary,
    //     inactiveTintColor: colors.text,
    //     style: {
    //       backgroundColor: colors.surface,
    //     },
    //     labelStyle: {
    //       fontFamily: 'Nunito-ExtraBold',
    //       fontSize: 16,
    //       textTransform: 'none',
    //     },
    //     indicatorStyle: {
    //       backgroundColor: colors.primary,
    //     },
    //   }}
    // >
    //   <Tab.Screen name="Song" component={SongScreen} />
    //   <Tab.Screen name="Artist" component={ArtistScreen} />
    //   <Tab.Screen name="Album" component={AlbumScreen} />
    // </Tab.Navigator>
    <View>
      
    </View>
  );
};


export default ArtistPortal;