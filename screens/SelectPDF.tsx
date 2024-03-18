import React from 'react';
import {StyleSheet, Text, SafeAreaView, Button, StatusBar} from 'react-native';
import {useState, useCallback} from 'react';
import {DocumentPicker} from 'react-native-document-picker';

export default function SelectPdf({navigation, route}) {
  const [file, setFile] = useState();

  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      setFile(response);
      console.log(' ww', response.name, response.uri);
      navigation.navigate('Signature', {
        fileName: response.name,
        fileUri: response.uri,
      });
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.warn(err);
      }
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <Text style={styles.uri} numberOfLines={1} ellipsizeMode={'middle'}>
        {file?.name}
      </Text>
      <Button title="Select 📑" onPress={handleDocumentSelection} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
