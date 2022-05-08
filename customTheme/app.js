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
  Object.freeze(paletteToFeed)

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

  //?==============GLOBAL VARIABLES=============
  let localStorageCustomTheme = !['', null, undefined, 'null', {}]
  .includes(localStorage.getItem("customTheme"))
  ? JSON.parse(localStorage.getItem("customTheme"))
  : undefined 
  
  const pickr = {}
  const serverOwnerPreference = JSON.parse(localStorage.getItem('serverOwnerPreference'));
  const darkMode = JSON.parse(localStorage.getItem('darkMode'))
  
  $scope.darkMode = darkMode !== null ? darkMode : true; //? can change for regular variable rather than scope
  $scope.currentMode = $scope.darkMode ? 'dark' : 'light';

  //?===============THEMES=================
  $scope.themes = {
    dark: {
      themes: ['black-beauty', 'dark-knight', 'rustic-pottery', 'botanical-forest', 'hearts-desire', 'custom-theme-dark'],
    },
    light: {
      themes: ['white-smoke', 'prairie-dance', 'farsighted', 'aqua-lolly', 'lush-blush', 'custom-theme-light'],
    }
  }
  
  //?========SERVER OWNER PREFERENCE=========
  $scope.serverOwnerPreference = {
    dark: {
      selectedTheme: serverOwnerPreference?.dark?.selectedTheme !== undefined ? serverOwnerPreference.dark.selectedTheme : 'black-beauty',
      storedPalette: serverOwnerPreference?.dark?.storedPalette !== undefined ? serverOwnerPreference.dark.storedPalette : {},
    },
    light: {
      selectedTheme: serverOwnerPreference?.light?.selectedTheme !== undefined ? serverOwnerPreference.light.selectedTheme : 'white-smoke',
      storedPalette: serverOwnerPreference?.light?.selectedTheme !== undefined ? serverOwnerPreference.light.selectedTheme : {},
    }
  }

  //?==========DARK/LIGHT MODE============
  $('.themeSwitch input[type="checkbox"]').change(()=>{
    $scope.darkMode = !$scope.darkMode
    $scope.darkMode ? $scope.currentMode = 'dark' : $scope.currentMode = 'light' 
    localStorage.setItem("darkMode", ($scope.darkMode));
    $scope.$apply()
    $scope.changeTheme($scope.serverOwnerPreference[$scope.currentMode].selectedTheme)
  })

  //?=======CHANGE THE THEMES - TOGGLING CLASS========
  $scope.changeTheme = (theme) => {
    $scope.serverOwnerPreference[$scope.currentMode].selectedTheme = theme

    localStorage.setItem("serverOwnerPreference", JSON.stringify($scope.serverOwnerPreference));

    $("html").removeAttr("style").removeClass()
    if ($(`.defaultTheme:not(.${theme})`).hasClass('active')) {
      $('.defaultTheme').removeClass('active')
    }
    switch (theme) {
      case theme.includes('custom-theme'):
        loadValues();
        break;
      }
    $("html").addClass(theme);
    loadSelectedTheme(loadCurrentCss());
    updatePickrColours()
  };

  //?===================UPDATE CUSTOM PALETTE=====================
  const customPaletteColors = () => {
    for(let type in objectForPickerColour) {
      if (localStorageCustomTheme !== undefined) {
          $(`#defaultTheme.custom-theme #circles > .${type}`)
          .css("background", localStorageCustomTheme[objectForPickerColour[type]]);
      } else {
        $(`#defaultTheme.custom-theme #circles > .${type}`)
        .css("background", '');
      }
    }
  }

  //?===================PICKR CURRENT COLOUR======================
  const updatePickrColours = () => {
    for(let type in objectForPickerColour) {
      pickr[type].setColor(
        type
        ? $scope.serverOwnerPreference[$scope.currentMode].storedPalette[objectForPickerColour[type]] 
        : 'rgb(0, 0, 0)')
    }
  }

  //?====================SAVE/STORE BUTTON=======================
  $scope.saveValues = () => {
    localStorage.setItem("serverOwnerPreference", JSON.stringify($scope.serverOwnerPreference));
    localStorageCustomTheme = $scope.serverOwnerPreference[$scope.currentMode].storedPalette
    customPaletteColors()
    parent.postMessage({storedPalette: $scope.serverOwnerPreference[$scope.currentMode].storedPalette, theme: 'custom-theme', savedTheme: true}, '*')
  };
  
  
  //?===========UPDATE PARENT THEME ON THEME CHANGE==============
  $scope.sendCurrentTheme = () => {
    if (localStorageCustomTheme !== undefined) {
      parent.postMessage({
        storedPalette: localStorageCustomTheme, theme: $scope.serverOwnerPreference[$scope.currentMode].selectedTheme, savedTheme: false
      }, '*')
    } else {
      parent.postMessage({theme: $scope.serverOwnerPreference[$scope.currentMode].selectedTheme, savedTheme: false}, '*')
    }
  }

  //?========LOAD VALUES FROM THE LOCAL STORAGE=========
  const loadValues = function () {
    if(localStorageCustomTheme !== undefined) {
      for (t in localStorageCustomTheme) {
        $("html").get(0).style.setProperty(`${t}`, `${localStorageCustomTheme[t]}`);
      }
    }
  };

  //?==========GET COLOURS OF THE CURRENT THEME========
  const loadCurrentCss = () => {
    const files = document.styleSheets;
    for (f in files) {
      if (
        typeof files[f].href === "string" &&
        files[f].href.endsWith("styles.css")
      ) {
        for (c in files[f].cssRules) {
          if (files[f].cssRules[c].selectorText === `.${$scope.serverOwnerPreference[$scope.currentMode].selectedTheme}`)
            return files[f].cssRules[c].cssText;
        }
      }
    }
  };

  //?=====CONVERT loadCurrentCss FUNCTION INTO OBJECT AND STORE IT IN storedPalette=====
  const loadSelectedTheme = (input) => {
    if ($scope.serverOwnerPreference[$scope.currentMode].selectedTheme.includes("custom-theme") && !['', null, undefined, 'null'].includes(localStorage.getItem("customTheme"))) {
      $scope.serverOwnerPreference[$scope.currentMode].storedPalette = { ...localStorageCustomTheme};
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
          $scope.serverOwnerPreference[$scope.currentMode].storedPalette[r] = results[r].trim()
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
        default: type === 'background' ? $scope.serverOwnerPreference[$scope.currentMode].storedPalette[`--background-4`] :
        type === 'accent' ? $scope.serverOwnerPreference[$scope.currentMode].storedPalette[`--accent-2`] :
        type === 'divider' ? $scope.serverOwnerPreference[$scope.currentMode].storedPalette[`--divider-lines-1`] :
        type === 'shadow' ? $scope.serverOwnerPreference[$scope.currentMode].storedPalette[`--shadow`] :
        type === 'text' ? $scope.serverOwnerPreference[$scope.currentMode].storedPalette[`--text-1`] :
        'rgb(0, 0, 0)',
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
          $scope.serverOwnerPreference[$scope.currentMode].storedPalette[color] = rgb;
          
          //? display the currently generated colours
          $("html").get(0).style.setProperty(color, rgb);
        }
      });
    });
  }

  //? ===========RUN ON START OF THE APP============
  $(document).ready(function () {
    if (!$scope.darkMode) {
      $('.darkLightTheme').attr('checked', true);
    }
    loadSelectedTheme(loadCurrentCss());
    if (!['', null, undefined, 'null', {}].includes(localStorageCustomTheme)) {
      customPaletteColors()
    }
    if ($scope.serverOwnerPreference[$scope.currentMode].selectedTheme.includes("custom-theme")) {
      loadValues();
    }
    picker()
  });

  //? ==============Recieve Message==============
  window.onmessage = function(e) {
    const data = e.data;
    if (['https://mock-up-three.vercel.app', 'http://127.0.0.1:5500'].includes(e.origin)) return;
    if (!['', null, undefined, 'null', {}].includes(JSON.stringify(data.currentPalette))) {
      localStorage.setItem("customTheme", JSON.stringify(data.currentPalette));  
      localStorageCustomTheme = data.currentPalette;
      customPaletteColors()
    } else {
      localStorage.removeItem('customTheme')
      localStorageCustomTheme = undefined
      customPaletteColors()
    }
    if (data.selectedTheme) {
      $('.defaultTheme').removeClass('active')
      $(`.${data.selectedTheme}`).addClass('active')
      localStorage.setItem("theme", data.selectedTheme); 
      $scope.changeTheme(`${data.selectedTheme}`) 
    }
  };
});