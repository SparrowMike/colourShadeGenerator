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
  Object.freeze(paletteToFeed)

  //? OBJECT TO STORE THE CUSTOM THEME
  const storedPalette = { primary: {}, text: {}, background: {} };

  const body = $("body").get(0).style; //? FOR THE COLOURPICKER

  //? LOAD THE THEME ON START
  const theme = localStorage.getItem("theme");
  let currentTheme = theme ? `.${theme}` : ".dark";
  $scope.selected = theme ? theme : "dark";
  if (theme) $("body").removeClass("light dark custom").addClass(theme);

  //? CHANGE THE THEMES - TOGGLING CLASS
  $scope.changeTheme = (theme) => {
    $scope.selected = theme;
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
        if (JSON.parse(localStorage.getItem("customTheme")) === null) $("body").removeAttr("style")
        loadValues();
        $("body").removeClass("light dark").addClass("custom");
        break;
    }
    loadSelectedTheme(loadCurrentCss());
  };

  //?===================UPDATE CUSTOM PALETTE=====================
  const customPaletteColors = () => {
    const theme = JSON.parse(localStorage.getItem("customTheme"))
    $(`#defaultTheme.custom #circles > .one`).css("background", theme.primary["--primary-light"]);
    $(`#defaultTheme.custom #circles > .two`).css("background", theme.primary["--primary-dark"]);
    $(`#defaultTheme.custom #circles > .three`).css("background", theme.background["--main-bg-darkest"]);
    $(`#defaultTheme.custom #circles > .four`).css("background", theme.background["--main-bg-lightest"]);
    $(`#defaultTheme.custom #circles > .five`).css("background", theme.text["--main-text-dark4"]);
  }


  //?===================SAVE=====================
  $scope.saveValues = () => {
    localStorage.setItem("customTheme", JSON.stringify(storedPalette));
    customPaletteColors()
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

  //?========CONVERT loadCurrentCss FUNCTION INTO OBJECT AND STORE IT IN storedPalette=========
  const loadSelectedTheme = (input) => {
    if (
      currentTheme === ".custom" &&
      localStorage.getItem("customTheme") !== null
    ) {
      const gotback = JSON.parse(localStorage.getItem("customTheme"));
      storedPalette.text = { ...gotback.text };
      storedPalette.background = { ...gotback.background };
      storedPalette.primary = { ...gotback.primary };
    } else {
      input = input.substring(input.indexOf("-"), input.indexOf("}"));
      let results = {},
        attributes = input.split("; ");
      for (i = 0; i < attributes.length; i++) {
        let entry = attributes[i].split(":");
        results[entry.splice(0, 1)[0]] = entry.join(":");
      }
      for (r in results) {
        if (results[r] === "" || results[r] === undefined) delete results[r];
        if (r.includes("primary")) storedPalette.primary[r] = `${results[r].trim()}`;
        if (r.includes("text")) storedPalette.text[r] = `${results[r].trim()}`;
        if (r.includes("bg")) storedPalette.background[r] = `${results[r].trim()}`;
        // body.setProperty(r, results[r]); //* load colours with js
      }
    }
  };

  $(document).ready(function () {
    loadSelectedTheme(loadCurrentCss());
    if (localStorage.getItem("customTheme") !== null) {
      customPaletteColors()
    }
  //? ==============UI MODAL================
  $scope.modal = () => {
    $('#mainWindow .ui.modal').modal('show');
  }
  });

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

  //!======================PICKR============================
  $(document).ready(function () {
    let $input = $("input.pickr-field");
    let current_color = $(".pickr-field").val() || "#041";
    let pickr;
    Object.keys(storedPalette).forEach((type) => {
      pickr = new Pickr({
        el: $(`.${type}Color`)[0],
        theme: "classic",
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
          "rgba(255, 193, 7, 1)",
          "rgba(255, 223, 1, 1)",
          "rgba(255, 235, 59, 1)",
        ],
        defaultRepresentation: "RGBA",
        closeWithKey: "Escape",
        useAsButton: false,
        // default: current_color,
        comparison: false,
        components: {
          preview: true,
          hue: true,
          interaction: {
            hex: true,
            rgba: true,
            input: true,
          },
        },
      });
      pickr.on("change", function (color, instance) {
        current_color = color.toRGBA().toString(0);
        $input.val(current_color).trigger("change");

        rgbToObj(current_color);
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
    });
  });
});

//TODO============================================================================
//! - substring undefined?
//? - clean up functions unecessary loading when custom

//? - create a better sample theme for user to messaround?
//? - more than one custom themes?
//? - most dominant color should always be the base
