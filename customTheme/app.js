var app = angular.module("myApp", []);

app.controller("theme", function ($scope) {
  const body = $("body").get(0).style; //? FOR COLOURPICKER

  //? LOAD THE THEME ON START
  const theme = localStorage.getItem("theme");
  if (theme) $("body").removeClass("light dark custom").addClass(theme);

  //? PALETTE VARIABLES FOR THE PICKER TO FEED FROM
  const palette = {
    background: [
      "--main-bg-darkest",
      "--main-bg-darker",
      "--main-bg-dark",
      "--main-bg",
      "--main-bg-light",
      "--main-bg-lighter",
      "--main-bg-lightest",
    ],
    text: [
      "--main-text",
      "--main-text-dark1",
      "--main-text-dark2",
      "--main-text-dark3",
      "--main-text-dark4",
    ],
    primary: ["--primary-dark", "--primary-medium", "--primary-light"],
  };

  //? OBJECT TO STORE THE CUSTOM THEME
  let storedPalette = {
    primary: {
      "--primary-dark": "rgb(229, 151, 29)",
      "--primary-medium": "rgb(244, 169, 51)",
      "--primary-light": "rgb(253, 194, 102)",
    },
    background: {
      "--main-bg-darkest": "rgb(20, 20, 20)",
      "--main-bg-darker": "rgb(27, 28, 29)",
      "--main-bg-dark": "rgb(37, 37, 41)",
      "--main-bg": "rgb(37, 38, 43)",
      "--main-bg-light": "rgb(45, 46, 52)",
      "--main-bg-lighter": "rgb(51, 52, 60)",
      "--main-bg-lightest": "rgb(67, 70, 79)",
    },
    text: {
      "--main-text": "rgb(252, 252, 252)",
      "--main-text-dark1": "rgb(227, 227, 227)",
      "--main-text-dark2": "rgb(170, 169, 169)",
      "--main-text-dark3": "rgb(166, 166, 168)",
      "--main-text-dark4": "rgb(153, 153, 153)",
    },
  };

  //!============================================================================

  //?=====SEARCH THE HTML HEAD TO FIND THE RIGHT CSS
  const checkCurrentStyles = () => {
    const css = document.styleSheets;
    for (c in css) {
      if (
        typeof css[c].href === "string" &&
        css[c].href.endsWith("styles.css")
        ) {
          console.log(`styles.css found at position ${c} of all styleSheets`);
          console.log(css[c].cssRules[1].cssText);
        }
      }
    }

  //?========================================

  $scope.saveValues = () => {
    localStorage.setItem("customTheme", JSON.stringify(storedPalette));
  };

  $scope.loadValues = function () {
    const data = JSON.parse(localStorage.getItem("customTheme"))
    for (d in data) {
      for (i in data[d]) {
        body.setProperty(`${i}`, `${data[d][i]}`)
      }
    } 
  }
  if (theme === 'custom') {
    $scope.loadValues()
  }

  //!============================================================================

  //? CHANGE THE THEMES - TOGGLING CLASS
  $scope.changeTheme = (theme) => {
    localStorage.setItem("theme", theme);
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
        if(theme==='custom') $scope.loadValues()
        $("body")
          .removeClass("light dark")
          .addClass("custom");
        break;
    }
  };

  let rgbValues = new Object();

  function rgbToObj(rgb) {
    let colors = ["red", "green", "blue", "alpha"];
    let colorArr = rgb
      .slice(rgb.indexOf("(") + 1, rgb.indexOf(")"))
      .split(/, | ,|,/);
    colorArr.forEach((k, i) => {
      rgbValues[colors[i]] = Number(k);
    });
    return rgbValues;
  }

  //! CUSTOM COLOUR PICKER
  $(function () {
    $("#primary") //!========PRIMARY========
      .colorpicker({})
      .on("colorpickerChange", function (e) {
        
        rgbToObj(e.color.toString());

        storedPalette.primary['--primary-dark'] = `rgb(${rgbValues.red - 15},${rgbValues.green - 18},${rgbValues.blue - 22})`
        storedPalette.primary['--primary-medium'] = `rgb(${rgbValues.red},${rgbValues.green},${rgbValues.blue})`
        storedPalette.primary['--primary-light'] = `rgb(${rgbValues.red + 9},${rgbValues.green + 25},${rgbValues.blue + 51})`

        body.setProperty(`${palette.primary[0]}`,`rgb(${rgbValues.red - 15},${rgbValues.green - 18},${rgbValues.blue - 22})`);
        body.setProperty(`${palette.primary[1]}`,`rgb(${rgbValues.red},${rgbValues.green},${rgbValues.blue})`);
        body.setProperty(`${palette.primary[2]}`,`rgb(${rgbValues.red + 9},${rgbValues.green + 25},${rgbValues.blue + 51})`);
      });

    $("#text") //!========TEXT========
      .colorpicker({})
      .on("colorpickerChange", function (e) {
        
        rgbToObj(e.color.toString());

        storedPalette.text["--main-text"] = `rgb(${rgbValues.red + 99},${rgbValues.green + 99},${rgbValues.blue + 99})` 
        storedPalette.text["--main-text-dark1"] = `rgb(${rgbValues.red + 74},${rgbValues.green + 74},${rgbValues.blue + 74})` 
        storedPalette.text["--main-text-dark2"] = `rgb(${rgbValues.red + 17},${rgbValues.green + 16},${rgbValues.blue + 16})`
        storedPalette.text["--main-text-dark3"] = `rgb(${rgbValues.red + 13},${rgbValues.green + 13},${rgbValues.blue + 13})`
        storedPalette.text["--main-text-dark4"] = `rgb(${rgbValues.red},${rgbValues.green},${rgbValues.blue})`

        body.setProperty(`${palette.text[0]}`,`rgb(${rgbValues.red + 99},${rgbValues.green + 99},${rgbValues.blue + 99})`);
        body.setProperty(`${palette.text[1]}`,`rgb(${rgbValues.red + 74},${rgbValues.green + 74},${rgbValues.blue + 74})`);
        body.setProperty(`${palette.text[2]}`,`rgb(${rgbValues.red + 17},${rgbValues.green + 16},${rgbValues.blue + 16})`);
        body.setProperty(`${palette.text[3]}`,`rgb(${rgbValues.red + 13},${rgbValues.green + 13},${rgbValues.blue + 13})`);
        body.setProperty(`${palette.text[5]}`,`rgb(${rgbValues.red},${rgbValues.green},${rgbValues.blue})`);});

    $("#background") //!========BACKGROUND========
      .colorpicker({})
      .on("colorpickerChange", function (e) {
        
        rgbToObj(e.color.toString());

        storedPalette.background["--main-bg-darkest"] = `rgb(${rgbValues.red - 17},${rgbValues.green - 17},${rgbValues.blue - 17})`
        storedPalette.background["--main-bg-darker"] = `rgb(${rgbValues.red - 10},${rgbValues.green - 10},${rgbValues.blue - 14})` 
        storedPalette.background["--main-bg-dark"] = `rgb(${rgbValues.red - 0},${rgbValues.green - 1},${rgbValues.blue - 2})`
        storedPalette.background["--main-bg"] = `rgb(${rgbValues.red},${rgbValues.green},${rgbValues.blue})`
        storedPalette.background["--main-bg-light"] = `rgb(${rgbValues.red + 8},${rgbValues.green + 8},${rgbValues.blue + 8})`
        storedPalette.background["--main-bg-lighter"] = `rgb(${rgbValues.red + 14},${rgbValues.green + 14},${rgbValues.blue + 17})`
        storedPalette.background["--main-bg-lightest"] = `rgb(${rgbValues.red + 30},${rgbValues.green + 32},${rgbValues.blue + 36})`

        body.setProperty(`${palette.background[0]}`,`rgb(${rgbValues.red - 17},${rgbValues.green - 17},${rgbValues.blue - 17})`);
        body.setProperty(`${palette.background[1]}`,`rgb(${rgbValues.red - 10},${rgbValues.green - 10},${rgbValues.blue - 14})`);
        body.setProperty(`${palette.background[2]}`,`rgb(${rgbValues.red - 0},${rgbValues.green - 1},${rgbValues.blue - 2})`);
        body.setProperty(`${palette.background[3]}`,`rgb(${rgbValues.red},${rgbValues.green},${rgbValues.blue})`);
        body.setProperty(`${palette.background[4]}`,`rgb(${rgbValues.red + 8},${rgbValues.green + 8},${rgbValues.blue + 8})`);
        body.setProperty(`${palette.background[5]}`,`rgb(${rgbValues.red + 14},${rgbValues.green + 14},${rgbValues.blue + 17})`);
        body.setProperty(`${palette.background[6]}`,`rgb(${rgbValues.red + 30},${rgbValues.green + 32},${rgbValues.blue + 36})`);
      });
  });
});

//TODO============================================================================
//? - how can random values be simplified instead of hardcoding????
//? - load all the styles into the object of the curently selected theme
//? - create a better sample theme for user to messaround? needs a design from UI/UX









//!=========================================GRAVEYARD - for now at least===================================================
// https://stackoverflow.com/questions/55935261/how-to-make-a-smooth-transition-between-pages-that-have-a-dark-light-mode

// https://stackoverflow.com/questions/1720320/how-to-dynamically-create-css-class-in-javascript-and-apply

// var root = document.querySelector(':root');
// var rootStyle = getComputedStyle(root);
// var red = rootStyle.getPropertyValue('--primary-dark');
// root.style.setProperty('--primary-dark', 'red');

// console.log(document.styleSheets[4].rules) //! check styleSheets
// document.documentElement.setAttribute('data-theme', theme); //? probably better to simply change the class of the body

//! TO GET ALL THE VARIABLES OF SELECTED CLASS
// Array.from(document.styleSheets)
//   .filter(
//     sheet =>
//       sheet.href === null || sheet.href.startsWith(window.location.origin)
//   )
//   .reduce(
//     (acc, sheet) =>
//       (acc = [
//         ...acc,
//         ...Array.from(sheet.cssRules).reduce(
//           (def, rule) =>
//             (def =
//               rule.selectorText === ".custom"
//                 ? [
//                     ...def,
//                     ...Array.from(rule.style).filter(name =>
//                       name.startsWith("--")
//                     )
//                   ]
//                 : def),
//           []
//         )
//       ]),
//     []
//   );

//! DARK THEME PALETTE OBEJCT WITH VALUES (as CSS)
// const paletteObj = {
//   primary: {
//     "--primary-dark": "rgb(229, 151, 29)",
//     "--primary-medium": "rgb(244, 169, 51)",
//     "--primary-light": "rgb(253, 194, 102)",
//   },
//   background: {
//     "--main-bg-darkest": "rgb(20, 20, 20)",
//     "--main-bg-darker": "rgb(27, 28, 29)",
//     "--main-bg-dark": "rgb(37, 37, 41)",
//     "--main-bg": "rgb(37, 38, 43)",
//     "--main-bg-light": "rgb(45, 46, 52)",
//     "--main-bg-lighter": "rgb(51, 52, 60)",
//     "--main-bg-lightest": "rgb(67, 70, 79)",
//   },
//   text: {
//     "--main-text": "rgb(252, 252, 252)",
//     "--main-text-dark1": "rgb(227, 227, 227)",
//     "--main-text-dark2": "rgb(170, 169, 169)",
//     "--main-text-dark3": "rgb(166, 166, 168)",
//     "--main-text-dark4": "rgb(153, 153, 153)",
//   },
// };

// `rgb(${rgbValues.red - 15},${rgbValues.green - 18},${rgbValues.blue - 22})`
// `rgb(${rgbValues.red},${rgbValues.green},${rgbValues.blue})`
// `rgb(${rgbValues.red + 9},${rgbValues.green + 25},${rgbValues.blue + 51})`

// `rgb(${rgbValues.red + 99},${rgbValues.green + 99},${rgbValues.blue + 99})`
// `rgb(${rgbValues.red + 74},${rgbValues.green + 74},${rgbValues.blue + 74})`
// `rgb(${rgbValues.red + 17},${rgbValues.green + 16},${rgbValues.blue + 16})`
// `rgb(${rgbValues.red + 13},${rgbValues.green + 13},${rgbValues.blue + 13})`
// `rgb(${rgbValues.red},${rgbValues.green},${rgbValues.blue})`

// `rgb(${rgbValues.red - 17},${rgbValues.green - 17},${rgbValues.blue - 17})`
// `rgb(${rgbValues.red - 10},${rgbValues.green - 10},${rgbValues.blue - 14})`
// `rgb(${rgbValues.red - 0},${rgbValues.green - 1},${rgbValues.blue - 2})`
// `rgb(${rgbValues.red},${rgbValues.green},${rgbValues.blue})`
// `rgb(${rgbValues.red + 8},${rgbValues.green + 8},${rgbValues.blue + 8})`
// `rgb(${rgbValues.red + 14},${rgbValues.green + 14},${rgbValues.blue + 17})`
// `rgb(${rgbValues.red + 30},${rgbValues.green + 32},${rgbValues.blue + 36})`


// function parseCSSText(cssText) {
//   var cssTxt = cssText.replace(/\/\*(.|\s)*?\*\//g, " ").replace(/\s+/g, " ");
//   var style = {},
//     [, ruleName, rule] = cssTxt.match(/ ?(.*?) ?{([^}]*)}/) || [, , cssTxt];
//   var cssToJs = (s) =>
//     s.replace(/\W+\w/g, (match) => match.slice(-1).toUpperCase());
//   var properties = rule
//     .split(";")
//     .map((o) => o.split(":").map((x) => x && x.trim()));
//   for (var [property, value] of properties) style[cssToJs(property)] = value;
//   return { cssText, ruleName, style };
// }

// console.log(parseCSSText(document.querySelector(".custom").style.cssText))

// var css = {};


// console.log($('body').get(0).style)
// console.log($('.custom').prop())
// $('body').css("backgroundColor");
// const declaration = document.styleSheets[4].cssRules[1].style;
// const propvalue = declaration.getPropertyValue("--main-bg");