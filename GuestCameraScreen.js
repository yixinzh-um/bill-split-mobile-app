import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { getGuestModel} from "./GuestModel";

export default function GuestCameraScreen({navigation, route}) {
  const [hasPermission, setHasPermission] = useState(null);
  const guestModel = getGuestModel();

  useEffect(() => {
    async function getPermissions() {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    }
    getPermissions();
  }, []);

  if (hasPermission === null) {
    return <View/>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  let theCamera = undefined;

  return (
    <View style={styles.cameraContainer}>
      <Camera 
        style={styles.camera}
        ratio='4:3'
        ref={ref => theCamera = ref}
      />
      <TouchableOpacity 
        style={styles.cameraControls}
        onPress={async () => {
          let image = await theCamera.takePictureAsync({quality: 0.2});
          guestModel.updateImage(image);
          navigation.goBack();
        }}>
        <Text style={styles.snapText}>Snap</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 0.85,
  },
  cameraControls: {
    flex: 0.15, 
    justifyContent: 'flex-start', 
    alignItems: 'center',
    padding: '5%',
    width: '100%',
    backgroundColor: '#222'
  },
  snapText: {
    fontSize: 36,
    color: 'white'
  },
});

