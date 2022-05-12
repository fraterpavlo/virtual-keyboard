import './style.scss';
import keysData from './keysData.json';
import Keyboard from './assets/modules/classKeyboard';
import TextArea from './assets/modules/classTextarea';

// function startCreateArr() {
//   let input = document.querySelector("#kinput");

//   input.onkeydown = handle;

//   console.log(EngKeysData);
// }

// function handle (e) {
//   e.preventDefault();
//   if (e.repeat) return;
//   let data = {
//     code: e.code,
//     ruShiftKey: e.key,
//     size: "s",
//     Shift: e.shiftKey,
//     ctrlKey: e.ctrlKey,
//     altKey: e.altKey
//   }

//   RuKeysData.push(data);
//   console.log(RuKeysData);
// }

// window.addEventListener("DOMContentLoaded", startCreateArr);

const lineBreakLayout = [
  'Backspace',
  'Backslash',
  'Enter',
  'ShiftRight',
  'ControlRight',
];

const textArea = new TextArea('textarea', 5, 50);

const RssKeyboard = new Keyboard(
  'keyboard',
  'textarea',
  keysData,
  lineBreakLayout,
);

const taskName = document.createElement('h1');
taskName.textContent = 'Virtual-keyboard';

const createdInWindows = document.createElement('p');
createdInWindows.textContent = 'Клавиатура создана в операционной системе Windows';

const changeLanguageShortCut = document.createElement('p');
changeLanguageShortCut.textContent = 'Для переключения языка комбинация: левыe ctrl + alt. Двойной клик оставляет кнопки Shift Alt Ctrl активными';

document.body.appendChild(taskName);
document.body.appendChild(createdInWindows);
document.body.appendChild(changeLanguageShortCut);
