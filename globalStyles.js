import { AutoFocus } from 'expo-camera/build/Camera.types';
import { StyleSheet } from 'react-native';

const headerStyles = StyleSheet.create({
  header: {
    flex: 0.2,
    flexDirection: 'row', 
    alignItems: 'center',
    borderBottomColor: '#E1E1E1',
    borderBottomWidth: 1,
    paddingTop:20,
  },
  titleContainer: {
    position: 'absolute',
    left: 0, 
    right: 0, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    paddingRight: 10,
    textAlign: 'center',
  },
  leftIcon: {
    zIndex: 1,
    position: 'absolute',
    left: 0,
  },
  rightIcon: {
    position: 'absolute',
    right: 0,
    // justifyContent: 'flex-end',
  }
})

const formStyles = StyleSheet.create({

})

const detailStyles = StyleSheet.create({
  row: {
    marginVertical: '5%',
    height: '20%',
  },
  labelContainer: {
    padding: "5%",
  },
  labelText: {
    fontSize: 25,
  },
  editorContainer: {
    flexDirection: 'row',
  },
  valueContainer: {
    paddingHorizontal: '10%',
    alignContent: 'center',
    justifyContent: 'flex-end',
  },
  valueText: {
    fontSize: 20,
  },
  inputContainer: {
    flex: 0.6,
    alignItems: 'flex-start',
    paddingHorizontal: '10%',
    height: '20%',
  },
  inputBox: {
    width: '60%',
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 6,
    fontSize: 20,
    padding: '2%',
    height: 30,
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