import 'react-native-gesture-handler';
import React from 'react';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SelectPdf from './screens/SelectPDF';
import Signature from './screens/Signature';
import SelectPage from './screens/SelectPage';
import PlaceSignature from './screens/PlaceSignature';
import Result from './screens/Result';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Select Pdf"
          component={gestureHandlerRootHOC(SelectPdf)}
        />
        <Stack.Screen
          name="Signature"
          component={gestureHandlerRootHOC(Signature)}
        />
        <Stack.Screen
          name="Select Page"
          component={gestureHandlerRootHOC(SelectPage)}
        />
        <Stack.Screen
          name="Place Signature"
          component={gestureHandlerRootHOC(PlaceSignature)}
        />
        <Stack.Screen name="Result" component={gestureHandlerRootHOC(Result)} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
