import React, { useRef } from 'react';
import { Platform, ScrollView, View } from 'react-native';

import { useScrollToTop } from '@react-navigation/native';
import { NetNotify } from '../../components/NetNotify';
import { RecentContainer } from '../../containers/RecentContainer';
import { MostPlayedContainer } from '../../containers/MostPlayedContainer';
import OnlineContainer from '../../containers/OnlineContainer';
import { Screen } from '../../components/Screen';
import { ShortCutContainer } from '../../containers/ShortcutContainer';
import OnlineSongsContainer from '../../containers/OnlineSongsContainer';
import { PlaylistList } from './components/PlaylistList';

const Divider = () => <View style={{ marginVertical: 8 }} />;

export const MainScreen = () => {
  const ref = useRef();
  useScrollToTop(ref);

  return (
    <Screen>
      <ScrollView ref={ref}>
        <NetNotify />
        {/* <ShortCutContainer /> */}
        {/* <OnlineContainer /> */}
        {/* <Divider /> */}
        <RecentContainer />
        <Divider />
        <MostPlayedContainer />
        <Divider />
        <PlaylistList />
        {/* <Divider /> */}
        {/* <OnlineSongsContainer /> */}
        <Divider />
        <Divider />
      </ScrollView>
    </Screen>
  );
};
