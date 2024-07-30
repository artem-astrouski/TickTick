import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';

import NavigationRoot from 'src/navigation/NavigationRoot';
import { StoreProvider } from 'src/store/store';

function App(): React.JSX.Element {
  return (
    <StoreProvider>
      <NavigationContainer>
        <PaperProvider>
          <NavigationRoot />
        </PaperProvider>
      </NavigationContainer>
    </StoreProvider>
  );
}

export default App;
