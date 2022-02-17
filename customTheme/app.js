var app = angular.module("myApp", []);

app.controller("theme", function ($scope, $http) {
  $http.get('data/onlineFriends.json').then(function(response) {
    $scope.onlineFriends = response.data;
  })
  $http.get('data/messagesHistory.json').then(function(response) {
    $scope.messagesHistory = response.data;
  })
  
  //? OBJECT STORING PALETTE INCREMENT VALUES
  const paletteToFeed = {
    accent: {
      "--accent-dark": { r: -15, g: -18, b: -22 },
      "--accent": { r: 0, g: 0, b: 0 },
      "--accent-light": { r: 9, g: 25, b: 51 },
    },
    secondary: {
      "--main-secondary": {r: 0, g: 0, b: 0},
      "--main-secondary-dark1": {r: -25, g: -25, b: -25},
      "--main-secondary-dark2": {r: -56, g: -56, b: -56},
      "--main-secondary-dark3": {r: -82, g: -83, b: -83},
      "--main-secondary-dark4": {r: -86, g: -86, b: -84},
      "--main-secondary-dark5": {r: -99, g: -99, b: -99},
      "--main-secondary-dark6": {r: -165, g: -165, b: -165},
      "--main-secondary-dark7": {r: -202, g: -202, b: -202}
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
  Object.freeze(paletteToFeed)

  //? OBJECT TO STORE THE CUSTOM THEME
  const storedPalette = { accent: {}, secondary: {}, background: {} };

  const body = $("html").get(0).style; //? FOR THE COLOURPICKER
  
  //? LOAD THE THEME ON START
  const theme = localStorage.getItem("theme");
  let currentTheme = theme ? `.${theme}` : ".dark-knight";
  $scope.selected = theme ? theme : "dark-knight";
  if (theme) $("html").removeClass().addClass(theme);

  $scope.sendCurrentTheme = () => {
    parent.postMessage({storedPalette: '', theme: $scope.selected}, '*')
  }
  //? CHANGE THE THEMES - TOGGLING CLASS
  $scope.changeTheme = (theme) => {
    $scope.selected = theme;
    localStorage.setItem("theme", theme);
    currentTheme = `.${theme}`; 

    $("html").removeAttr("style").removeClass()
    switch (theme) {
      case "light-theme":
        $("html").addClass("light-theme");
        break;
      case "black-beauty":
        $("html").addClass("black-beauty");
        break;
      case "dark-knight":
        $("html").addClass("dark-knight");
      break;
      case "botanical-forest":
        $("html").addClass("botanical-forest");
        break;
      case "pyramid-of-giza":
        $("html").addClass("pyramid-of-giza");
        break;
      case "rustic-pottery":
        $("html").addClass("rustic-pottery");
        break;
      case "aqua-lolly":
        $("html").addClass("aqua-lolly");
        break;
      case "lush-blush":
        $("html").addClass("lush-blush");
        break;
      case "custom-theme":
        if (JSON.parse(localStorage.getItem("customTheme")) === null) $("html").removeAttr("style")
        loadValues();
        $("html").addClass("custom-theme");
        break;
    }
    loadSelectedTheme(loadCurrentCss());
  };

  //? =========Recieve Message==========
  window.onmessage = function(e) {
    const data = e.data;
    // if (e.origin !== 'http://localhost:1337') return;
    if (data.selectedTheme !== undefined) $scope.changeTheme(data.selectedTheme)
  };

  //?===================UPDATE CUSTOM PALETTE=====================
  const customPaletteColors = () => {
    const theme = JSON.parse(localStorage.getItem("customTheme"))
    $(`#defaultTheme.custom-theme #circles > .one`).css("background", theme.accent["--accent-light"]);
    $(`#defaultTheme.custom-theme #circles > .two`).css("background", theme.accent["--accent-dark"]);
    $(`#defaultTheme.custom-theme #circles > .three`).css("background", theme.background["--main-bg-darkest"]);
    $(`#defaultTheme.custom-theme #circles > .four`).css("background", theme.background["--main-bg-lightest"]);
    $(`#defaultTheme.custom-theme #circles > .five`).css("background", theme.secondary["--main-secondary-dark5"]);
  }
  
  //?===================SAVE=====================
  $scope.saveValues = () => {
    localStorage.setItem("customTheme", JSON.stringify(storedPalette));
    customPaletteColors()
    parent.postMessage({storedPalette: storedPalette, theme: 'custom-theme'}, '*')
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
  if (theme === "custom-theme") {
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

  //?========CONVERT loadCurrentCss FUNCTION INTO OBJECT AND STORE IT IN storedPalette=========
  const loadSelectedTheme = (input) => {
    if (
      currentTheme === ".custom-theme" &&
      localStorage.getItem("customTheme") !== null
    ) {
      const gotback = JSON.parse(localStorage.getItem("customTheme"));
      storedPalette.accent = { ...gotback.accent };
      storedPalette.secondary = { ...gotback.secondary };
      storedPalette.background = { ...gotback.background };
    } else {
      try {
        input = input.substring(input.indexOf("--"), input.indexOf("}"));
      } catch(e) {
        console.error(e)
      }
      let results = {},
        attributes = input.split("; ");
      for (i = 0; i < attributes.length; i++) {
        let entry = attributes[i].split(":");
        results[entry.splice(0, 1)[0]] = entry.join(":");
      }
      for (r in results) {
        if (results[r] === "" || results[r] === undefined) delete results[r];
        if (r.includes("accent")) storedPalette.accent[r] = `${results[r].trim()}`;
        if (r.includes("secondary")) storedPalette.secondary[r] = `${results[r].trim()}`;
        if (r.includes("bg")) storedPalette.background[r] = `${results[r].trim()}`;
        body.setProperty(r, results[r]); //* load colours with js
      }
    }
  };

  $(document).ready(function () {
    loadSelectedTheme(loadCurrentCss());
    if (localStorage.getItem("customTheme") !== null) {
      customPaletteColors()
    }
  });

  //? CONVERT INCOMING RGB STRING TO OBJECT
  let rgbValues = new Object();
  function rgbToObj(rgb) {
    let colors = ["r", "g", "b", "a"];
    let colorArr = rgb
      .slice(rgb.indexOf("(") + 1, rgb.indexOf(")"))
      .split(/, | ,|,/);
    colorArr.forEach((k, i) => {
      rgbValues[colors[i]] = Number(k);
    });
    return rgbValues;
  }

  //!======================PICKR============================
  $(document).ready(function () {
    let $input = $("input.pickr-field");
    let current_color = $(".pickr-field").val() || "#041";
    let pickr;
    Object.keys(storedPalette).forEach((type) => {
      pickr = new Pickr({
        el: $(`.${type}Color`)[0],
        theme: "monolith",
        appClass: 'pickr-theme',
        swatches: [
          "rgba(244, 67, 54, 1)",
          "rgba(233, 30, 99, 1)",
          "rgba(156, 39, 176, 1)",
          "rgba(103, 58, 183, 1)",
          "rgba(63, 81, 181, 1)",
          "rgba(33, 150, 243, 1)",
          "rgba(3, 169, 244, 1)",
          "rgba(0, 188, 212, 1)",
          "rgba(0, 150, 136, 1)",
          "rgba(76, 175, 80, 1)",
          "rgba(139, 195, 74, 1)",
          "rgba(205, 220, 57, 1)",
          "rgba(255, 223, 1, 1)",
          "rgba(255, 193, 7, 1)",
        ],
        defaultRepresentation: "RGBA",
        closeWithKey: "Escape",
        position: 'left-start',
        useAsButton: false,
        // default: current_color,
        comparison: false,
        components: {
          preview: false,
          hue: true,
          interaction: {
            // hex: true,
            rgba: true,
            input: true,
          },
        },
      });
      pickr.on("change", function (color, instance) {
        current_color = color.toRGBA().toString(0);
        $input.val(current_color).trigger("change");

        const currentValue = rgbToObj(current_color);
        for (color in storedPalette[type]) {
          let rgbArr = []
          if (type == 'secondary' && (currentValue.r <= 90 || currentValue.g <= 50 || currentValue.b <= 127)|| 
          type == 'background' && (currentValue.r >= 200 || currentValue.g >= 200 || currentValue.b >= 256)) {
            rgbArr = [
              rgbValues.r - paletteToFeed[type][color].r,
              rgbValues.g - paletteToFeed[type][color].g,
              rgbValues.b - paletteToFeed[type][color].b,
            ];
          } else {
            rgbArr = [
              rgbValues.r + paletteToFeed[type][color].r,
              rgbValues.g + paletteToFeed[type][color].g,
              rgbValues.b + paletteToFeed[type][color].b,
            ];
          }
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
      });
    });
  });
});