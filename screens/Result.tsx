import React, {useState} from 'react';
import {View, Text, Dimensions, StyleSheet, Button} from 'react-native';
import PDF from 'react-native-pdf';
import RNFS from 'react-native-fs';

export default function Result({route}) {
  const {fileUri, page} = route.params;
  const [downloaded, setDownloaded] = useState(false);

  const handleSave = async () => {
    await RNFS.moveFile(fileUri, RNFS.DownloadDirectoryPath + '/x.pdf');
    setDownloaded(true);
  };

  return (
    <View style={styles.container}>
      {downloaded && (
        <Text style={styles.saved}>File saved to Download folder</Text>
      )}
      <PDF
        source={{
          uri: fileUri,
          cache: true,
        }}
        page={page}
        style={styles.pdf}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Save To Download Folder"
          color="#841584"
          onPress={handleSave}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  saved: {
    backgroundColor: 'lightgreen',
    color: 'black',
    width: '100%',
    textAlign: 'center',
  },
});
