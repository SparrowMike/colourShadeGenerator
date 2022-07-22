
export const splitString = (str, char) => {
  let lowercase = str.trim();
  let regEx = /\W+|(?=[A-Z])|_/g;
  let result = lowercase.split(regEx).join(char).toLowerCase();
  return result;
}