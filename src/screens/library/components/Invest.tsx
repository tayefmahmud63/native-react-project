import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Text } from 'react-native-paper';
import { Headline } from '../../../components/Headline';
import { width } from '../../../utils/constants';
import MFTList from './MFTList';


const data = [
    { quarter: 1, earnings: 13 },
    { quarter: 2, earnings: 16 },
    { quarter: 3, earnings: 14 },
    { quarter: 4, earnings: 19 }
];

function Invest() {
    return (
        <View style={{ margin: 12 }}>
            <ScrollView>
                <Headline>Investing</Headline>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Headline>$916.22</Headline>
                    <Text>Total Portfolio</Text>
                </View>
                <Text><Text style={{ color: '#00FF00', fontWeight: 'bold', fontSize: 14 }}>$89.40 (10.98%)</Text> Past Week</Text>
                <View style={{ justifyContent: 'center', alignItems: 'center', height: 260, margin: 12 }}>
                    <LineChart
                        data={{
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
                        width={width} // from react-native
                        height={240}
                        yAxisInterval={1} // optional, defaults to 1
                        chartConfig={{
                            color: (opacity = 1) => 'green',
                        }}
                        withDots={false}
                        withInnerLines={false}
                        // withOuterLines={false}
                        withHorizontalLabels={false}
                        withVerticalLabels={false}
                        withVerticalLines={false}
                        withShadow={false}
                        withHorizontalLines={true}
                        style={{
                            backgroundColor: 'green'
                        }}
                    />
                </View>
                <MFTList />
            </ScrollView>
        </View>
    )
}

export default Invest