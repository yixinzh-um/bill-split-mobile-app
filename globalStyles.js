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
});

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
});

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    padding: 10,
  },
  labelContainer: {
    flex: 0.2,
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
    width: '80%',
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
    backgroundColor: '#ecf0f1',
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
    alignItems:'center',
    borderWidth: 2,
    borderRadius: 20,
    overflow: 'hidden',
    borderColor: 'lightgray',
    flex: 1,
    padding: '3%',
    marginBottom: '5%',
    width: '80%',
    alignSelf: 'center',
  },
  userListContainer: {
    flex: 1, 
    justifyContent: 'center',
    width: '100%', 
  },
});


export {headerStyles, detailStyles, buttonStyles, rowStyles, containerStyles, listStyles};