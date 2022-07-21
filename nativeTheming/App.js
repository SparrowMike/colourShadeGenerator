import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Dimensions } from 'react-native';
import * as themes from './styles/themes.js';

const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [theme, setTheme] = useState({ dark: 'blackBeauty', light: 'whiteSmoke' });

  const toggleSwitch = () => {
    setDarkMode(previousState => !previousState);
  }

  const splitString = (str) => {
    let lowercase = str.trim()
    let regEx = /\W+|(?=[A-Z])|_/g
    let result = lowercase.split(regEx).join(" ").toLowerCase()
  
    return result;
  }

  const width = Dimensions.get("window").width; 

  const styles = StyleSheet.create({
    align: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    background4: {
      backgroundColor: themes[theme[darkMode ? 'dark' : 'light']].background4,
    },

    currentThemeText: {
      fontWeight: '900',
      fontSize: 24,
      color: themes[theme[darkMode ? 'dark' : 'light']].text1,
    },

    appButtonContainer: {
      width: width * .7,
      elevation: 8,
      marginBottom: 5,
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 12
    },

    appButtonText: {
      fontSize: 18,
      fontWeight: "bold",
      alignSelf: "center",
      textTransform: "uppercase"
    }
  });

  const mapOptions = themes.themesOptions[darkMode ? 'dark' : 'light'].map((option, index) => {
    return (
      <TouchableOpacity 
        key={index} 
        onPress={() => setTheme({ ...theme, [darkMode ? 'dark' : 'light']: option })}
        style={[ styles.appButtonContainer, { backgroundColor: themes[option].accent1 }]} >
          <Text style={[ styles.appButtonText, { color: themes[option].background2 }]}>{splitString(option)}</Text>
      </TouchableOpacity>
    )
  });

  return (
    <View style={[styles.align, styles.background4]}>
      <Switch
        // trackColor={themes[theme[darkMode ? 'dark' : 'light']].divi}
        // thumbColor={themes[theme[darkMode ? 'dark' : 'light']].accent2}
        // ios_backgroundColor={themes[theme[darkMode ? 'dark' : 'light']].background6}
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={darkMode ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={!darkMode}
      />
      <Text style={styles.currentThemeText}>Current theme</Text>
      <Text style={[styles.currentThemeText, {marginBottom: 50, color:  themes[theme[darkMode ? 'dark' : 'light']].text4}]}>{splitString(theme[darkMode ? 'dark' : 'light'])}</Text>
      {mapOptions}
    </View>
  );
};

export default App;
