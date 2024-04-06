import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import React, {useState} from 'react';
import {Button, View, StyleSheet} from 'react-native';
import {Canvas, Path, Skia, SkPath} from '@shopify/react-native-skia';
import {runOnJS} from 'react-native-reanimated';

export default function Signature({route, navigation}) {
  const {fileName, fileUri} = route.params;
  const [paths, setPaths] = useState<SkPath[]>([]);
  const [path, setPath] = useState<SkPath>(Skia.Path.Make());

  const handleStart = g => {
    path.moveTo(g.x, g.y);
  };

  const handleUpdate = g => {
    path.lineTo(g.x, g.y);
  };

  const handleEnd = _ => {
    const pathsCopy = [...paths];
    pathsCopy.push(path);
    setPath(Skia.Path.Make());
    setPaths(pathsCopy);
  };

  const pan = Gesture.Pan()
    .onStart(e => runOnJS(handleStart)(e))
    .onUpdate(e => runOnJS(handleUpdate)(e))
    .onEnd(e => runOnJS(handleEnd)(e))
    .minDistance(1);

  const resetPath = () => {
    setPaths([]);
  };

  const navigateToEditPdf = () => {
    const svgPaths = paths.map(p => p.toSVGString());
    navigation.navigate('Select Page', {
      fileName: fileName,
      fileUri: fileUri,
      paths: svgPaths,
    });
  };

  return (
    <GestureDetector gesture={pan}>
      <View style={styles.flex}>
        <Canvas style={styles.flex}>
          {paths.map((p, index) => (
            <Path
              key={index}
              path={p}
              strokeWidth={5}
              style="stroke"
              color="black"
            />
          ))}
        </Canvas>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.flex}>
            <Button
              onPress={resetPath}
              title="Reset Signature"
              color="#841584"
            />
          </View>

          <View style={styles.flex}>
            <Button onPress={navigateToEditPdf} title="Done" color="#841584" />
          </View>
        </View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
