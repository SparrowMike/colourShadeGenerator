const generate = document.getElementById('generate')
const container = document.getElementById('currentColours')
const mainPanel = document.getElementById('mainPanel')
const storePanel = document.getElementById('storePanel')

const repeat = document.getElementById('repeat')

let red = document.getElementById('red');
let green = document.getElementById('green');
let blue = document.getElementById('blue');

let hex 

function rgbToHex(r, g, b) {
  hex = "#" + ((1 << 24) + (Number(r) << 16) + (Number(g) << 8) + Number(b)).toString(16).slice(1);
  return
}

const store = () => {
  if(!currentColours.childNodes.length === 0) {
    storePanel.innerHTML += mainPanel.innerHTML;
  }
}

const clearPalette = () => {
  red.value = 0, green.value = 0, blue.value = 0;
  while(currentColours.firstChild) {
    currentColours.removeChild(currentColours.firstChild);
  }
}

generate.addEventListener('click', function() {
  console.log(repeat)
  let i = 0
  while(i < repeat.value * 1) {
    red.value = Number(red.value) + 8
    green.value = Number(green.value) + 19
    blue.value = Number(blue.value) + 14
      
    if (blue.value > 255) {
      iziToast.error({
      title: 'Going beyond the limits',
      message: 'Values must stay below 255'
      });
    clearPalette()
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

