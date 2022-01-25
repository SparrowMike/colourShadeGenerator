const generate = document.getElementById('generate')
const container = document.getElementById('currentColours')
const mainPanel = document.getElementById('mainPanel')
const storePanel = document.getElementById('storePanel')

const repeat = document.getElementById('repeat')

const redIncrease = document.getElementById('redIncrease')
const greenIncrease = document.getElementById('greenIncrease')
const blueIncrease = document.getElementById('blueIncrease')

const red = document.getElementById('red');
const green = document.getElementById('green');
const blue = document.getElementById('blue');

let hex 

function rgbToHex(r, g, b) {
  hex = "#" + ((1 << 24) + (Number(r) << 16) + (Number(g) << 8) + Number(b)).toString(16).slice(1);
  return
}

const clearPalette = () => {
  red.value = 0, green.value = 0, blue.value = 0;
  while(currentColours.firstChild) {
    currentColours.removeChild(currentColours.firstChild);
  }
}

const store = () => {
  storePanel.innerHTML += mainPanel.innerHTML;
  clearPalette()
  // if(!currentColours.childNodes.length === 0) {
  // }
}

generate.addEventListener('click', function() {
  let i = 0

  if (repeat.value < 1) {
    iziToast.error({
      title: 'Pick number or repeats',
    });  
  }

  while(i < repeat.value * 1) {
    red.value = Number(red.value) + (Number(blueIncrease.value) || 8)
    green.value = Number(green.value) + (Number(greenIncrease.value) || 8)
    blue.value = Number(blue.value) + (Number(blueIncrease.value) || 8)
      
    if (blue.value > 255 || green.value > 255 ||red.value > 255) {
      iziToast.error({
      title: 'Going beyond the limits',
      message: 'Values must stay below 255'
      });
    // clearPalette()
    break
    }
    
    rgbToHex(red.value, green.value, blue.value)
    let currentColour = `rgb(${red.value}, ${green.value}, ${blue.value})`
    let colour = document.createElement("div"); 
    
    colour.classList.add('colour')
    colour.style.background = currentColour
    colour.innerHTML = currentColour
    // colour.innerHTML = hex
    container.appendChild(colour); 
    i++
  }
});

