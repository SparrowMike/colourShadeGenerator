import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Switch } from 'react-native';
import * as themes from './styles/themes.js';

const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const toggleSwitch = () => {
    setDarkMode(previousState => !previousState);
  }
  const [theme, setTheme] = useState({ dark: 'blackBeauty', light: 'whiteSmoke' });

  const themesOptions = {
    dark: ['blackBeauty', 'darkKnight', 'rusticPottery', 'botanicalForest', 'heartsDesire', 'customThemeDark'],
    light: ['whiteSmoke', 'prairieDance', 'farsighted', 'aquaLolly', 'lushBlush', 'customThemeLight'],
  };

  const styles = StyleSheet.create({
    align: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    button: {
      margin: 5,
    },

    background4: {
      backgroundColor: themes[theme[darkMode ? 'dark' : 'light']].background4,
    },

    color1: {
      fontWeight: '900',
      fontSize: 24,
      color: themes[theme[darkMode ? 'dark' : 'light']].text1,
    },
  });

  const mapOptions = themesOptions[darkMode ? 'dark' : 'light'].map((option, index) => {
    return <Button style={styles.button} key={index} onPress={() => setTheme( {...theme, [darkMode ? 'dark' : 'light']: option })} title={option} />
  });

  return (
    <View style={[styles.align, styles.background4]}>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={darkMode ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={!darkMode}
      />
      <Text style={styles.color1}>Current theme {theme[theme[darkMode ? 'dark' : 'light']]}</Text>
        {mapOptions}
    </View>
  );
};

export default App;
