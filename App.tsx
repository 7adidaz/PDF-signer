import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SelectPdf from './screens/SelectPDF';
import Signature from './screens/Signature';
import EditPdf from './screens/EditPDF';

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
          name="Edit Pdf"
          component={gestureHandlerRootHOC(EditPdf)}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
