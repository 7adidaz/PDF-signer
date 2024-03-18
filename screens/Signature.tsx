import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import React, {useState} from 'react';
import {Button, View} from 'react-native';

import {Canvas, Path} from '@shopify/react-native-skia';

export default function Signature({route, navigation}) {
  const {fileName, fileUri} = route.params;
  const [paths, setPaths] = useState([]);
  const [currPath, setCurrPath] = useState({segments: [], color: 'black'});

  let currPathLocal = {...currPath};
  const pan = Gesture.Pan()
    .onStart(g => {
      currPathLocal = {
        ...currPathLocal,
        segments: [...currPathLocal.segments, `M ${g.x} ${g.y}`],
      };
    })
    .onUpdate(g => {
      currPathLocal = {
        ...currPathLocal,
        segments: [...currPathLocal.segments, `L ${g.x} ${g.y}`],
      };
    })
    .onEnd(g => {
      currPathLocal = {
        ...currPathLocal,
        segments: [...currPathLocal.segments, `L ${g.x} ${g.y}`],
      };
      setCurrPath(currPathLocal);
      setPaths(prevPaths => [...prevPaths, currPathLocal]);
      currPathLocal = {segments: [], color: 'black'};
    })
    .minDistance(1);

  const resetPath = () => {
    setPaths([]);
    setCurrPath({segments: [], color: 'black'});
  };

  const navigateToEditPdf = () => {
    navigation.navigate('Edit Pdf', {
      fileName: fileName,
      fileUri: fileUri,
    });
  };

  return (
    <GestureDetector gesture={pan}>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <Canvas style={{flex: 8}}>
          {paths.map((p, index) => (
            <Path
              key={index}
              path={p.segments.join(' ')}
              strokeWidth={5}
              style="stroke"
              color={p.color}
            />
          ))}
        </Canvas>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Button
              onPress={resetPath}
              title="Reset Signature"
              color="#841584"
            />
          </View>

          <View style={{flex: 1}}>
            <Button onPress={navigateToEditPdf} title="Done" color="#841584" />
          </View>
        </View>
      </View>
    </GestureDetector>
  );
}
