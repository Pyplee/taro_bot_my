const { Keyboard } = require('grammy');

// Функция для создания клавиатуры с кнопками и кнопкой "Назад"
function createKeyboard(buttons, withBackButton = false) {
  const keyboard = new Keyboard();
  const buttonCount = buttons.length;
  const buttonsPerColumn = Math.ceil(buttonCount / 2);

  for (let i = 0; i < buttonsPerColumn; i++) {
    const firstButtonIndex = i;
    const secondButtonIndex = i + buttonsPerColumn;

    keyboard.text(buttons[firstButtonIndex].name).resized();

    if (secondButtonIndex < buttonCount) {
      keyboard.text(buttons[secondButtonIndex].name).resized();
    }

    keyboard.row();
  }

  if (withBackButton) {
    keyboard.text('Главная менюшка ↩️');
  }
  return keyboard;
}

function createKeyboardWithoutRows(buttons, withBackButton = false) {
  const keyboard = new Keyboard();
  const buttonCount = buttons.length;

  for (let i = 0; i < buttonCount; i++) {
    keyboard.text(buttons[i].name).row();
  }

  if (withBackButton) {
    keyboard.text('Главная менюшка ↩️');
  }
  return keyboard;
}

module.exports = {
  createKeyboard,
  createKeyboardWithoutRows,
};
