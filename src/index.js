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


const lineBreakLayout = ["Backspace", "Backslash", "Enter", "ShiftRight", "ControlRight"];

class Keyboard {

  elements = {
    keyboardContainer: null,
    keysContainer: null,
    keys: [],
    specialKeys: [],
    notSpecialKeys: [],
    targetTextArea: null,
  };

    eventHandlers = {
      onBackspaceHandler: this.onBackspaceListener.bind(this),
      onTabHandler: this.onTabListener.bind(this),
      onCapsLockHandler: this.onCapsLockListener.bind(this),
      onEnterHandler: this.onEnterListener.bind(this),
      onShiftHandler: this.onShiftListener.bind(this),
      onControlHandler: this.onControlListener.bind(this),
      onMetaLeftHandler: this.onMetaLeftListener.bind(this),
      onAltHandler: this.onAltListener.bind(this),
      onClickTextInputHandler: this.onClickTextInputListener.bind(this),
      onMousedownHandler: this.onMousedownListener.bind(this),
      // onHandler: this.onListener.bind(this),

    };

    functions = {
      setTextContentForKey: this.setTextContentForKey.bind(this),
    }

    properties = {
        // textAreaValue: "",
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



  constructor (containerId, textareaId, keysData, lineBreakKeyCodes) {
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
    this.elements.targetTextArea = document.getElementById(textareaId);

    // Setup properties
    // this.properties.textAreaValue = this.elements.targetTextArea.value;


    // Add to DOM
    this.elements.keyboardContainer.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.keyboardContainer);
    this.elements.keysContainer.appendChild(createdKeys);

    //Add keys in this
    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keys-container_key");
    this.elements.specialKeys = this.elements.keysContainer.querySelectorAll(".key_special");
    this.elements.notSpecialKeys = this.elements.keysContainer.querySelectorAll(".key_not-special");

    //Add physical keyboard event for window
  }

  // isSpecialKey (keyElement) {
  //   const keysData = this.data.keysDataArr; //--
  //   const keyCode = keyElement.getAttribute("data-code"); //--
  //   const keyDataObj = keysData.find(dataObj => dataObj.code === keyCode); //--
  //   const keyDataObj = getKeyDta(keyElement);
  //   const isSpecialKey = keyDataObj.isSpecial;

  //   return isSpecialKey;
  // }

  createKeys (keysDataArr, lineBreakArr) {
    const fragment = document.createDocumentFragment();

    keysDataArr.forEach(keyObj => {
      const keyElement = document.createElement("button");
      const insertLineBreak = lineBreakArr.indexOf(keyObj.code) !== -1;
      const isSpecialKey = keyObj.isSpecial;
      
      // Add attributes/classes
      keyElement.setAttribute("data-code", keyObj.code);
      keyElement.classList.add("keyboard__key", "key", `key_${keyObj.size}`);

      isSpecialKey
        ? keyElement.classList.add("key_special")
        : keyElement.classList.add("key_not-special")
      
      // Add texContent 
      this.setTextContentForKey(keyElement);
      // Add Listener 
      this.setListenerForKey(keyElement);

      //Add to DOM
      fragment.appendChild(keyElement);

      if (insertLineBreak) {
          const lineBreakElement = document.createElement("div");
          lineBreakElement.classList.add("line-break-item");
          fragment.appendChild(lineBreakElement);
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
    if (keyData.isSpecial) {
      switch(keyData.code) {

        case "Backspace":
          keyElement.addEventListener("click", this.eventHandlers.onBackspaceHandler);
        break;

        case "Tab":
          keyElement.addEventListener("click", this.eventHandlers.onTabHandler);
        break;

        case "CapsLock":
          keyElement.addEventListener("click", this.eventHandlers.onCapsLockHandler);
        break;

        case "Enter":
          keyElement.addEventListener("click", this.eventHandlers.onEnterHandler);
        break;

        case "ShiftLeft":
        case "ShiftRight":
          keyElement.addEventListener("dblclick", this.eventHandlers.onShiftHandler);
        break;

        case "ControlLeft":
        case "ControlRight":
          keyElement.addEventListener("dblclick", this.eventHandlers.onControlHandler);
        break;

        case "MetaLeft":
          keyElement.addEventListener("dblclick", this.eventHandlers.onMetaLeftHandler);
        break;

        case "AltLeft":
        case "AltRight":
          keyElement.addEventListener("dblclick", this.eventHandlers.onAltHandler);
        break;
      }
    } else {
      keyElement.addEventListener("click", this.eventHandlers.onClickTextInputHandler);
    }

    // Default listener for any key
    keyElement.addEventListener("mousedown", this.eventHandlers.onMousedownHandler)
  }

  getKeyData (keyElement) {
    const keyCode = keyElement.getAttribute("data-code");
    if (!keyCode) return null;

    const keyData = this.data.keysDataArr.find(keyObj => keyObj.code === keyCode);

    return keyData;
  }

  onBackspaceListener() {
    this.elements.targetTextArea.value = this.elements.targetTextArea.value.slice(0, -1);
    // this.elements.targetTextArea.value = this.elements.targetTextArea.value + "12345";
    // console.log(this.elements.targetTextArea.value);
  }

  onTabListener () {
    this.elements.targetTextArea.value += "\t";
    // console.log(this.elements.targetTextArea.value);
  }

  onCapsLockListener (event) {
    this.properties.capsLock = !this.properties.capsLock;
    this.elements.notSpecialKeys.forEach(this.functions.setTextContentForKey);

    this.properties.capsLock 
      ? event.currentTarget.classList.add("active-lock") 
      : event.currentTarget.classList.remove("active-lock");
  }

  onEnterListener () {
    this.elements.targetTextArea.value += "\n";
    // console.log(this.elements.targetTextArea.value);
  }

  onShiftListener (event) {
    this.properties.shift = !this.properties.shift;
    this.elements.notSpecialKeys.forEach(this.functions.setTextContentForKey);

    const shiftKeys = this.elements.keysContainer.querySelectorAll(".key[data-code=ShiftLeft], .key[data-code=ShiftRight]");

    this.properties.shift 
      ? event.currentTarget.classList.add("active-lock") 
      : shiftKeys.forEach(el => el.classList.remove("active-lock"));
  }

  onControlListener (event) {
    this.properties.ctrl = !this.properties.ctrl;
    // this.elements.notSpecialKeys.forEach(this.functions.setTextContentForKey);

    const ctrlKeys = this.elements.keysContainer.querySelectorAll(".key[data-code=ControlLeft], .key[data-code=ControlRight]");

    this.properties.ctrl 
      ? event.currentTarget.classList.add("active-lock") 
      : ctrlKeys.forEach(el => el.classList.remove("active-lock"));
  }

  onMetaLeftListener (event) {
    event.currentTarget.classList.toggle("active-lock");
  }

  onAltListener (event) {
    this.properties.alt = !this.properties.alt;
    // this.elements.notSpecialKeys.forEach(this.functions.setTextContentForKey);

    const altKeys = this.elements.keysContainer.querySelectorAll(".key[data-code=AltLeft], .key[data-code=AltRight]");

    this.properties.alt 
      ? event.currentTarget.classList.add("active-lock") 
      : altKeys.forEach(el => el.classList.remove("active-lock"));
  }

  onClickTextInputListener (event) {
    this.elements.targetTextArea.value += event.currentTarget.textContent;
  }

  onMousedownListener(event) {
    const currentTargetEl = event.currentTarget;
    currentTargetEl.classList.add("active");

    currentTargetEl.addEventListener("mouseover", toggleActiveClass);
    currentTargetEl.addEventListener("mouseout", toggleActiveClass);

    this.elements.keyboardContainer.addEventListener("mouseup", () => {
      currentTargetEl.classList.remove("active");
      currentTargetEl.removeEventListener("mouseover", toggleActiveClass);
      currentTargetEl.removeEventListener("mouseout", toggleActiveClass);
    }, {once: true});

    function toggleActiveClass (e) {
      e.currentTarget.classList.toggle("active");
    }
  }

}

class TextArea {

  rows = null;
  cols = null;
  id = null;
  // value = "";


  constructor (textareaId, rows, cols) {
    this.id = textareaId;
    this.rows = rows;
    this.cols = cols;

    const textAreaElement = document.createElement("textarea");
    textAreaElement.setAttribute("rows", `${rows}`);
    textAreaElement.setAttribute("cols", `${cols}`);
    textAreaElement.id = textareaId;
    textAreaElement.classList.add("textarea");

    textAreaElement.addEventListener("input", () => {
      this.value = textAreaElement.value;
      console.log(textAreaElement.value);
    })

    document.body.appendChild(textAreaElement);
  }

}

const textArea = new TextArea("textarea", 5, 50);

const RssKeyboard = new Keyboard("keyboard", "textarea", keysData, lineBreakLayout);


// alert("делаю прямо сейчас. осталось повесить обработчики сибытий. если не сложно, проверьте завтра-послезавтра");