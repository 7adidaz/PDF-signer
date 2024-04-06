import Pdf from 'react-native-pdf';
import React from 'react';
import {Text, Pressable, StyleSheet, View, Button} from 'react-native';
import {SkPath} from '@shopify/react-native-skia';
import {PDFDocument, rgb} from 'pdf-lib';
import RNFS from 'react-native-fs';
import {Base64} from 'js-base64';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

async function placeSignature(
  fileUri: string,
  pageNum: number,
  paths: SkPath[],
  {
    x,
    y,
  }: {
    x: number;
    y: number;
  },
) {
  console.log('Placing signature, ', fileUri);
  const file = await RNFS.readFile(fileUri, 'base64');
  const pdfDoc = await PDFDocument.load(file);
  const page = pdfDoc.getPage(pageNum - 1);

  for (const path of paths) {
    const svg = path.toSVGString();
    page.drawSvgPath(svg, {
      x: x,
      y: page.getHeight() - y,
      borderColor: rgb(0, 1, 0),
      borderWidth: 5,
      scale: 0.5,
    });
  }

  const pdfBytes = await pdfDoc.save();
  const str = Base64.fromUint8Array(pdfBytes);
  await RNFS.writeFile(fileUri, str, 'base64');
}

export default function PlaceSignature({route, navigation}) {
  const {fileUri, page, originalUri, paths} = route.params;
  const [xy, setXY] = React.useState({x: 0, y: 0});
  const pressed = useSharedValue(false);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  const pan = Gesture.Pan()
    .onBegin(() => {
      pressed.value = true;
    })
    .onChange(event => {
      offsetX.value += event.changeX;
      offsetY.value += event.changeY;
    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {translateX: offsetX.value - 40},
      {translateY: offsetY.value - 40},
    ],
  }));

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        display: 'flex',
      }}>
      <Text>Press anywhere to place a signature</Text>
      <View style={{flex: 1}} />
      <Pressable
        style={{
          flex: 5,
          width: '100%',
          height: '100%',
        }}
        onPress={e => {
          setXY({x: e.nativeEvent.locationX, y: e.nativeEvent.locationY});
        }}>
        <GestureDetector gesture={pan}>
          <View
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              position: 'relative',
            }}>
            <Animated.View style={[styles.circle, animatedStyles]} />
            <Pdf
              source={{uri: fileUri, cache: true}}
              page={page}
              style={styles.pdf}
              enablePaging={false}
              singlePage={true}
            />
          </View>
        </GestureDetector>
      </Pressable>
      <View style={{flex: 1}} />
      <View style={styles.buttonContainer}>
        <Button
          title="Place Signature"
          onPress={async () => {
            await placeSignature(originalUri, page, paths, {
              x: xy.x,
              y: xy.y,
            });
            navigation.navigate('Result', {fileUri, page});
          }}
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
    backgroundColor: 'red',
    width: '100%',
    height: '100%',
  },
  draggable: {
    flex: 1,
    width: '100%',
    height: '100%',
    zIndex: 1,
    position: 'absolute',
  },
  pdf: {
    flex: 5,
    width: '100%',
    height: '100%',
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -999,
  },
  buttonContainer: {
    width: '100%',
  },
  circle: {
    height: 80,
    width: 80,
    zIndex: 1,
    backgroundColor: '#b58df1',
    borderRadius: 500,
  },
});
