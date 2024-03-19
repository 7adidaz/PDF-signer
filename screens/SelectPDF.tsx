import React from 'react';
import {StyleSheet, Text, SafeAreaView, Button, StatusBar} from 'react-native';
import DocumentPicker, {
  DocumentPickerResponse,
  DirectoryPickerResponse,
} from 'react-native-document-picker';

export default function SelectPdf({navigation, route}) {
  const [result, setResult] = React.useState<DocumentPickerResponse | null>();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <Button
        title="Select 📑"
        onPress={async () => {
          try {
            const res = await DocumentPicker.pickSingle({
              type: [DocumentPicker.types.pdf],
            });
            setResult(res);
            console.log(res);
            navigation.navigate('Signature', {
              fileName: res.name,
              fileUri: res.uri,
            });
          } catch (err) {
            console.log(err);
          }
        }}
      />
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
