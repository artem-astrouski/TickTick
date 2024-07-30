import React, { memo, useCallback } from 'react';
import { Button } from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { defaultConfig } from 'src/navigation/constants';
import { NavigationParams } from 'src/navigation/types';
import { KeyValueRepository } from 'src/repositories/key-value-repository';
import Home from 'src/screens/Home.screen';
import SignIn from 'src/screens/SignIn.screen';
import SignUp from 'src/screens/SignUp.screen';
import { useDispatch, useStore } from 'src/store/store';

const Stack = createNativeStackNavigator<NavigationParams>();

const NavigationRoot = () => {
  const dispatch = useDispatch();

  const {
    auth: { accessToken },
  } = useStore();

  const isAuthorised = !!accessToken;

  const renderHeaderRight = useCallback(() => {
    return (
      <Button
        mode={'text'}
        children={'Logout'}
        onPress={() => {
          dispatch({ type: 'CLEAR_STORE' });
          KeyValueRepository.clearAll();
        }}
      />
    );
  }, [dispatch]);

  return (
    <Stack.Navigator screenOptions={{ ...defaultConfig }}>
      {!isAuthorised ? (
        <React.Fragment>
          <Stack.Screen name={'SignIn'} component={SignIn} />
          <Stack.Screen name={'SignUp'} component={SignUp} />
        </React.Fragment>
      ) : (
        <React.Fragment>
          {/* prettier-ignore */}
          <Stack.Screen name={'Home'} component={Home} options={{headerShown: true, headerRight: renderHeaderRight}} />
        </React.Fragment>
      )}
    </Stack.Navigator>
  );
};

export default memo(NavigationRoot);
