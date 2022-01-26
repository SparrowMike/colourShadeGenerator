const generate = document.getElementById('generate');
const currentColours = document.getElementById('currentColours');
const mainPanel = document.getElementById('mainPanel');
const storePanel = document.getElementById('storePanel');

const RGB = document.getElementById('RGB');

const repeat = document.getElementById('repeat');

const redIncrease = document.getElementById('redIncrease');
const greenIncrease = document.getElementById('greenIncrease');
const blueIncrease = document.getElementById('blueIncrease');

let hex
let obj = new Object()

if (storePanel.innerHTML.trim().length == 0) {
  storePanel.style.visibility = 'hidden'
} 

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

const rgbToHex = (obj) => {
  hex = "#" + ((1 << 24) + (obj.red << 16) + (obj.green << 8) + obj.blue).toString(16).slice(1);
  return
}

const reset = () => {
  while(currentColours.firstChild || storePanel.firstChild) {
    currentColours.innerHTML = ""  
    storePanel.innerHTML = ""  
    storePanel.style.visibility = 'hidden'
  }
}

const store = () => {
  if (!currentColours.innerHTML.trim().length == 0) {
    const newContainer = document.createElement('div') 
    newContainer.classList.add('storedColours')
    storePanel.style.visibility = 'visible'
    storePanel.appendChild(newContainer)
    while (currentColours.childNodes.length > 0) {
      newContainer.appendChild(currentColours.childNodes[0]);
    }
  } else {
    iziToast.error({
      title: 'Generate a pallete first',
    });  
  }
}

generate.addEventListener('click', function() {
  currentColours.innerHTML = ""  
  if (RGB.value === "") {
    iziToast.error({
      title: 'Insert starting RGB colour',
    });  
    return
  }
  
  rgbToObj(RGB.value)
  
  if (repeat.value < 1) {
    iziToast.error({
      title: 'Pick a number of the repeats',
    });  
  }
  
  let i = 0
  while(i < repeat.value * 1) {
    obj = {'red': obj.red + Number(redIncrease.value), 'green': obj.green + Number(greenIncrease.value), 'blue': obj.blue + Number(blueIncrease.value)}
    
    // if (obj.blue > 255 || obj.green > 255 ||obj.red > 255) {
      //   iziToast.error({
        //   title: 'Going beyond the limits',
        //   message: 'Values must stay below 255'
        //   });
    // break
    // }
    
    rgbToHex(obj)
    const rgb = `rgb(${obj.red}, ${obj.green}, ${obj.blue})`
    
    const colourCard = document.createElement('div'); 
    colourCard.classList.add('colourCard')
    currentColours.appendChild(colourCard); 
    colourCard.style.background = rgb
    colourCard.insertAdjacentHTML('beforeend', `<div class='colourCode'><h4>${rgb}</h4><h4>${hex}</h4></div>`);
    i++
  }
});
