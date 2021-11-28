import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, ScrollView, View, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect } from 'react';
import firebaseConfig from './Secrets';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [image, setImage] = useState();
  const [result, setResult] = useState({});

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  // const onTakePhoto = () => launchCamera({ mediaType: 'image' }, onImageSelect);

  const onPickImage = async () => {
    let pickedImage = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!pickedImage.cancelled) {
      setImage(pickedImage.uri);
      const processingResult = await ml().cloudDocumentTextRecognizerProcessImage(media.uri);
      console.log(processingResult);
      setResult(processingResult);
    }

  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.title}>Text Recognition</Text>
      <View>
        {/* <TouchableOpacity style={styles.button} onPress={onTakePhoto}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity> */}
        {<TouchableOpacity style={styles.button} onPress={onPickImage}>
          <Text style={styles.buttonText}>Pick a Photo</Text>
        </TouchableOpacity>}
        { <Image source={{uri: image}} style={styles.image} resizeMode="contain" /> }
      </View>
      <View style={{marginTop: 30}}>
        <Text style={{fontSize: 30}}>{result.text}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 35,
    marginVertical: 40,
  },
  button: {
    backgroundColor: '#47477b',
    color: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 50,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
  },
  image: {
    height: 300,
    width: 300,
    marginTop: 30,
    borderRadius: 10,
  },
});