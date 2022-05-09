import "./style.scss";
import keysData from "./keysData.json";

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


const lineBreakLayout = ["Backspace", "Backslash", "Enter", "ArrowUp", "ArrowRight"];

class Keyboard {

  elements = {
    keyboardContainer: null,
    keysContainer: null,
    keys: [],
    targetTextArea: null,
  };

    eventHandlers = {
        oninput: null,
        onclose: null
    };

    properties = {
        textAreaValue: "",
        language: "ru",
        capsLock: false,
        shift: false,
        ctrl: false,
        alt: false,
    };

    data = {
      keysDataArr: [],
      lineBreakArr: [],
    }



  constructor (containerId, textareaSelector, keysData, lineBreakKeyCodes) {
    this.data.keysDataArr = keysData;
    this.data.lineBreakArr = lineBreakKeyCodes;

    //Create elements
    this.elements.keyboardContainer = document.createElement("div"); 
    this.elements.keysContainer = document.createElement("div"); 
    const createdKeys = this.createKeys(this.data.keysDataArr, this.data.lineBreakArr);

    // Setup main elements
    this.elements.keyboardContainer.classList.add("keyboard");
    this.elements.keyboardContainer.id = containerId;
    this.elements.keysContainer.classList.add("keyboard__keys", "keys-container");
    this.elements.targetTextArea = document.querySelector(textareaSelector);

    // this.elements.keys = this.elements.keysContainer.querySelectorAll(".keys-container_key");

    // Add to DOM
    this.elements.keyboardContainer.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.keyboardContainer);
    this.elements.keysContainer.appendChild(createdKeys);
  }

  createKeys (keysDataArr, lineBreakArr) {
    const fragment = document.createDocumentFragment();

    keysDataArr.forEach(keyObj => {
      const keyElement = document.createElement("button");
      const insertLineBreak = lineBreakArr.indexOf(keyObj.code) !== -1;
      
      // Add attributes/classes
      keyElement.setAttribute("data-code", keyObj.code);
      keyElement.classList.add("keyboard__key", "key", `key_${keyObj.size}`);

      this.setTextContentForKey(keyElement);
      this.setListenerForKey(keyElement);

      // if (insertLineBreak) {
      //   keyElement.style.clear = "right";
      // }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
          fragment.appendChild(document.createElement("br"));
      }
    });

    return fragment;
  }

  setTextContentForKey (keyElement) {
    const keyData = this.getKeyData(keyElement);
    const lang = this.properties.language;
    const isCapsLock = this.properties.capsLock;
    const isShift = this.properties.shift;

    let result = "";

    if (isCapsLock && isShift) {
      result = keyData[lang + "ShiftKey"].toLowerCase();
    } else if (isCapsLock) {
      result = keyData[lang + "Key"].toUpperCase();
    } else if (isShift) {
      result = keyData[lang + "ShiftKey"];
    } else {
      result = keyData[lang + "Key"];
    }

    keyElement.textContent = result;

    // switch (language) {

    //   case "ru":
    //     if (isCapsLock && isShift) {
    //       result = keyData.ruShiftKey.toLowerCase();
    //     } else if (isCapsLock) {
    //       result = keyData.ruKey.toUpperCase();
    //     } else if (isShift) {
    //       result = keyData.ruShiftKey;
    //     } else {
    //       result = keyData.ruKey;
    //     }
    //     break;

    //     case "eng":
    //       if (isCapsLock && isShift) {
    //         result = keyData.engShiftKey.toLowerCase();
    //       } else if (isCapsLock) {
    //         result = keyData.engKey.toUpperCase();
    //       } else if (isShift) {
    //         result = keyData.engShiftKey;
    //       } else {
    //         result = keyData.engKey;
    //       }
    //       break;
    // }
  }

  setListenerForKey (keyElement) { 
    const keyData = this.getKeyData(keyElement);

    return;
  }

  getKeyData (keyElement) {
    const keyCode = keyElement.getAttribute("data-code");
    if (!keyCode) return null;

    const keyData = this.data.keysDataArr.find(keyObj => keyObj.code === keyCode);

    return keyData;
  }
}


const RssKeyboard = new Keyboard("keyboard", "#textarea", keysData, lineBreakLayout);