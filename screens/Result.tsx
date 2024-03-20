import React from 'react';
import {View, Dimensions, StyleSheet, Button} from 'react-native';
import PDF from 'react-native-pdf';

export default function Result({route, navigation}) {
  const {fileUri} = route.params;

  return (
    <View style={styles.container}>
      <PDF
        source={{
          uri: fileUri,
          cache: true,
        }}
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
