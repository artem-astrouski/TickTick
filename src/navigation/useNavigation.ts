import { useNavigation as useReactNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { NavigationParams } from './types.ts';

export const useNavigation = () => useReactNavigation<NativeStackNavigationProp<NavigationParams>>();
