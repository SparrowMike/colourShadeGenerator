import { StyleSheet, Dimensions } from "react-native";
import { global } from "./themes";

const width = Dimensions.get("window").width; 

export default Styles = (currentStyles) => StyleSheet.create({
  align: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  mainBackground: {
    backgroundColor: currentStyles.background4,
  },

  mainTheme: {
    fontWeight: '900',
    fontSize: 24,
    color: currentStyles.text1,
  },

  loadCustomTheme: {
    backgroundColor: global.success2, 
    marginTop: 55
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

