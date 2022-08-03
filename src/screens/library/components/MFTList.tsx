import { DataStore } from 'aws-amplify';
import * as React from 'react';
import { FlatList, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import FastImage from 'react-native-fast-image';
import { Button } from 'react-native-paper';
import ThemedButton from '../../../components/ThemedButton';
import { Album } from '../../../models';


function MFTList() {
    const [items, setItems] = React.useState([]);
    React.useEffect(() => {
        const subscription = DataStore.observeQuery(Album).subscribe((snapshot) => {
            //isSynced can be used to show a loading spinner when the list is being loaded. 
            const { items, isSynced } = snapshot;
            console.log(items);
            setItems(items);
        });

        //unsubscribe to data updates when component is destroyed so that we don’t introduce a memory leak.
        return function cleanup() {
            subscription.unsubscribe();
        }
    }, []);

    return (
        <FlatList data={items} renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12 }}>
                <FastImage source={{ uri: item.cover }} style={{ width: 120, height: 120, borderRadius: 4 }} />
                <View>
                    <Text>{item.title}</Text>
                    <Text>{item.author}</Text>
                    <View style={{  justifyContent: 'center', alignItems: 'center', backgroundColor: 'green' }}>
                        <LineChart
                            data={{
                                // labels: ["January", "February", "March", "April", "May", "June"],
                                datasets: [
                                    {
                                        data: [
                                            Math.random() * 10,
                                            Math.random() * 10,
                                            Math.random() * 10,
                                            Math.random() * 10,
                                            Math.random() * 10,
                                            Math.random() * 10
                                        ]
                                    }
                                ]
                            }}
                            width={240} // from react-native
                            height={50}
                            yAxisInterval={1} // optional, defaults to 1
                            chartConfig={{
                                color: (opacity = 1) => 'green',
                            }}
                            withDots={false}
                            withInnerLines={false}
                            withOuterLines={false}
                            withHorizontalLabels={false}
                            withVerticalLabels={false}
                            style={{
                                backgroundColor: 'green'
                            }}
                        />
                    </View>
                </View>
                <View>
                    <Text>CURRENT BID</Text>
                    <Text>{item.price}</Text>
                    <ThemedButton/>
                </View>
            </View>
        )}
            keyExtractor={item => item.id}
        />
    )
}

export default MFTList;