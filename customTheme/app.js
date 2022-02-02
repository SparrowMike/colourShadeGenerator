var app = angular.module("myApp", []);

app.controller("theme", function ($scope) {
  //? OBJECT STORING PALETTE INCREMENT VALUES
  const paletteToFeed = {
    primary: {
      "--primary-dark": { r: -15, g: -18, b: -22 },
      "--primary-medium": { r: 0, g: 0, b: 0 },
      "--primary-light": { r: 9, g: 25, b: 51 },
    },
    text: {
      "--main-text": { r: 99, g: 99, b: 99 },
      "--main-text-dark1": { r: 74, g: 74, b: 74 },
      "--main-text-dark2": { r: 17, g: 16, b: 16 },
      "--main-text-dark3": { r: 13, g: 13, b: 15 },
      "--main-text-dark4": { r: 0, g: 0, b: 0 },
    },
    background: {
      "--main-bg-darkest": { r: -17, g: -18, b: -23 },
      "--main-bg-darker": { r: -10, g: -10, b: -14 },
      "--main-bg-dark": { r: 0, g: -1, b: -2 },
      "--main-bg": { r: 0, g: 0, b: 0 },
      "--main-bg-light": { r: 8, g: 8, b: 9 },
      "--main-bg-lighter": { r: 14, g: 14, b: 17 },
      "--main-bg-lightest": { r: 30, g: 32, b: 36 },
    },
  };

  //? OBJECT TO STORE THE CUSTOM THEME
  let storedPalette = { primary: {}, text: {}, background: {} };

  const body = $("body").get(0).style; //? FOR THE COLOURPICKER

  //? LOAD THE THEME ON START
  const theme = localStorage.getItem("theme");
  let currentTheme = theme ? `.${theme}` : ".dark";
  $scope.selected = theme;
  if (theme) $("body").removeClass("light dark custom").addClass(theme);

  //? CHANGE THE THEMES - TOGGLING CLASS
  $scope.changeTheme = (theme) => {
    $scope.selected = theme
    localStorage.setItem("theme", theme);
    currentTheme = `.${theme}`;
    switch (theme) {
      case "light":
        $("body")
          .removeAttr("style")
          .removeClass("dark custom")
          .addClass("light");
        break;
      case "dark":
        $("body")
          .removeAttr("style")
          .removeClass("light custom")
          .addClass("dark");
        break;
      case "custom":
        if (theme === "custom") loadValues();
        $("body").removeClass("light dark").addClass("custom");
        break;
    }
    loadSelectedTheme(loadCurrentCss());
  };

  //?===================SAVE=====================
  $scope.saveValues = () => {
    localStorage.setItem("customTheme", JSON.stringify(storedPalette));
  };

  //?========LOAD VALUES FROM THE LOCAL STORAGE=========
  const loadValues = function () {
    const types = JSON.parse(localStorage.getItem("customTheme"));
    for (t in types) {
      for (v in types[t]) {
        body.setProperty(`${v}`, `${types[t][v]}`);
      }
    }
  };
  if (theme === "custom") {
    loadValues();
  }

  //?=====GET COLOURS OF THE CURRENT THEME - CSS OR LOCALSTORAGE=====
  const loadCurrentCss = () => {
    const files = document.styleSheets;
    for (f in files) {
      if (
        typeof files[f].href === "string" &&
        files[f].href.endsWith("styles.css")
      ) {
        for (c in files[f].cssRules) {
          if (files[f].cssRules[c].selectorText === `${currentTheme}`)
            return files[f].cssRules[c].cssText;
        }
      }
    }
  };

  //!================================================work in progress=========================================================
  //?========CONVERT loadCurrentCss FUNCTION INTO OBJECT AND STORE IT IN storedPalette=========
  const loadSelectedTheme = (input) => {
    input = input.substring(input.indexOf("-"), input.indexOf("}"));
    let results = {},
      attributes = input.split("; ");
    for (i = 0; i < attributes.length; i++) {
      let entry = attributes[i].split(":");
      results[entry.splice(0, 1)[0]] = entry.join(":");
    }

    if (currentTheme === '.custom' && localStorage.getItem("customTheme") !== null) {
      const gotback = JSON.parse(localStorage.getItem("customTheme")) 
      storedPalette.text = {...gotback.text}
      storedPalette.background = {...gotback.background}
      storedPalette.primary = {...gotback.primary}
    } else {
      for (r in results) {
        if (results[r] === "" || results[r] === undefined) delete results[r];
        if (r.includes("primary")) storedPalette.primary[r] = `${results[r].trim()}`;
        if (r.includes("text")) storedPalette.text[r] = `${results[r].trim()}`;
        if (r.includes("bg")) storedPalette.background[r] = `${results[r].trim()}`;
        // body.setProperty(r, results[r]); //* load colours with js
      }
    }

    $(`input#background`).val(storedPalette.background["--main-bg"]);
    $(`input#primary`).val(storedPalette.primary["--primary-medium"]);
    $(`input#text`).val(storedPalette.text["--main-text-dark4"]);
  };

  $(document).ready(function () {
    loadSelectedTheme(loadCurrentCss());
  });

  //!================================================================================================================

  //? CONVERT INCOMING RGB STRING TO OBJECT
  let rgbValues = new Object();
  function rgbToObj(rgb) {
    let colors = ["r", "g", "b"];
    let colorArr = rgb
      .slice(rgb.indexOf("(") + 1, rgb.indexOf(")"))
      .split(/, | ,|,/);
    colorArr.forEach((k, i) => {
      rgbValues[colors[i]] = Number(k);
    });
    return rgbValues;
  }

  //? CUSTOM COLOUR PICKER
  $scope.changeColor = (type) => {
    $(`#${type}`)
      .colorpicker({})
      .on("colorpickerChange", function (e) {
        rgbToObj(e.color.toString());
        for (color in storedPalette[type]) {
          const rgbArr = [
            rgbValues.r + paletteToFeed[type][color].r,
            rgbValues.g + paletteToFeed[type][color].g,
            rgbValues.b + paletteToFeed[type][color].b,
          ];
          for (c in rgbArr) {
            if (rgbArr[c] >= 255) rgbArr[c] = 255;
            if (rgbArr[c] <= 0) rgbArr[c] = 0;
          }
          const rgb = `rgb(${rgbArr[0]}, ${rgbArr[1]}, ${rgbArr[2]})`;
          //? keep the generated colour in the storePalette Object
          storedPalette[type][color] = rgb;
          //? display the currently generated colours
          body.setProperty(color, rgb);
        }
        console.info(storedPalette[type]);
      });
  };
});

//TODO============================================================================
//! substring undefined?
//? clean up functions unecessary loading when custom 

//? - create a better sample theme for user to messaround?
//? - more than one custom themes?
//? - most dominant color should always be the base