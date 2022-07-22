import React from 'react';
import * as themes from './../styles/themes.js';
import * as utils from './../utils/utils.js';
import { Text, TouchableOpacity } from 'react-native';

const ThemeButton = ({theme, index, currentClass, serverTheme, setServerTheme, currentMode}) => {
  const currentTheme = themes[theme];
  return (
    <TouchableOpacity 
      key={index} 
      onPress={() => setServerTheme({ ...serverTheme, [currentMode]: theme })}
      style={[ 
        currentClass.appButtonContainer, { 
        backgroundColor: currentTheme.background7, 
        borderWidth: 2,
        borderColor: theme == serverTheme[currentMode] ? currentTheme.accent1 : 'transparent'
      }]} >
        <Text style={[currentClass.appButtonText, { color: currentTheme.accent1 }]}>
          {utils.splitString(theme, ' ')}
        </Text>
    </TouchableOpacity>
  )
};

export default ThemeButton;