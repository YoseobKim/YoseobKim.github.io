let timeoutId = 0;

function dialogCloseBtnHidden() {
  let box = document.getElementById("dialog-btn");
  box.style.display = "none";
}

function dialogCloseBtnShow() {
  let box = document.getElementById("dialog-btn");
  box.style.display = "";
}

function dialogClicked() {
  displayHidden();
}

function displayHidden() {
  let typingOutput = document.getElementById("dialog-text");
  typingOutput.textContent = "";

  let box = document.getElementById("dialog");
  box.style.display = "none";

  clearTimeout(timeoutId)
}

function displayTypingEffect(title, text, speed) {
  let box = document.getElementById("dialog");
  let titleBox = document.getElementById("character-name");
  titleBox.textContent = title;
  let typingOutput = document.getElementById("dialog-text");
  box.style.display = "";
  typingOutput.textContent = "";
  dialogCloseBtnHidden();
  let index = 0;
  function type() {
    if (index < text.length) {
      typingOutput.textContent += text[index];
      index++;
      timeoutId = setTimeout(type, speed);
    } else {
      dialogCloseBtnShow();
    }
  }
  type();
}

const game_dialog = {
  displayTypingEffect: displayTypingEffect,
  displayHidden: displayHidden
}
