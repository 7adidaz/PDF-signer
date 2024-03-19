import React from 'react';
import { Text, Dimensions, StyleSheet, SafeAreaView } from 'react-native';
import PDF from 'react-native-pdf';

export default function EditPdf({ route }) {
  console.log('editPdf: ', route.params);
  const { fileName, fileUri } = route.params;
  return (
    <SafeAreaView>
      {/* <Text>{fileName}</Text> */}
      <PDF
        source={{
          // uri: fileUri,
          uri: fileUri,
          cache: true,
        }}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
        }}
        onError={error => {
          console.log(error);
        }}
        onPressLink={uri => {
          console.log(`Link pressed: ${uri}`);
        }}
        style={styles.pdf}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
