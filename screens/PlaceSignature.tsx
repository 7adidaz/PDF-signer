import Pdf from 'react-native-pdf';
import React, {useState} from 'react';
import {Button, Dimensions, StyleSheet, View} from 'react-native';
import Drag, {Response} from '../components/Dragable';
import {Path, Svg} from 'react-native-svg';
import {SkPath} from '@shopify/react-native-skia';
import {PDFDocument, rgb} from 'pdf-lib';
import RNFS from 'react-native-fs';
import {Base64} from 'js-base64';

function pathsToSvg(paths_: SkPath[], x: number, y: number) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  // map paths to svg
  const pathsArray = paths_.map((path, index) => {
    const bounds = path.getBounds();
    minX = Math.min(minX, bounds.x);
    minY = Math.min(minY, bounds.y);
    maxX = Math.max(maxX, bounds.x + bounds.width);
    maxY = Math.max(maxY, bounds.y + bounds.height);

    return (
      <Path
        fill={'none'}
        key={index}
        d={path.toSVGString()}
        stroke={'black'}
        strokeWidth={9}
      />
    );
  });

  const viewBox = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;
  return (
    <Svg
      // preserveAspectRatio="none"
      x={x}
      y={y}
      width={'100%'}
      height={'100%'}
      viewBox={viewBox}>
      {pathsArray}
    </Svg>
  );
}

async function placeSignature(
  fileUri: string,
  pageNum: number,
  paths: SkPath[],
  {
    x,
    y,
    width,
    height,
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
  },
) {
  const file = await RNFS.readFile(fileUri, 'base64');
  const pdfDoc = await PDFDocument.load(file);
  const page = pdfDoc.getPage(pageNum - 1);

  const {height: h} = page.getSize();
  for (const path of paths) {
    const svg = path.toSVGString();
    console.log('x', x, 'y', y);
    page.drawSvgPath(svg, {
      x: x,
      y: h - y,
      borderColor: rgb(0, 1, 0),
      borderWidth: 5,
      scale: 0.5,
    });
  }

  const pdfBytes = await pdfDoc.save();
  const str = Base64.fromUint8Array(pdfBytes);
  await RNFS.writeFile(fileUri, str, 'base64');
  console.log('Signature placed');
}

export default function PlaceSignature({route}) {
  const {fileUri, page, paths} = route.params;
  const [dragableState, setDragableState] = useState({
    x: 50,
    y: 50,
    width: 500,
    height: 500,
  });

  const [limitationHeight, setLimitationHeight] = useState(0);
  const [limitationWidth, setLimitationWidth] = useState(0);

  const handleResize = (boxPosition: Response) => {
    setDragableState({
      x: boxPosition.x,
      y: boxPosition.y,
      width: boxPosition.width,
      height: boxPosition.height,
    });
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View style={styles.container}>
        <View
          style={styles.draggable}
          onLayout={ev => {
            const layout = ev.nativeEvent.layout;
            setLimitationHeight(layout.height);
            setLimitationWidth(layout.width);
          }}>
          <Drag
            x={100}
            y={100}
            limitationHeight={limitationHeight}
            limitationWidth={limitationWidth}
            onDragEnd={handleResize}
            onResizeEnd={handleResize}>
            {pathsToSvg(paths, dragableState.x, dragableState.y)}
          </Drag>
        </View>
        <Pdf
          source={{uri: fileUri, cache: true}}
          page={page}
          singlePage={true}
          style={styles.pdf}
          enablePaging={false}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={'Save signature'}
          color="#841584"
          onPress={() =>
            placeSignature(fileUri, page, paths, {
              x: dragableState.x,
              y: dragableState.y,
              width: dragableState.width,
              height: dragableState.height,
            })
          }
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
  },
  draggable: {
    flex: 1,
    width: '100%',
    height: '100%',
    zIndex: 1,
    position: 'absolute',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'green',
  },
  buttonContainer: {
    width: '100%',
    // flex: 1,
  },
});
