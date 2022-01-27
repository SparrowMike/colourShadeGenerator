const generate = document.getElementById('generate');
const currentColours = document.getElementById('currentColours');
const mainPanel = document.getElementById('mainPanel');
const storePanel = document.getElementById('storePanel');

const RGB = document.getElementById('RGB');
const PICKER = document.getElementById('PICKER') 

const repeat = document.getElementById('repeat');

const redIncrease = document.getElementById('redIncrease');
const greenIncrease = document.getElementById('greenIncrease');
const blueIncrease = document.getElementById('blueIncrease');

let rgbObject = new Object()

if (storePanel.innerHTML.trim().length == 0) {
  storePanel.style.visibility = 'hidden'
}

PICKER.addEventListener("input", function() {
  const color = this.value
  const r = parseInt(color.substr(1,2), 16)
  const g = parseInt(color.substr(3,2), 16)
  const b = parseInt(color.substr(5,2), 16)
  RGB.setAttribute('value', `rgb(${r}, ${g}, ${b})`)
})

function rgbToObj(rgb) {
  let colors = ["red", "green", "blue", "alpha"]
  let colorArr = rgb.slice(
      rgb.indexOf("(") + 1, 
      rgb.indexOf(")")
  ).split(/, | ,|,/);

  colorArr.forEach((k, i) => {
    rgbObject[colors[i]] = Number(k)
  })
  return rgbObject;
}

const rgbToHex = (obj) => {
  const hex = "#" + ((1 << 24) + (obj.red << 16) + (obj.green << 8) + obj.blue).toString(16).slice(1);
  return hex
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
  
  if (repeat.value < 1) {
    iziToast.error({
      title: 'Pick a number of the repeats',
    });  
  }

  rgbToObj(RGB.value)
  
  let i = 0
  while(i < repeat.value * 1) {
    rgbObject = {'red': rgbObject.red + Number(redIncrease.value), 'green': rgbObject.green + Number(greenIncrease.value), 'blue': rgbObject.blue + Number(blueIncrease.value)}
   
    for (o in rgbObject) if (rgbObject[o] >= 255) rgbObject[o] = 255
    
    const rgb = `rgb(${rgbObject.red}, ${rgbObject.green}, ${rgbObject.blue})`
    
    const colourCard = document.createElement('div'); 
    colourCard.classList.add('colourCard')
    currentColours.appendChild(colourCard); 
    colourCard.style.background = rgb
    colourCard.insertAdjacentHTML('beforeend', `<div class='colourCode'><h4>${rgb}</h4><h4>${rgbToHex(rgbObject)}</h4></div>`);
    i++
  }
});

// TODO 
// - generate from 0 (line 90)
// - hexToRgb probably not needed ?