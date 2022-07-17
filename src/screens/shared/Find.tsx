import * as React from 'react';
import { Text, View, SectionList } from 'react-native';
import { List, Searchbar, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { updateQuery } from '../../actions/mediaStore';
import { Screen } from '../../components/Screen';
import { TrackContainer } from '../../containers/TrackContainer';
import { RootReducerType } from '../../reducers';
import { TrackProps } from '../../utils/types';

export interface FindScreenProps { }

export function FindScreen({ navigation }: FindScreenProps) {
  const searchResult = useSelector(
    (state: RootReducerType) => state.query.searchResult,
  );
  const [query, setQuery] = React.useState('');

  const dispatch = useDispatch();

  React.useEffect(() => {
    const timeOutId = setTimeout(
      () => dispatch(updateQuery(query, 'songs')),
      500,
    );
    return () => clearTimeout(timeOutId);
  }, [query]);

  const handleChange = (text: string) => {
    setQuery(text);
  };

  const theme = useTheme();
  const { colors } = theme;

  navigation.setOptions({
    headerStyle: {
      backgroundColor: colors.background,
    },
  })

  return (
    <Screen>
      <View style={[{ backgroundColor: colors.background, margin: 12 }]}>
        <Searchbar
          style={{ borderRadius: 4, borderWidth: 1, borderColor: colors.text, backgroundColor: colors.background }}
          placeholder="Artists, songs or podcasts"
          onChangeText={handleChange}
          value={query}
          icon={'search-outline'}
          onIconPress={() => navigation.goBack()}
          clearIcon="close-outline"
          autoFocus
        />
      </View>
      {searchResult && searchResult.length ? (
        <SectionList
          keyboardShouldPersistTaps="always"
          sections={searchResult}
          // ItemSeparatorComponent={() => <Divider inset />}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }: { item: TrackProps }) => (
            <TrackContainer track={item} goBack={navigation.goBack} />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <List.Subheader>{title}</List.Subheader>
          )}
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text>No songs found</Text>
        </View>
      )}
    </Screen>
  );
}
