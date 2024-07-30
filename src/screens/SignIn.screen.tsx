import React, { memo, useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { login } from 'src/common/api';
import { useNavigation } from 'src/navigation/useNavigation';
import { TokensRepository } from 'src/repositories/tokens-repository';
import { useDispatch } from 'src/store/store';

/* ------------- Types ------------- */
type Props = {};

/* ------------- Component ------------- */
const SignIn: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const isValidForm = useCallback(() => {
    let isValid = true;

    if (!email || !email.includes('@')) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }
    if (!password) {
      setPasswordError('Password must be at least 1 character');
      isValid = false;
    }

    return isValid;
  }, [email, password]);

  const onSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  const onLogin = useCallback(async () => {
    if (isValidForm()) {
      const tokens = await login({ password, email });
      if (tokens) {
        dispatch({ type: 'ADD_TOKEN', payload: { accessToken: tokens.access } });
        TokensRepository.addRefreshToken(tokens.refresh);
        TokensRepository.addAccessToken(tokens.access);
        setEmail('');
        setPassword('');
      }
    }
  }, [dispatch, email, isValidForm, password]);

  const onChangeEmail = useCallback((text: string) => {
    setEmail(text);
    setEmailError('');
  }, []);

  const onSetPwd = useCallback((text: string) => {
    setPassword(text);
    setPasswordError('');
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.placeholder} />
      <Text style={styles.title} variant="displayLarge">
        TickTick
      </Text>
      <View style={styles.placeholder} />

      <TextInput label="Email" value={email} onChangeText={onChangeEmail} error={!!emailError} style={styles.input} />
      <View style={styles.errorWrapper}>{emailError ? <Text style={styles.error}>{emailError}</Text> : null}</View>

      <TextInput
        label="Password"
        value={password}
        onChangeText={onSetPwd}
        error={!!passwordError}
        secureTextEntry
        style={styles.input}
      />
      <View style={styles.errorWrapper}>
        {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}
      </View>

      <Button style={styles.loginBtn} children={'Login'} mode={'contained'} onPress={onLogin} />
      <Button children={'Register'} mode={'text'} onPress={onSignUp} />
    </SafeAreaView>
  );
};

/* ------------- Styles ------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
  },
  title: {
    textAlign: 'center',
  },
  placeholder: {
    height: '12%',
  },
  input: {
    marginTop: 15,
  },
  loginBtn: {
    marginTop: 25,
    marginBottom: 10,
  },
  errorWrapper: {
    marginTop: 4,
    height: 15,
  },
  error: {
    color: '#ef0000',
  },
});

export default memo(SignIn);
