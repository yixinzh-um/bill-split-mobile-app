import React from 'react';
import { Ionicons } from '@expo/vector-icons'; 
import { headerStyles, listStyles, containerStyles } from './globalStyles';

import {
  View,
  Text,
  Dimensions,
} from 'react-native';

import {
  BarChart
} from 'react-native-chart-kit';

export default function SummaryScreen({navigation}) {
  return (
    <View style={containerStyles.container}>
      <View style={headerStyles.header}>
        <Ionicons
          name="arrow-back-outline" size={30} color="black"
          onPress={() => {
            navigation.goBack();
        }}/>

        <View style={headerStyles.titleContainer}> 
          <Text style={headerStyles.title}>Transaction Summary</Text>
        </View>
      </View>
      <View style={listStyles.userListContainer}>
        <BarChart
          data={{
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [
              {
                data: [20, 45, 28, 80, 99, 43],
              },
            ],
          }}
          width={Dimensions.get('window').width - 30}
          height={220}
          yAxisLabel={''}
          chartConfig={{
            backgroundColor: '#1cc910',
            backgroundGradientFrom: '#eff3ff',
            backgroundGradientTo: '#efefef',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
    </View>
  );
}
