var app = angular.module("myApp", []);

app.controller("theme", function ($scope) {
  const body = $("body").get(0).style; //? FOR THE COLOURPICKER

  //? LOAD THE THEME ON START
  const theme = localStorage.getItem("theme");
  if (theme) $("body").removeClass("light dark custom").addClass(theme);

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

  //?===================SAVE/LOAD=====================
  $scope.saveValues = () => {
    localStorage.setItem("customTheme", JSON.stringify(storedPalette));
  };

  //?=====Load values will load last stored custom theme, bypassing css
  $scope.loadValues = function () {
    const data = JSON.parse(localStorage.getItem("customTheme"));
    for (d in data) {
      for (i in data[d]) {
        body.setProperty(`${i}`, `${data[d][i]}`);
      }
    }
  };
  if (theme === "custom") {
    $scope.loadValues();
  }

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
        if (theme === "custom") $scope.loadValues();
        $("body").removeClass("light dark").addClass("custom");
        break;
    }
  };

  //!================================================================================================================
  //? Split the string of styles collected from DOM - turn it to a object and feed it back to the picker
  function cssSplit(str) {
    // console.log(str)
    let obj = {},
      // S = str.match(/([^:;]+)/g) ||  [];
      S = str.match(/([\w-]*)\s*:\s*([^;]*)/g) || [];
    while (S.length) {
      obj[S.shift()] = S.shift() || "";
    }

    for (o in obj) body.setProperty(`${o}`, `${obj[o]}`);

    return obj;
  }

  //! https://www.generacodice.com/en/articolo/1775775/javascript-convert-css-style-string-into-js-object

  cssSplit(
    "--primary-dark: rgb(229, 151, 29); --primary-medium: rgb(244, 169, 51); --primary-light: rgb(253, 194, 102); --main-bg-darkest: rgb(20, 20, 20); --main-bg-darker: rgb(27, 28, 29); --main-bg-dark: rgb(37, 37, 41); --main-bg: rgb(37, 38, 43); --main-bg-light: rgb(45, 46, 52); --main-bg-lighter: rgb(51, 52, 60); --main-bg-lightest: rgb(67, 70, 79); --main-text: rgb(252, 252, 252); --main-text-dark1: rgb(227, 227, 227); --main-text-dark2: rgb(170, 169, 169); --main-text-dark3: rgb(166, 166, 168); --main-text-dark4: rgb(153, 153, 153);"
  );
  //!================================================================================================================

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
          for(a in rgbArr) {
            if (rgbArr[color] >= 255) rgbArr[color] = 255
            if (rgbArr[color] <= 0) rgbArr[color] = 0 
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
//? - load the slected styles into the object
//? - use simpler picker?

//? - ng-repeat for themes

//? - create a better sample theme for user to messaround? needs a design from UI/UX
//? - most dominant color should always be the base?









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

//!============================================================================

//?=====SEARCH THE HTML HEAD TO FIND THE RIGHT CSS
const checkCurrentStyles = () => {
  const css = document.styleSheets;
  for (c in css) {
    if (typeof css[c].href === "string" && css[c].href.endsWith("styles.css")) {
      console.log(`styles.css found at position ${c} of all styleSheets`);
      console.log(css[c].cssRules[1].cssText);
    }
  }
};

// checkCurrentStyles()
