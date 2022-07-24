import { StyleSheet, Dimensions } from "react-native";
import { global } from "./themes";

const width = Dimensions.get("window").width; 

export default Styles = (currentTheme) => StyleSheet.create({
  align: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  background4: {
    backgroundColor: currentTheme.background4,
  },

  currentThemeText: {
    fontWeight: '900',
    fontSize: 24,
    color: currentTheme.text1,
  },

  appButtonContainer: {
    width: width * .7,
    elevation: 8,
    marginBottom: 8,
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

