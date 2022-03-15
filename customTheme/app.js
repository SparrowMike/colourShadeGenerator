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

  //? OBJECT TO STORE THE CUSTOM THEME
  let storedPalette = {};

  //? LOAD THE THEME ON START
  let pickr = {}
  const theme = localStorage.getItem("theme");
  $scope.selected = theme !== null ? theme : "black-beauty";

  //? CHANGE THE THEMES - TOGGLING CLASS
  $scope.changeTheme = (theme) => {
    if ($(`.defaultTheme:not(.${theme})`).hasClass('active')) $('.defaultTheme').removeClass('active')
    $scope.selected = theme;
    localStorage.setItem("theme", theme);
    
    $("html").removeAttr("style").removeClass()
    switch (theme) {
      case "custom-theme":
        if (JSON.parse(localStorage.getItem("customTheme")) === null) $("html").removeAttr("style")
        loadValues();
        break;
      }
      $("html").addClass(theme);
    loadSelectedTheme(loadCurrentCss());
    updatePickrColours()
  };

  //?===================UPDATE CUSTOM PALETTE=====================
  const customPaletteColors = () => {
    const theme = JSON.parse(localStorage.getItem("customTheme"))
    $(`#defaultTheme.custom-theme #circles > .accent`).css("background", theme["--accent-2"]);
    $(`#defaultTheme.custom-theme #circles > .text `).css("background", theme["--text-1"]);
    $(`#defaultTheme.custom-theme #circles > .background `).css("background", theme["--background-1"]);
    $(`#defaultTheme.custom-theme #circles > .divider `).css("background", theme["--divider-lines-1"]);
    $(`#defaultTheme.custom-theme #circles > .shadow `).css("background", theme["--shadow"]);
  }
      
  const updatePickrColours = () => {
    for(let type in paletteToFeed) {
      pickr[type].setColor(
        type === 'background' ? storedPalette['--background-4'] :
        type === 'accent' ? storedPalette['--accent-2'] :
        type === 'divider' ? storedPalette['--divider-lines-1'] :
        type === 'shadow' ? storedPalette['--shadow'] :
        type === 'text' ? storedPalette['--text-1'] :
        'rgb(0, 0, 0)')
    }
  }
  // rustic pottery background

  //?===================SAVE=====================
  $scope.saveValues = () => {
    localStorage.setItem("customTheme", JSON.stringify(storedPalette));
    customPaletteColors()
    parent.postMessage({storedPalette: storedPalette, theme: 'custom-theme', savedTheme: true}, '*')

    // ['https://genesiv.com/app', 'https://staging.genesiv.com/app', 'https://www.tradingroom.sg/app']
    // .map((domain) => parent.postMessage({storedPalette: storedPalette, theme: 'custom-theme', savedTheme: true}, domain));
  };
  $scope.sendCurrentTheme = () => {
    parent.postMessage({storedPalette: JSON.parse(localStorage.getItem("customTheme")), theme: $scope.selected, savedTheme: false}, '*')

    // ['https://genesiv.com/app', 'https://staging.genesiv.com/app', 'https://www.tradingroom.sg/app']
    // .map((domain) => parent.postMessage({storedPalette: JSON.parse(localStorage.getItem("customTheme")), theme: $scope.selected, savedTheme: false}, domain));
  }
  

  //?========LOAD VALUES FROM THE LOCAL STORAGE=========
  const loadValues = function () {
    const types = JSON.parse(localStorage.getItem("customTheme"));
    for (t in types) {
      $("html").get(0).style.setProperty(`${t}`, `${types[t]}`);
    }
  };

  //?=====GET COLOURS OF THE CURRENT THEME=====
  const loadCurrentCss = () => {
    const files = document.styleSheets;
    for (f in files) {
      if (
        typeof files[f].href === "string" &&
        files[f].href.endsWith("styles.css")
      ) {
        for (c in files[f].cssRules) {
          if (files[f].cssRules[c].selectorText === `.${$scope.selected}`)
            return files[f].cssRules[c].cssText;
        }
      }
    }
  };

  //?========CONVERT loadCurrentCss FUNCTION INTO OBJECT AND STORE IT IN storedPalette=========
  const loadSelectedTheme = (input) => {
    if (
      $scope.selected === "custom-theme" &&
      localStorage.getItem("customTheme") !== null
    ) {
      const gotback = JSON.parse(localStorage.getItem("customTheme"));
      storedPalette = { ...gotback};
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
        if (results[r] !== "" || r !== "") {
          storedPalette[r] = results[r].trim()
          $("html").get(0).style.setProperty(r, results[r]); //* load colours with js
        }
      }
    }
  };

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

  //?======================PICKR============================
  const picker = () => {
    let $input = $("input.pickr-field");
    Object.keys(paletteToFeed).forEach((type) => {
      pickr[type] = new Pickr({
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
        closeOnScroll: true,
        default:  type === 'background' ? storedPalette[`--background-4`] :
        type === 'accent' ? storedPalette[`--accent-2`] :
        type === 'divider' ? storedPalette[`--divider-lines-1`] :
        type === 'shadow' ? storedPalette[`--shadow`] :
        type === 'text' ? storedPalette[`--text-1`] :
        '#fff',
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
      pickr[type].on("change", function (color, instance) {
        current_color = color.toRGBA().toString(0);
        $input.val(current_color).trigger("change");

        const currentValue = rgbToObj(current_color);
        for (color in paletteToFeed[type]) {
          let rgbArr = []
          if (type == 'text' && (currentValue.r <= 90 || currentValue.g <= 90 || currentValue.b <= 90)) {
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
          storedPalette[color] = rgb;
          
          //? display the currently generated colours
          $("html").get(0).style.setProperty(color, rgb);
        }
      });
    });
  }

  $(document).ready(function () {
    loadSelectedTheme(loadCurrentCss());
    if (localStorage.getItem("customTheme") !== null) {
      customPaletteColors()
    }
    if (theme === "custom-theme") {
      loadValues();
    }
    picker()
  });

  //? =========Recieve Message==========
  window.onmessage = function(e) {
    const data = e.data;
    if (e.origin === 'http://127.0.0.1:5501' || e.origin === 'https://mock-up-three.vercel.app/') return;
    $('.defaultTheme').removeClass('active')
    $(`.${data.selectedTheme}`).addClass('active')
    localStorage.setItem("customTheme", JSON.stringify(data.currentPalette));  
    localStorage.setItem("theme", data.selectedTheme);  
    storedPalette = JSON.stringify(data.currentPalette);
    $scope.changeTheme(data.selectedTheme)
    customPaletteColors()
  };
});