export const splitString = (str, char) => {
  let lowercase = str.trim();
  let regEx = /\W+|(?=[A-Z])|_/g;
  let result = lowercase.split(regEx).join(char).toLowerCase();
  return result;
}

export const loadCustomTheme = (customTheme) => {
  for (let color in customTheme) {
    Object.assign(customTheme, { [color.replaceAll('-', '')]: customTheme[color] });
  }
  return customTheme
};