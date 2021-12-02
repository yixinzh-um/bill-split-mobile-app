import { StyleSheet } from 'react-native';

const headerStyles = StyleSheet.create({
  header: {
    flex: 0.2,
    flexDirection: 'row', 
    justifyContent:'space-evenly',
    alignItems: 'center',
    borderBottomColor: '#E1E1E1',
    borderBottomWidth: 1,
    paddingTop:20,
  },
  title: {
    fontSize: 30,
    paddingRight: 10,
    textAlign: 'center',
  },
})

const formStyles = StyleSheet.create({

})

const detailStyles = StyleSheet.create({
  row: {
    marginVertical:'5%',
  },
  labelContainer: {
    padding: "5%",
  },
  labelText: {
    fontSize: 25,
  },
  valueContainer: {
    paddingHorizontal: '5%',
    paddingHorizontal: '10%',
  },
  valueText: {
    fontSize: 20,
  },

})

const buttonStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#84C6FF',
    width: 100,
    height: 40,
    borderRadius:10,
    padding: 5,
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    color: '#006DCD'
  },
})
export {headerStyles, formStyles, detailStyles, buttonStyles};