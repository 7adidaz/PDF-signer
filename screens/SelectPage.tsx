import React from 'react';
import {View, Dimensions, StyleSheet, Button} from 'react-native';
import PDF from 'react-native-pdf';

export default function EditPdf({route, navigation}) {
  const {fileUri, paths} = route.params;
  const [currentPage, setCurrentPage] = React.useState(1);
  // const stat = await RNFetchBlob.fs.stat(fileUri);
  return (
    <View style={styles.container}>
      <PDF
        source={{
          uri: fileUri,
          cache: true,
        }}
        onPageChanged={page => {
          setCurrentPage(page);
        }}
        style={styles.pdf}
      />
      <View style={styles.buttonContainer}>
        <Button
          title={`Sign on page ${currentPage}`}
          color="#841584"
          onPress={() => {
            console.log('Selected page:', currentPage);
            navigation.navigate('Place Signature', {
              fileUri: fileUri,
              page: currentPage,
              paths: paths,
            });
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  buttonContainer: {
    width: '100%',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
