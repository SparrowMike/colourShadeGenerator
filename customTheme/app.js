var app = angular.module("myApp", []);

app.controller("theme", function ($scope) {
  const body = $("body").get(0).style //? FOR COLOURPICKER

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
  primary: {},
  background: {},
  text: {},
  };

  //? LOAD THE THEME ON START
  const theme = localStorage.getItem("theme");
  if (theme) $("body").removeClass("light dark custom").addClass(theme);

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
        $("body").removeClass("light dark").addClass("custom");
        break;
    }
  };

  let obj = {}; //! obj - will hold the RGB destructured values (from "rgb(171, 140, 113)" to {red: 171, green: 140, blue: 113})

  function rgbToObj(rgb) {
    let colors = ["red", "green", "blue", "alpha"];
    let colorArr = rgb
      .slice(rgb.indexOf("(") + 1, rgb.indexOf(")"))
      .split(/, | ,|,/);
    colorArr.forEach((k, i) => {
      obj[colors[i]] = Number(k);
    });
    return obj;
  }

  //! CUSTOM COLOUR PICKER 
  $(function () {
    $("#primary") //!========PRIMARY========
      .colorpicker({})
      .on("colorpickerChange", function (e) {
        new_color = e.color.toString();
        rgbToObj(new_color);
        body.setProperty(
            `${palette.primary[0]}`,
            `rgb(${obj.red - 15},${obj.green - 18},${obj.blue - 22})`
          );
        body.setProperty(
            `${palette.primary[1]}`,
            `rgb(${obj.red},${obj.green},${obj.blue})`
          );
        body.setProperty(
            `${palette.primary[2]}`,
            `rgb(${obj.red + 9},${obj.green + 25},${obj.blue + 51})`
          );
      });

    $("#text") //!========TEXT========
      .colorpicker({})
      .on("colorpickerChange", function (e) {
        new_color = e.color.toString();
        rgbToObj(new_color);
        body.setProperty(
            `${palette.text[0]}`,
            `rgb(${obj.red + 99},${obj.green + 99},${obj.blue + 99})`
          );
        body.setProperty(
            `${palette.text[1]}`,
            `rgb(${obj.red + 74},${obj.green + 74},${obj.blue + 74})`
          );
        body.setProperty(
            `${palette.text[2]}`,
            `rgb(${obj.red + 17},${obj.green + 16},${obj.blue + 16})`
          );
        body.setProperty(
            `${palette.text[3]}`,
            `rgb(${obj.red + 13},${obj.green + 13},${obj.blue + 13})`
          );
        body.setProperty(
            `${palette.text[5]}`,
            `rgb(${obj.red},${obj.green},${obj.blue})`
          );
      });

    $("#background") //!========BACKGROUND========
      .colorpicker({})
      .on("colorpickerChange", function (e) {
        new_color = e.color.toString();
        rgbToObj(new_color);
        body.setProperty(
            `${palette.background[0]}`,
            `rgb(${obj.red - 17},${obj.green - 17},${obj.blue - 17})`
          );
        body.setProperty(
            `${palette.background[1]}`,
            `rgb(${obj.red - 10},${obj.green - 10},${obj.blue - 14})`
          );
        body.setProperty(
            `${palette.background[2]}`,
            `rgb(${obj.red - 0},${obj.green - 1},${obj.blue - 2})`
          );
        body.setProperty(
            `${palette.background[3]}`,
            `rgb(${obj.red},${obj.green},${obj.blue})`
          );
        body.setProperty(
            `${palette.background[4]}`,
            `rgb(${obj.red + 8},${obj.green + 8},${obj.blue + 8})`
          );
        body.setProperty(
            `${palette.background[5]}`,
            `rgb(${obj.red + 14},${obj.green + 14},${obj.blue + 17})`
          );
        body.setProperty(
            `${palette.background[6]}`,
            `rgb(${obj.red + 30},${obj.green + 32},${obj.blue + 36})`
          );
      });
  });
});



//TODO============================================================================
//! - store the custom theme in a object - local storage (for now)
//! - render custom theme object
//? - how can random values be simplified instead of hardcoding 
//? - create a better sample them for user to messaround? needs a design from UI/UX


















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