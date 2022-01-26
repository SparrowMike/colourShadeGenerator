const generate = document.getElementById('generate')
const currentColours = document.getElementById('currentColours')
const mainPanel = document.getElementById('mainPanel')
const storePanel = document.getElementById('storePanel')

const repeat = document.getElementById('repeat')

const redIncrease = document.getElementById('redIncrease')
const greenIncrease = document.getElementById('greenIncrease')
const blueIncrease = document.getElementById('blueIncrease')

// const RGB = document.getElementById('RGB')

const red = document.getElementById('red');
const green = document.getElementById('green');
const blue = document.getElementById('blue');

let hex 

const rgbToObj = rgb => {
  const colors = ["red", "green", "blue", "alpha"]
  let colorArr = rgb.slice(
      rgb.indexOf("(") + 1, 
      rgb.indexOf(")")
  ).split(", ");
  let obj = new Object();
  colorArr.forEach((k, i) => {
      obj[colors[i]] = k
  })
  return obj;
}

const rgbToHex = (r, g, b) => {
  hex = "#" + ((1 << 24) + (Number(r) << 16) + (Number(g) << 8) + Number(b)).toString(16).slice(1);
  return
}

const reset = () => {
  red.value = 0, green.value = 0, blue.value = 0;
  while(currentColours.firstChild || storePanel.firstChild) {
    currentColours.innerHTML = ""  
    storePanel.innerHTML = ""  
  }
}

const store = () => {
  if (!currentColours.innerHTML.trim().length == 0) {
    const newContainer = document.createElement('div') 
    newContainer.classList.add('storedColours')
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
  let i = 0
  if (repeat.value < 1) {
    iziToast.error({
      title: 'Pick a number of the repeats',
    });  
  }

  while(i < repeat.value * 1) {
    red.value = Number(red.value) + (Number(blueIncrease.value))
    green.value = Number(green.value) + (Number(greenIncrease.value))
    blue.value = Number(blue.value) + (Number(blueIncrease.value))
      
    if (blue.value > 255 || green.value > 255 ||red.value > 255) {
      iziToast.error({
      title: 'Going beyond the limits',
      message: 'Values must stay below 255'
      });
    break
    }
    
    rgbToHex(red.value, green.value, blue.value)
    const rgb = `rgb(${red.value}, ${green.value}, ${blue.value})`

    const colourCard = document.createElement('div'); 
    colourCard.classList.add('colourCard')
    currentColours.appendChild(colourCard); 
    colourCard.style.background = rgb
    colourCard.insertAdjacentHTML('beforeend', `<div class='colourCode'><h4>${rgb}</h4><h4>${hex}</h4></div>`);
    i++
  }
});

// TODO
// - convert input to RGB object