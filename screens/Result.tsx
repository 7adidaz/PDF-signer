import React from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import PDF from 'react-native-pdf';

export default function Result({route, navigation}) {
  const {fileUri, page} = route.params;

  return (
    <View style={styles.container}>
      <PDF
        source={{
          uri: fileUri,
          cache: true,
        }}
        page={page}
        style={styles.pdf}
      />
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
