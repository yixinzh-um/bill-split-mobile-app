import { StyleSheet } from 'react-native';

const headerStyles = StyleSheet.create({
  header: {
    height: '15%',
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
  subtitle: {
    fontSize: 20,
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
  }
});

const detailStyles = StyleSheet.create({
  row: {
    marginVertical: '5%',
    height: '30%',
  },
  labelContainer: {
    justifyContent: 'flex-end',
    margin: "5%",
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
  mainImage: {
    height: 400,
    width: 300,
    resizeMode: 'contain'
  },
});

const buttonStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 40,
    borderRadius:10,
    padding: 5,
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    color: '#303633'
  },
});

const rowStyles = StyleSheet.create({
  rowContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    padding: 20,
  },
  rowContent: {
    flexDirection: 'row',
    margin: 10
  },
  labelContainer: {
    width: '40%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  labelText: {
    fontSize: 18
  },
  inputContainer: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%'
  },
  buttonContainer: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  inputBox: {
    width: '100%',
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 6,
    fontSize: 18,
    padding: '2%'
  },
  center: {
    flexDirection: 'row',
    justifyContent: 'center'
  }
});

const containerStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#ffffff',
    padding: '3%',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

const listStyles = StyleSheet.create({
  groupItem: {
    flexDirection: 'row',
    alignItems:'center',
    borderRadius: 20,
    overflow: 'hidden',
    flex: 1,
    paddingVertical: '3%',
    marginTop: '5%',
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#DFE8EA',
    padding: 10,
  },

  balanceItem: {
    flexDirection: 'row',
    alignItems:'center',
    overflow: 'hidden',
    flex: 1,
    paddingVertical: '3%',
    marginTop: '5%',
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#DFE8EA',
    padding: 10,
    flexDirection: 'column',
    backgroundColor: '#E4E7E6',
  },
  userListContainer: {
    flex: 0.9,
    justifyContent: 'center',
    width: '100%',
  },
  shadow: {
    shadowColor: 'grey',
    shadowOffset: {width: 10,height: 10},
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  inputBox: {
    width: '60%',
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 6,
    fontSize: 20,
    height: 30,
    alignItems: 'center',
  },
  inputContainer: {
    flex: 0.6,
    alignItems: 'center',
    marginTop: '10%',
  },
  addContainer: {
    flex: 0.4
  },
  button: {
    justifyContent: 'flex-end',
  }
});

const ButtonStyles = StyleSheet.create({
  buttonContainer: {
    marginTop: '2%',
    paddingTop: '10%',
    width: '80%',
    alignItems: 'center',
    borderTopColor: '#E1E1E1',
    borderTopWidth: 1,
  },

  button: {
    alignItems: 'center',
    backgroundColor: '#E1E1E1',
    borderRadius: 10,
    padding: 10,
  },

  text: {
    fontSize: 20
  },
});


export {headerStyles, detailStyles, buttonStyles, rowStyles, containerStyles, listStyles, ButtonStyles};