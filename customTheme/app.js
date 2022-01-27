var app = angular.module('myApp', []);


// https://stackoverflow.com/questions/1720320/how-to-dynamically-create-css-class-in-javascript-and-apply

app.controller('theme', function($scope){

  var root = document.querySelector(':root');
  var rootStyle = getComputedStyle(root);
  var red = rootStyle.getPropertyValue('--primary-dark');
  root.style.setProperty('--primary-dark', 'red');

  $scope.changeTheme = (theme) => {
    // console.log(document.styleSheets[4].rules) //! check styleSheets
    // $('document').css('data-theme', theme)
    // document.documentElement.setAttribute('data-theme', theme);
    // document.body.classList.toggle('dark', 'light')

    switch(theme) {
      case 'light':
        document.body.classList.remove('dark')
        document.body.classList.remove('custom')
        document.body.classList.add('light')
        break;
      case 'dark':
        document.body.classList.remove('light')
        document.body.classList.remove('custom')
        document.body.classList.add('dark')
        break;
      case 'custom':
        document.body.classList.remove('dark')
        document.body.classList.remove('light')
        document.body.classList.add('custom')
        break;
      default:
        // code block
    }
  }

  let pickedColour

  const primaryColours = ['--primary-dark', '--primary-medium', '--primary-light'] //* DONE

  const textColours = ['--text-common-one', '--text-common-two', '--text-common-two']

  const backgroundColours = ['--background-variant-one', '--background-variant-two', '--background-variant-three', '--background-variant-four']


  //? to iterate over for new values 
  let coloursArr = []
  let obj = {} 

  const size = Object.keys(primaryColours).length;

  function rgbToObj(rgb) {
    let colors = ["red", "green", "blue", "alpha"]
    let colorArr = rgb.slice(
        rgb.indexOf("(") + 1, 
        rgb.indexOf(")")
    ).split(/, | ,|,/);

    colorArr.forEach((k, i) => {
        obj[colors[i]] = Number(k)
    })
    return obj;
  }

  $scope.customTheme = () => {
    // const root = document.querySelector(':root')

    // $(':root').css(primaryColours[1], 'pink')
    
    // document.documentElement.style.setProperty(primaryColours[1], 'red');
    // console.log(document.documentElement.style.getPropertyValue(primaryColours[1]))

    // $("body").get(0).style.setProperty(primaryColours[1],'#f3f');


    rgbToObj(pickedColour)
    coloursArr = []

    let i = 0
    while (i < size) {
      obj = {'red': obj.red + 28, 'green': obj.green + 38, 'blue': obj.blue + 48}
      const rgb = `rgb(${obj.red}, ${obj.green}, ${obj.blue})`
      coloursArr.push(rgb) 
      i++
    }

    primaryColours.map((obj, index) => {
      // root.style.setProperty(obj, 'rgb(141, 115, 112)')
      $("body").get(0).style.setProperty(`${obj}`, coloursArr[index]) 
      // console.log(obj, coloursArr[index])
      // $(':root').css(obj, object[obj])
      // $(document).css(obj, object[obj])

    })
  }

  $(function () {
    $('#primary')
    .colorpicker({})
    .on('colorpickerChange', function (e) {
        new_color = e.color.toString()
        // $('#picker').css('background-color', new_color)
        // pickedColour = $('#color').val()
        rgbToObj(new_color)
        $("body").get(0).style.setProperty(`${primaryColours[0]}`, `rgb(${obj.red - 15},${obj.green - 18},${obj.blue - 22})`)
        $("body").get(0).style.setProperty(`${primaryColours[1]}`, `rgb(${obj.red},${obj.green},${obj.blue})`)
        $("body").get(0).style.setProperty(`${primaryColours[2]}`, `rgb(${obj.red + 9},${obj.green + 25},${obj.blue + 51})`)
    })     

    $('#text')
    .colorpicker({})
    .on('colorpickerChange', function (e) {
        new_color = e.color.toString()
        rgbToObj(new_color)
        $("body").get(0).style.setProperty(`${textColours[0]}`, `rgb(${obj.red},${obj.green},${obj.blue})`)
        $("body").get(0).style.setProperty(`${textColours[1]}`, `rgb(${obj.red + 16},${obj.green + 16},${obj.blue + 16})`)
        $("body").get(0).style.setProperty(`${textColours[2]}`, `rgb(${obj.red + 38},${obj.green + 36},${obj.blue + 36})`)
    })     

    $('#background')
    .colorpicker({})
    .on('colorpickerChange', function (e) {
        new_color = e.color.toString()
        rgbToObj(new_color)
        $("body").get(0).style.setProperty(`${backgroundColours[0]}`, `rgb(${obj.red},${obj.green},${obj.blue})`)
        $("body").get(0).style.setProperty(`${backgroundColours[1]}`, `rgb(${obj.red + 16},${obj.green + 16},${obj.blue + 16})`)
        $("body").get(0).style.setProperty(`${backgroundColours[2]}`, `rgb(${obj.red + 38},${obj.green + 36},${obj.blue + 36})`)
        $("body").get(0).style.setProperty(`${backgroundColours[3]}`, `rgb(${obj.red + 38},${obj.green + 36},${obj.blue + 36})`)
    })     
  });
})