// Step 1. Wobble
// Step 2. Stop
// Step 3. Open
// Step 4. Animate

function main() {

let gift = document.querySelector('.gift');
let giftCover = document.querySelector('.gift__cover');
let giftContainer = document.querySelector('.gift__container');
let card = document.querySelector('.card');

let addGiftWobble = () => {
  gift.classList.add('animate__wobble');
  giftCover.classList.add('animate__wobble');
}

let removeGiftWobble = () => {
  gift.classList.remove('animate__wobble');
  giftCover.classList.remove('animate__wobble');
}

let addGiftOpen = () => {
  giftCover.classList.add('animate__open');
  giftContainer.classList.add('animate__open');
}

let addCardZoomIn = () => {
  card.classList.add('animate');
}

let card_inside = document.getElementById("card");
let colors = ["#e475f0", "#f075aa", "#f09275", "#f0e475",
  "#aaf075", "#7592f0", "#aa75f0"];
let color_index = 0;
let color_forward = true;

let card_message = "Will you Merry Me?";
let card_sign = document.getElementById("sign");

let i = 0;
for (let i = 0; i < card_message.length; i++) {
  let span = document.createElement("span");
  span.innerText = card_message[i];
  if (card_message[i] != " ") {
    span.style.color = colors[color_index];
    if (color_forward) color_index++;
    else color_index--;
    if (color_index == colors.length - 1) color_forward = false;
    else if (color_index == 0) color_forward = true;
  }
  card_inside.appendChild(span);
}

gift.onclick = () => {
  // Wobble
  addGiftWobble();
  
  setTimeout(() => {
    
    removeGiftWobble()
    // Open
    addGiftOpen();
    addCardZoomIn();
    
  }, 1500);
}

let heart_button = document.querySelector('.heart');

heart_button.onclick = function() {
  heart_button.classList.toggle('active');
  setTimeout(function() {
    window.location.href = "/albums.html";
  }, 1000); 
};

}
