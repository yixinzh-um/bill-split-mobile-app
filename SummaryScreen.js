import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons'; 
import moment from "moment";
import update from 'immutability-helper';
import { headerStyles, listStyles, containerStyles } from './globalStyles';
import { getGroupList } from './GroupModel';
import { getItemModels, resetItemModels } from './ItemModel';
import {
  View, Text, Dimensions, StyleSheet
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const MyBarChart = ({title, labels, data}) => {
  return (
    <>
      <Text style={containerStyles.paragraph}>{title}</Text>
      <BarChart
        data={{
          labels: labels.map(i => `${i}`),
          datasets: [
            {
              data: data,
            },
          ],
        }}
        width={Dimensions.get('window').width - 50}
        height={220}
        yAxisLabel={'$'}
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
    </>
  );
};

export default function SummaryScreen({navigation, route}) {
  const email = route.params.email;
  const groups = getGroupList(email).getGroupList();
  const itemModels = getItemModels(groups);
  const weeks = [3, 2, 1, 0].map(i => moment().subtract(i, "weeks").
  startOf('isoweek').format('MM/DD/YYYY'));
  const [payByUser, setPayByUser] = useState(new Map(weeks.map(i => [i, 0])));   
  const [payByOthers, setPayByOthers] = useState(new Map(weeks.map(i => [i, 0]))); 
  // console.log(moment("12/09/2021", "MM/DD/YYYY").month() + 1);

  useEffect(() => {    
    const itemListenerIds = itemModels.map(itemModel => itemModel.addListener(
      () => {
        for (const item of itemModel.itemList) {
          const week = moment(item.date, "MM/DD/YYYY").startOf('isoweek').format('MM/DD/YYYY');
          if(weeks.includes(week)){
            if (item.payer === email) {
              setPayByUser(oldMap => update(oldMap, {[week]: {$set: oldMap.get(week) + item.value}}))
            } else {
              setPayByOthers(oldMap => update(oldMap, {[week]: {$set: oldMap.get(week) + item.value}}));
            }
          }
        }
      }
    ));

    return () => {
      for (let i = 0; i < itemModels.length; i++) {
          itemModels[i].removeListener(itemListenerIds[i]);
      }
    };}, []);

  return (
    <View style={containerStyles.container}>
      <View style={headerStyles.header}>
        <Ionicons
          style={headerStyles.leftIcon}
          name="arrow-back-outline" size={30} color="black"
          onPress={() => {
            resetItemModels();
            navigation.goBack();
          }}/>

        <View style={headerStyles.titleContainer}> 
          <Text style={headerStyles.title}>Transaction Summary</Text>
        </View>
      </View>
      <View style={styles.container}>
        <Text style={containerStyles.paragraph}>Transactions during the past 4 weeks</Text>
        <MyBarChart title="Payed by Me" data={Array.from(payByUser.values())} labels={weeks}/>
        <MyBarChart title="Payed by Others" data={Array.from(payByOthers.values())} labels={weeks}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
});
