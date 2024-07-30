import React, { memo, useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { signUp } from 'src/common/api';
import { useNavigation } from 'src/navigation/useNavigation';

/* ------------- SignUp ------------- */
const SignUp = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [password2Error, setPassword2Error] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');

  const isValidForm = async () => {
    let isValid = true;

    if (!email || !email.includes('@')) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }
    if (!password) {
      setPasswordError('Password must be at least 1 character');
      isValid = false;
    }
    if (password !== password2) {
      setPassword2Error('Passwords must match');
      isValid = false;
    }
    if (!first_name.trim()) {
      setFirstNameError('Please enter a first name');
      isValid = false;
    }
    if (!last_name.trim()) {
      setLastNameError('Please enter a last name');
      isValid = false;
    }

    return isValid;
  };

  const onSignUp = useCallback(async () => {
    try {
      if (isValidForm()) {
        await signUp({
          email,
          password,
          first_name,
          last_name,
          password2,
        });

        setEmail('');
        setPassword('');
        setPassword2('');
        setFirstName('');
        setLastName('');

        navigation.navigate('SignIn');
        setTimeout(() => {
          Alert.alert('Registration successful!');
        }, 300);
      }
    } catch (error) {
      Alert.alert('Registration failed.');
    }
  }, [email, first_name, isValidForm, last_name, navigation, password, password2]);

  const onFirstNameChange = useCallback((text: string) => {
    setFirstNameError('');
    setFirstName(text);
  }, []);

  const onLastNameChange = useCallback((text: string) => {
    setLastNameError('');
    setLastName(text);
  }, []);

  const onEmailChange = useCallback((text: string) => {
    setEmail(text);
    setEmailError('');
  }, []);

  const onPwdChange = useCallback((text: string) => {
    setPassword(text);
    setPasswordError('');
  }, []);

  const onRepeatPwdChange = useCallback((text: string) => {
    setPassword2(text);
    setPassword2Error('');
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}>
        <View style={styles.placeholder} />
        <Text style={styles.title} variant="displayLarge">
          TickTick
        </Text>
        <View style={styles.placeholder} />

        <TextInput label="First Name" value={first_name} onChangeText={onFirstNameChange} style={styles.input} />
        <View style={styles.errorWrapper}>
          {firstNameError ? <Text style={styles.error}>{firstNameError}</Text> : null}
        </View>

        <TextInput label="Last Name" value={last_name} onChangeText={onLastNameChange} style={styles.input} />
        <View style={styles.errorWrapper}>
          {lastNameError ? <Text style={styles.error}>{lastNameError}</Text> : null}
        </View>

        <TextInput label="Email" value={email} onChangeText={onEmailChange} error={!!emailError} style={styles.input} />
        <View style={styles.errorWrapper}>{emailError ? <Text style={styles.error}>{emailError}</Text> : null}</View>

        <TextInput
          label="Password"
          value={password}
          onChangeText={onPwdChange}
          error={!!passwordError}
          secureTextEntry
          style={styles.input}
        />
        <View style={styles.errorWrapper}>
          {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}
        </View>

        <TextInput
          label="Confirm Password"
          value={password2}
          onChangeText={onRepeatPwdChange}
          error={!!password2Error}
          secureTextEntry
          style={styles.input}
        />
        <View style={styles.errorWrapper}>
          {password2Error ? <Text style={styles.error}>{password2Error}</Text> : null}
        </View>

        <Button mode="contained" onPress={onSignUp} style={styles.button}>
          Register
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

/* ------------- Styles ------------- */
const styles = StyleSheet.create({
  container: {
    minHeight: '100%',
  },
  scrollContent: {
    paddingHorizontal: 40,
    minHeight: '100%',
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
  button: {
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

export default memo(SignUp);
