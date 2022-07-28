import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import * as themes from './styles/themes.js';
import { splitString, loadCustomTheme } from './utils/utils.js'
import Styles from './styles/styles.js';
import ThemeButton from './components/ThemeButton.js';
import * as customTheme from './styles/customThemes.js';

const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [serverTheme, setServerTheme] = useState({ 
    dark: { theme: 'black-beauty', palette: null }, 
    light: { theme: 'white-smoke', palette: null } 
  });

  const currentMode = darkMode ? 'dark' : 'light';
  const currentTheme = serverTheme[currentMode].theme

  const currentStyles = 
    currentTheme.includes('custom') && serverTheme[currentMode].palette !== null 
      ? serverTheme[currentMode].palette 
      : themes[currentTheme.replaceAll('-', '')];

  const globalStyles = themes.global;
  const styles = Styles(currentStyles);

  return (
    <View style={[styles.align, styles.mainBackground]}>
      <Switch
        trackColor={{ false: currentStyles.background7, true: currentStyles.background7 }}
        thumbColor={currentStyles.accent1}
        ios_backgroundColor={currentStyles.background7}
        onValueChange={() => setDarkMode(darkMode => !darkMode)}
        value={!darkMode}
      />
      <Text style={styles.mainTheme}>
        Current theme
      </Text>
      <Text style={[styles.mainTheme, { marginBottom: 50, color:  currentStyles.text4 }]}>
        {splitString(currentTheme, ' ')}
      </Text>
      {themes.themesOptions[currentMode].map((theme, index) => {
        return (
          <ThemeButton 
            theme={theme}
            key={index} 
            styles={styles} 
            serverTheme={serverTheme} 
            setServerTheme={setServerTheme}
            currentMode={currentMode} 
          />
        )
      })}
      <TouchableOpacity 
        style={[ styles.appButtonContainer, styles.loadCustomTheme ]} 
        onPress={() => setServerTheme({ 
          ...serverTheme, 
          [currentMode]: { 
            theme: serverTheme[currentMode].theme, 
            palette: loadCustomTheme(customTheme[currentMode === 'dark' 
              ? 'customthemedark' 
              : 'customthemelight'
            ])
          }})} >
        <Text style={[styles.appButtonText, { color: globalStyles.buttonTextColor }]}>
          Load new custom theme
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[ styles.appButtonContainer, { backgroundColor: globalStyles.error2} ]} 
        onPress={() => setServerTheme({ 
          ...serverTheme, 
          [currentMode]: { 
            theme: serverTheme[currentMode].theme, 
            palette: null
          }})} >
        <Text style={[styles.appButtonText, { color: globalStyles.buttonTextColor }]}>
          Clear custom theme
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;
