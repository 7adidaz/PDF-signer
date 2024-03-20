import {GestureHandlerRootView} from 'react-native-gesture-handler';
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
  // const svgPath = `M190.898 141.083L190.898 141.083L189.434 148.89L182.078 161.839L174.825 180.837L165.051 204.117L152.893 226.789L144.262 246.077L136.737 263.537L131.468 282.623L127.735 295.835L126.249 305.881L126.898 314.562L124.929 320.981L125.448 326.396L125.448 330.683L125.448 331.953L127.402 334.203L129.08 334.526L133.47 335.98L140.09 337.54L148.582 339.917L162.987 342.12L179.902 344.787L200.744 346.893L222.881 347.588L244.308 348.676L257.577 348.346L266.384 348.346L272.141 348.346L273.158 349.776L273.44 349.771L273.44 350.819L273.44 355.319L273.44 366.261L268.636 382.967L265.485 400.744L258.956 420.805L254.922 433.23L251.653 439.031L248.333 445.967L246.014 448.018L245.435 448.339L245.802 449.424L244.712 449.058`;
  const page = pdfDoc.getPage(pageNum - 1);

  // page.moveTo(100, page.getHeight() - 5);
  // page.moveDown(100);

  // page.drawCircle({
  //   size: 100,
  //   borderWidth: 5,
  //   borderColor: rgb(0, 1, 0),
  //   color: rgb(0.75, 0.2, 0.2),
  //   opacity: 0.5,
  //   borderOpacity: 0.75,
  // });
  // 0 0 is bottom left

  // console.log(page.getX(), page.getY());
  // console.log(page.getWidth(), page.getHeight());

  const {_, height_} = page.getSize();
  for (const path of paths) {
    const svg = path.toSVGString();
    page.drawSvgPath(svg, {
      x: x,
      y: height_ - y,
      borderColor: rgb(0, 1, 0),
      borderWidth: 5,
    });
  }

  // page.drawSvgPath(svgPath, {borderColor: rgb(0, 1, 0), borderWidth: 5});

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
      <GestureHandlerRootView style={styles.container}>
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
      </GestureHandlerRootView>

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
  },
  buttonContainer: {
    width: '100%',
  },
});
