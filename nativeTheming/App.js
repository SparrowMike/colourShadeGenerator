import React, { useState } from 'react';
import { View, Text, Switch } from 'react-native';
import * as themes from './styles/themes.js';
import * as utils from './utils/utils.js'
import styles from './styles/styles.js';
import ThemeButton from './components/ThemeButton.js';

const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [serverTheme, setServerTheme] = useState({ dark: 'blackBeauty', light: 'whiteSmoke' });

  const currentMode = darkMode ? 'dark' : 'light';
  const currentTheme = themes[serverTheme[currentMode]];
  const currentClass = styles(currentTheme);
  
  return (
    <View style={[currentClass.align, currentClass.background4]}>
      <Switch
        trackColor={{ false: currentTheme.background7, true: currentTheme.background7 }}
        thumbColor={currentTheme.accent1}
        ios_backgroundColor={currentTheme.background7}
        onValueChange={() => setDarkMode(darkMode => !darkMode)}
        value={!darkMode}
      />
      <Text style={currentClass.currentThemeText}>
        Current theme
      </Text>
      <Text style={[currentClass.currentThemeText, {marginBottom: 50, color:  currentTheme.text4}]}>
        {utils.splitString(serverTheme[currentMode], ' ')}
      </Text>
      {themes.themesOptions[currentMode].map((theme, index) => {
        return (
          <ThemeButton 
            theme={theme}
            index={index} 
            currentClass={currentClass} 
            serverTheme={serverTheme} 
            setServerTheme={setServerTheme}
            currentMode={currentMode} 
          />
        )
      })}
    </View>
  );
};

export default App;
