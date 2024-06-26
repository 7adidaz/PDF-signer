import React from 'react';
import {StyleSheet, SafeAreaView, Button, StatusBar} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNPermissions from 'react-native-permissions';

export default function SelectPdf({navigation}) {
  const handleSelection = async () => {
    try {
      await RNPermissions.request(
        RNPermissions.PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION,
      );

      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
        copyTo: 'cachesDirectory',
      });

      if (res.type !== 'application/pdf') {
        return;
      }

      navigation.navigate('Signature', {
        fileUri: res.fileCopyUri,
      });
    } catch (err) {}
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <Button title="Select 📑" onPress={handleSelection} />
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
