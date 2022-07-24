import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { Searchbar, Text, useTheme } from 'react-native-paper';
import { Screen } from '../../components/Screen';

export default function Library() {
    const { colors } = useTheme();
    const [active, setActive] = React.useState(0);
    let pagerViewRef = React.useRef(null);

    function onChange(index) {
        setActive(index);
        pagerViewRef?.setPage(index)
    }
    return (
        <Screen>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 12 }} >
                <TouchableOpacity style={[styles.tabButton, active === 0 ? { borderColor: colors.primary } : { borderColor: colors.text }]} onPress={() => onChange(0)}>
                    <Text style={[active === 0 ? { color: colors.primary } : { color: colors.text }]}>Listen</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tabButton, active === 1 ? { borderColor: colors.primary } : { borderColor: colors.text }]} onPress={() => onChange(1)}>
                    <Text style={[active === 1 ? { color: colors.primary } : { color: colors.text }]}>Invest</Text>
                </TouchableOpacity>
            </View>
            <View style={{ marginVertical: 16, borderWidth: 0.4, borderColor: colors.text }} />
            <PagerView
                ref={(ref) => { pagerViewRef = ref }}
                style={styles.pagerView}
                initialPage={0}
            >
                <View key="1">
                    <Searchbar
                        style={{ borderRadius: 12, borderWidth: 1, borderColor: colors.text, backgroundColor: colors.background }}
                        icon={'search-outline'}
                    />
                </View>
                <View key="2">
                    <Text>Second page</Text>
                </View>
            </PagerView>
        </Screen>
    )
}

const styles = StyleSheet.create({
    pagerView: {
        flex: 1,
    },
    tabButton: { borderWidth: 1, borderRadius: 20, width: 200, height: 35, justifyContent: 'center', alignItems: 'center' }
});