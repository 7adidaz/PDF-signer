import Pdf from 'react-native-pdf';
import React from 'react';
import {Text, Pressable, StyleSheet, View, Button} from 'react-native';
import {PDFDocument, rgb} from 'pdf-lib';
import RNFS from 'react-native-fs';
import {Base64} from 'js-base64';

async function placeSignature(
  fileUri: string,
  pageNum: number,
  paths: string[],
  {
    x,
    y,
  }: {
    x: number;
    y: number;
  },
) {
  const file = await RNFS.readFile(fileUri, 'base64');
  const pdfDoc = await PDFDocument.load(file);
  const page = pdfDoc.getPage(pageNum - 1);

  for (const path of paths) {
    page.drawSvgPath(path, {
      x: x,
      y: page.getHeight() - y,
      borderColor: rgb(0, 0, 0),
      borderWidth: 10,
      scale: 0.5,
    });
  }

  const pdfBytes = await pdfDoc.save();
  const str = Base64.fromUint8Array(pdfBytes);
  await RNFS.writeFile(fileUri, str, 'base64');
}

export default function PlaceSignature({route, navigation}) {
  const {fileUri, page, paths} = route.params;
  const [xy, setXY] = React.useState({x: 0, y: 0});

  const handlePress = e => {
    setXY({x: e.nativeEvent.locationX, y: e.nativeEvent.locationY});
  };

  const handlePlacing = async () => {
    await placeSignature(fileUri, page, paths, {
      x: xy.x,
      y: xy.y,
    });
    navigation.navigate('Result', {fileUri, page});
  };

  return (
    <View style={styles.container}>
      <Text>Press anywhere to place a signature</Text>
      <View style={{flex: 1}} />
      <Pressable style={styles.pressable} onPress={handlePress}>
        <Pdf
          source={{uri: fileUri, cache: true}}
          page={page}
          style={styles.pdf}
          enablePaging={false}
          singlePage={true}
        />
      </Pressable>
      <View style={{flex: 1}} />
      <View style={styles.buttonContainer}>
        <Button
          color="#841584"
          title="Place Signature"
          onPress={handlePlacing}
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
    width: '100%',
    height: '100%',
  },
  pdf: {
    flex: 5,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  pressable: {
    flex: 5,
    width: '100%',
    height: '100%',
  },
});
