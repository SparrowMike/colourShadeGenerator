import React from 'react';
import * as themes from './../styles/themes.js';
import { splitString } from './../utils/utils.js';
import { Text, TouchableOpacity } from 'react-native';

const ThemeButton = ({theme, styles, serverTheme, setServerTheme, currentMode}) => {
  const currentTheme = 
    theme.includes('custom') && serverTheme[currentMode].palette !== null 
      ? serverTheme[currentMode].palette 
      : themes[theme.replaceAll('-', '')]
      
  return (
    <TouchableOpacity 
      onPress={() => setServerTheme({ 
        ...serverTheme, 
        [currentMode]: { 
          theme: theme, 
          palette: serverTheme[currentMode].palette 
        }})}
      style={[ 
        styles.appButtonContainer, { 
        backgroundColor: currentTheme.background7, 
        borderWidth: 2,
        borderColor: theme == serverTheme[currentMode].theme ? currentTheme.accent1 : 'transparent'
      }]} >
        <Text style={[styles.appButtonText, { color: currentTheme.accent1 }]}>
          {splitString(theme, ' ')}
        </Text>
    </TouchableOpacity>
  )
};

export default ThemeButton;