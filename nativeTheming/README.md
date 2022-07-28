# Native Theming

1. `themes.js` contains all the themes and global colours
1. `styles.js` contains the app styles
1. there are two scopes, one for server theme and another for current mode
    
    ```js
        const [darkMode, setDarkMode] = useState(true);
        const [serverTheme, setServerTheme] = useState({ 
            dark: { theme: 'black-beauty', palette: null }, 
            light: { theme: 'white-smoke', palette: null } 
        });
    ```
1. Below are variables that will allow us to add inline styles and also use `styles.js` styling with current theme.

    ```js
        const currentMode = darkMode ? 'dark' : 'light';
        const currentTheme = serverTheme[currentMode].theme

        const currentStyles = 
            currentTheme.includes('custom') && serverTheme[currentMode].palette !== null 
            ? serverTheme[currentMode].palette 
            : themes[currentTheme.replaceAll('-', '')];

        const globalStyles = themes.global;
        const styles = Styles(currentStyles);
    ```

    - for inline styles follow the theme - `style={{ color:  currentStyles.text4 }}`
    - for inline styles using the global colours - `style={{ backgroundColor: globalStyles.error2 }}`
    - for using styles `style={ styles.stylesName }`
    - we can also hardcode the theme - `style={{ color:  themes['blackbeauty'].accent1 }}`

1. We are passing `currentStyles` to styles, everytime theme changes, the colours will update.
    ```js
        const styles = Styles(currentStyles);
    ```

    ```js
        import { StyleSheet } from "react-native";
        import { global } from "./themes";


        export default Styles = (currentStyles) => StyleSheet.create({
            mainBackground: {
                backgroundColor: currentStyles.background4,
            },
        });
    ```
1. We need to remove all the dash symbols from the `theme` and the `palette`, thats why we have the following funcion.
    ```js
        const loadCustomTheme = (customTheme) => {
            for (let color in customTheme) {
                Object.assign(customTheme, { [color.replaceAll('-', '')]: customTheme[color] });
            }
            return customTheme
        };
    ```