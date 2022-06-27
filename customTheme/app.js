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
      "--accent-1": { r: -15, g: -18, b: -22 },
      "--accent-2": { r: 0, g: 0, b: 0 },
      "--accent-3": { r: 9, g: 25, b: 51 },
      "--accent-4": { r: 11, g: 49, b: 109 },
    },
    text: {
      "--text-1": {r: 0, g: 0, b: 0},
      "--text-2": {r: -25, g: -25, b: -25},
      "--text-3": {r: -56, g: -56, b: -56},
      "--text-4": {r: -82, g: -83, b: -83},
      "--text-5": {r: -86, g: -86, b: -84},
      "--text-6": {r: -99, g: -99, b: -99},
    },
    background: {
      "--background-1": { r: -17, g: -18, b: -23 },
      "--background-2": { r: -10, g: -10, b: -14 },
      "--background-3": { r: 0, g: -1, b: -2 },
      "--background-4": { r: 0, g: 0, b: 0 },
      "--background-5": { r: 8, g: 8, b: 9 },
      "--background-6": { r: 14, g: 14, b: 17 },
      "--background-7": { r: 30, g: 32, b: 36 },
    },
    divider: {
      "--divider-lines-1": {r: 0, g: 0, b: 0},
      "--divider-lines-2": {r: -82, g: -82, b: -82}
    },
    shadow: {
      "--shadow": {r: 0, g: 0 ,b: 0}
    }
  };

  //?=============PICKR SWATHCES================
  const swatches = [
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
    "rgba(255, 193, 7, 1)"
  ]
  
  //?==========updatePickrColours feed==========
  const objectForPickerColour = {
    accent: '--accent-2', 
    text: '--text-1', 
    background: '--background-4', 
    divider: '--divider-lines-1', 
    shadow: '--shadow'
  }

  //?===============THEMES=================
  $scope.themes = {
    dark: {
      themes: ['black-beauty', 'dark-knight', 'rustic-pottery', 'botanical-forest', 'hearts-desire', 'custom-theme-dark'],
    },
    light: {
      themes: ['white-smoke', 'prairie-dance', 'farsighted', 'aqua-lolly', 'lush-blush', 'custom-theme-light'],
    }
  }

  //?================LOCAL STORAGE ===================
  //?========only feed into owner preference==========
  const serverOwnerThemes = JSON.parse(localStorage.getItem('serverOwnerThemes'));
  const serverPalettes = JSON.parse(localStorage.getItem('serverPalettes'));
  const darkMode = localStorage.getItem('darkMode')

  //?==============GLOBAL VARIABLES=============
  $scope.darkMode = darkMode === null ? true : darkMode === 'dark' ? true : false;
  $scope.currentMode = $scope.darkMode ? 'dark' : 'light';
  const storedPalette = {dark: {}, light: {}}
  const pickr = {}

  //?============SERVER OWNER PREFERENCE=============
  $scope.serverOwnerThemes = {
    dark: serverOwnerThemes?.dark !== undefined 
        ? serverOwnerThemes.dark 
        : 'black-beauty',
    light: serverOwnerThemes?.light !== undefined 
        ? serverOwnerThemes.light
        : 'white-smoke',
  }

  const serverOwnerPalettes = {
    dark: serverPalettes?.dark !== undefined 
        ? serverPalettes.dark
        : undefined,
    light: serverPalettes?.light !== undefined 
        ? serverPalettes.light 
        : undefined,
  }
  
  //?==========GET COLOURS OF THE CURRENT THEME========
  const loadCurrentCss = () => {
    const files = document.styleSheets;
    for (f in files) {
      if (
        typeof files[f].href === "string" &&
        files[f].href.endsWith("styles.css")
      ) {
        for (c in files[f].cssRules) {
          if (files[f].cssRules[c].selectorText === `.${$scope.serverOwnerThemes[$scope.currentMode]}`)
            return files[f].cssRules[c].cssText;
        }
      }
    }
  };

  //?==========DARK/LIGHT MODE============
  // $('.themeSwitch input[type="checkbox"]').change(() => {
  //   $scope.darkMode = !$scope.darkMode
  //   $scope.darkMode ? $scope.currentMode = 'dark' : $scope.currentMode = 'light' 
  //   localStorage.setItem("darkMode", $scope.currentMode);
  //   $scope.$apply()
  //   customPaletteColors()
  //   $scope.changeTheme($scope.serverOwnerThemes[$scope.currentMode])
  // })

  //?=======CHANGE THE THEMES - TOGGLING CLASS========
  $scope.changeTheme = (theme) => {
    $scope.serverOwnerThemes[$scope.currentMode] = theme
    localStorage.setItem("serverOwnerThemes", JSON.stringify($scope.serverOwnerThemes));

    $("html").removeAttr("style").removeClass()
    $(`.defaultTheme:not(.${theme})`).hasClass('active') && $('.defaultTheme').removeClass('active')

    theme.includes('custom-theme') && loadValues();

    $("html").addClass(theme);
    loadSelectedTheme(loadCurrentCss());
    updatePickrColours()
  };
  
  //?===================UPDATE CUSTOM PALETTE CIRCLES=====================
  const customPaletteColors = () => {
    for(let type in objectForPickerColour) {
      if (serverOwnerPalettes?.[$scope.currentMode] !== undefined) {
          $(`#defaultTheme #circles.custom > .${type}`)
          .css("background", serverOwnerPalettes[$scope.currentMode][objectForPickerColour[type]]);
      } else {
        $(`#defaultTheme #circles.custom > .${type}`)
        .css("background", '');
      }
    }
  }
  
  //?===================PICKR CURRENT COLOUR SQUARE======================
  const updatePickrColours = () => {
    for(let type in objectForPickerColour) {
      pickr[type].setColor(
        type
        ? storedPalette[$scope.currentMode][objectForPickerColour[type]]
        : 'rgb(0, 0, 0)')
    }
  }

  //?====================SAVE/STORE BUTTON=======================
  $scope.saveValues = () => {
    serverOwnerPalettes[$scope.currentMode] = {...storedPalette[$scope.currentMode]}
    
    customPaletteColors()
    
    localStorage.setItem("serverPalettes", JSON.stringify(serverOwnerPalettes));
    $scope.changeTheme($scope.darkMode ? 'custom-theme-dark' : 'custom-theme-light')
    
    parent.postMessage({serverOwnerPalettes: serverOwnerPalettes, serverOwnerThemes: $scope.serverOwnerThemes, savedTheme: true}, '*') 
  };
  
  
  //?===========UPDATE PARENT THEME ON THEME CHANGE==============
  $scope.sendCurrentTheme = () => {
    if (serverOwnerPalettes[$scope.currentMode] !== undefined) {
      parent.postMessage({serverOwnerPalettes: serverOwnerPalettes, serverOwnerThemes: $scope.serverOwnerThemes, savedTheme: true}, '*') 
    } else {
      parent.postMessage({serverOwnerThemes: $scope.serverOwnerThemes, savedTheme: false}, '*')
    }
  }

  //?========LOAD VALUES FROM THE LOCAL STORAGE=========
  const loadValues = function () {
    if(serverOwnerPalettes?.[$scope.currentMode] !== undefined) {
      for (let t in serverOwnerPalettes[$scope.currentMode]) {
        $("html").get(0).style.setProperty(`${t}`, `${serverOwnerPalettes[$scope.currentMode][t]}`);
      }
    }
  };

  //?=====CONVERT loadCurrentCss FUNCTION INTO OBJECT AND STORE IT IN storedPalette=====
  const loadSelectedTheme = (input) => {
    if ($scope.serverOwnerThemes[$scope.currentMode].includes("custom-theme") && serverOwnerPalettes[$scope.currentMode] !== undefined) {
      storedPalette[$scope.currentMode] = {...serverOwnerPalettes[$scope.currentMode]};
    } else {
      input = input.substring(input.indexOf("--"), input.indexOf("}"));
      let results = {},
        attributes = input.split("; ");
      for (i = 0; i < attributes.length; i++) {
        let entry = attributes[i].split(":");
        results[entry.splice(0, 1)[0]] = entry.join(":");
      }
      for (r in results) {
        if (results[r] !== "" || r !== "") {
          storedPalette[$scope.currentMode][r] = results[r].trim()
          $("html").get(0).style.setProperty(r, results[r]); //* load colours with js
        }
      }
    }
  };

  //?=========CONVERT INCOMING RGB STRING TO OBJECT==========
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
  
  //?======================PICKR============================
  const picker = () => {
    let $input = $("input.pickr-field");
    Object.keys(paletteToFeed).forEach((type) => {
      pickr[type] = new Pickr({
        el: $(`.${type}Color`)[0],
        theme: "monolith",
        appClass: 'pickr-theme',
        swatches: [...swatches],
        defaultRepresentation: "RGBA",
        closeWithKey: "Escape",
        position: 'left-start',
        useAsButton: false,
        closeOnScroll: true,
        default:
          type === 'background' 
            ? storedPalette[$scope.currentMode][`--background-4`]
            : type === 'accent' 
            ? storedPalette[$scope.currentMode][`--accent-2`]
            : type === 'divider' 
            ? storedPalette[$scope.currentMode][`--divider-lines-1`]
            : type === 'shadow' 
            ? storedPalette[$scope.currentMode][`--shadow`]
            : type === 'text' 
            ? storedPalette[$scope.currentMode][`--text-1`]
            : 'rgb(0, 0, 0)',
        comparison: false,
        components: {
          preview: false,
          hue: true,
          interaction: {
            hex: true,
            rgba: true,
            input: true,
          },
        },
      });
      pickr[type].on("change", function (color, instance) {
        current_color = color.toRGBA().toString(0);
        $input.val(current_color).trigger("change");

        const currentValue = rgbToObj(current_color);
        for (color in paletteToFeed[type]) {
          let rgbArr = []
          if (type === 'text' && (currentValue.r <= 90 || currentValue.g <= 90 || currentValue.b <= 90)) {
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
          let rgb = ''
          if (color === '--shadow') {
            rgb = `rgba(${rgbArr[0]}, ${rgbArr[1]}, ${rgbArr[2]}, 0.5)`;
          } else {
            rgb = `rgb(${rgbArr[0]}, ${rgbArr[1]}, ${rgbArr[2]})`;
          }
          //? keep the generated colour in the storePalette Object
          storedPalette[$scope.currentMode][color] = rgb;
          
          //? display the currently generated colours
          $("html").get(0).style.setProperty(color, rgb);
        }
      });
    });
  }

  //? ===========RUN ON START OF THE APP============
  $(document).ready(function () {
    !$scope.darkMode && $('.darkLightTheme').attr('checked', true);
    loadSelectedTheme(loadCurrentCss());
    !serverOwnerPalettes[$scope.currentMode] !== undefined && customPaletteColors()
    $scope.serverOwnerThemes[$scope.currentMode].includes("custom-theme") && loadValues();
    picker()
  });

  //? ==============Recieve Message==============
  window.onmessage = function(e) {
    const data = e.data;
    if (['https://mock-up-three.vercel.app', 'http://127.0.0.1:5500', 'http://127.0.0.1:8080/'].includes(e.origin)) return;

    console.log(data)
    if (!['', null, undefined, 'null', {}].includes(JSON.stringify(data.serverOwnerPalettes))) {
      localStorage.setItem("serverPalettes", JSON.stringify(data.serverOwnerPalettes));
      localStorageCustomTheme = data.currentPalette;
    } else {
      localStorage.removeItem('serverPalettes')
      serverOwnerPalettes[$scope.currentMode] = undefined;
    }
    customPaletteColors()
    $scope.changeTheme($scope.serverOwnerThemes[$scope.currentMode])

    if (data.serverOwnerThemes[$scope.currentMode]) {
      $('.defaultTheme').removeClass('active')
      $(`.${data.serverOwnerThemes[$scope.currentMode]}`).addClass('active')
      localStorage.setItem("serverOwnerThemes", data.serverOwnerThemes); 
      $scope.changeTheme(`${data.serverOwnerThemes[$scope.currentMode]}`) 
    }
  };
});