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
    fontSize: 25,
    paddingRight: 10,
    textAlign: 'center',
  },
})
export default headerStyles;