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
    onNotSpecialKeyHandler: this.onNotSpecialKeyListener.bind(this),
    onSpecialKeyHandler: this.onSpecialKeyListener.bind(this),
    onBackspaceHandler: this.onBackspaceListener.bind(this),
    onTabHandler: this.onTabListener.bind(this),
    onCapsLockHandler: this.onCapsLockListener.bind(this),
    onEnterHandler: this.onEnterListener.bind(this),
    onShiftHandler: this.onShiftListener.bind(this),
    onControlHandler: this.onControlListener.bind(this),
    onMetaLeftHandler: this.onMetaLeftListener.bind(this),
    onAltHandler: this.onAltListener.bind(this),
    onMousedownHandler: this.onMousedownListener.bind(this),
    onKeydownHandler: this.onKeydownListener.bind(this),
    onKeyupHandler: this.onKeyupListener.bind(this),
  };

  functions = {
    setListenerForKey: this.setListenerForKey.bind(this),
    setTextContentForKey: this.setTextContentForKey.bind(this),
    getKeyData: this.getKeyData.bind(this),
    checkShortcut: this.checkShortcut.bind(this),
    changeLanguage: this.changeLanguage.bind(this),
    // togglePropertiesOfThis: this.togglePropertiesOfThis.bind(this),
  };

  properties = {
    language: localStorage.getItem('language') || 'ru',
    capsLock: false,
    shift: false,
    ctrl: false,
    alt: false,
    pressed: new Set(),
  };

  data = {
    keysDataArr: [],
    lineBreakArr: [],
  };

  constructor(containerId, textareaId, keysData, lineBreakKeyCodes) {
    this.data.keysDataArr = keysData;
    this.data.lineBreakArr = lineBreakKeyCodes;

    // Create elements
    this.elements.keyboardContainer = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');
    const createdKeys = this.createKeys(
      this.data.keysDataArr,
      this.data.lineBreakArr,
    );

    // Setup main elements
    this.elements.keyboardContainer.classList.add('keyboard');
    this.elements.keyboardContainer.id = containerId;
    this.elements.keysContainer.classList.add(
      'keyboard__keys',
      'keys-container',
    );
    this.elements.targetTextArea = document.getElementById(textareaId);

    // Setup properties

    // Add to DOM
    this.elements.keyboardContainer.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.keyboardContainer);
    this.elements.keysContainer.appendChild(createdKeys);

    // Add keys in this
    this.elements.keys = this.elements.keysContainer.querySelectorAll(
      '.keys-container_key',
    );
    this.elements.specialKeys = this.elements.keysContainer.querySelectorAll('.key_special');
    this.elements.notSpecialKeys = this.elements.keysContainer.querySelectorAll('.key_not-special');

    // Add physical keyboard event for window
    document.body.addEventListener(
      'keydown',
      this.eventHandlers.onKeydownHandler,
    );
    document.body.addEventListener('keyup', this.eventHandlers.onKeyupHandler);
  }

  createKeys(keysDataArr, lineBreakArr) {
    const fragment = document.createDocumentFragment();

    keysDataArr.forEach((keyObj) => {
      const keyElement = document.createElement('button');
      const insertLineBreak = lineBreakArr.indexOf(keyObj.code) !== -1;
      const isSpecialKey = keyObj.isSpecial;

      // Add attributes/classes
      keyElement.setAttribute('data-code', keyObj.code);
      keyElement.classList.add('keyboard__key', 'key', `key_${keyObj.size}`);

      isSpecialKey
        ? keyElement.classList.add('key_special')
        : keyElement.classList.add('key_not-special');

      // Add texContent
      this.functions.setTextContentForKey(keyElement);
      // Add Listener
      this.functions.setListenerForKey(keyElement);

      // Add to DOM
      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        const lineBreakElement = document.createElement('div');
        lineBreakElement.classList.add('line-break-item');
        fragment.appendChild(lineBreakElement);
      }
    });

    return fragment;
  }

  setTextContentForKey(keyElement) {
    const keyData = this.functions.getKeyData(keyElement);
    const lang = this.properties.language;
    const isCapsLock = this.properties.capsLock;
    const isShift = this.properties.shift;

    let result = '';

    if (isCapsLock && isShift) {
      result = keyData[`${lang}ShiftKey`].toLowerCase();
    } else if (isCapsLock) {
      result = keyData[`${lang}Key`].toUpperCase();
    } else if (isShift) {
      result = keyData[`${lang}ShiftKey`];
    } else {
      result = keyData[`${lang}Key`];
    }

    keyElement.textContent = result;
  }

  setListenerForKey(keyElement) {
    const keyData = this.functions.getKeyData(keyElement);
    if (keyData.isSpecial) {
      switch (keyData.code) {
        case 'Backspace':
        case 'Tab':
        case 'CapsLock':
        case 'Enter':
        case 'MetaLeft':
          keyElement.addEventListener('click', (e) => this.eventHandlers.onSpecialKeyHandler(e, keyData.code));
          break;

        case 'ControlLeft':
        case 'ControlRight':
        case 'AltLeft':
        case 'AltRight':
        case 'ShiftLeft':
        case 'ShiftRight':
          keyElement.addEventListener('mousedown', (e) => this.eventHandlers.onSpecialKeyHandler(e, keyData.code));
          keyElement.addEventListener('dblclick', (e) => this.eventHandlers.onSpecialKeyHandler(e, keyData.code));
          break;
      }
    } else {
      keyElement.addEventListener(
        'click',
        this.eventHandlers.onNotSpecialKeyHandler,
      );
    }

    // Default listener for any key
    keyElement.addEventListener(
      'mousedown',
      this.eventHandlers.onMousedownHandler,
    );
  }

  getKeyData(keyElement) {
    const keyCode = keyElement.getAttribute('data-code');
    if (!keyCode) return null;

    const keyData = this.data.keysDataArr.find(
      (keyObj) => keyObj.code === keyCode,
    );

    return keyData;
  }

  // togglePropertiesOfThis(keyCode) {
  //   switch (keyCode) {
  //     case "CapsLock":
  //       this.properties.capsLock = !this.properties.capsLock;
  //       this.elements.notSpecialKeys.forEach(this.functions.setTextContentForKey);
  //     break;

  //     case "ShiftLeft":
  //     case "ShiftRight":
  //       this.properties.shift = !this.properties.shift;
  //       this.elements.notSpecialKeys.forEach(this.functions.setTextContentForKey);
  //     break;

  //     case "ControlLeft":
  //     case "ControlRight":
  //       this.properties.ctrl = !this.properties.ctrl;
  //     break;

  //     case "AltLeft":
  //     case "AltRight":
  //       this.properties.alt = !this.properties.alt;
  //     break;
  //   }
  // }

  onBackspaceListener(event) {
    if (event.type === 'keyup') return;
    this.elements.targetTextArea.value = this.elements.targetTextArea.value.slice(0, -1);
  }

  onTabListener(event) {
    if (event.type === 'keyup') return;
    this.elements.targetTextArea.value += '\t';
  }

  onCapsLockListener(event, keyCode) {
    if (event.type === 'keyup') return;
    this.properties.capsLock = !this.properties.capsLock;
    this.elements.notSpecialKeys.forEach(this.functions.setTextContentForKey);

    const currentKeyInDOM = this.elements.keysContainer.querySelector(
      `.key[data-code=${keyCode}]`,
    );

    this.properties.capsLock
      ? currentKeyInDOM.classList.add('active-lock')
      : currentKeyInDOM.classList.remove('active-lock');
  }

  onEnterListener(event) {
    if (event.type === 'keyup') return;
    this.elements.targetTextArea.value += '\n';
  }

  onShiftListener(event, keyCode) {
    if (event.repeat) return;
    const currentKeyInDOM = this.elements.keysContainer.querySelector(
      `.key[data-code=${keyCode}]`,
    );
    const shiftKeys = this.elements.keysContainer.querySelectorAll(
      '.key[data-code=ShiftLeft], .key[data-code=ShiftRight]',
    );

    this.properties.shift = !this.properties.shift;
    this.elements.notSpecialKeys.forEach(this.functions.setTextContentForKey);

    if (event.type === 'mousedown') {
      currentKeyInDOM.classList.add('active-lock');

      document.body.addEventListener(
        'mouseup',
        () => {
          currentKeyInDOM.classList.remove('active-lock');
          this.properties.shift = !this.properties.shift;
          this.elements.notSpecialKeys.forEach(
            this.functions.setTextContentForKey,
          );
        },
        { once: true },
      );
    } else if (event.type === 'dblclick') {
      if (this.properties.shift) {
        currentKeyInDOM.classList.add('active-lock');
        this.functions.checkShortcut(keyCode);
      } else {
        shiftKeys.forEach((el) => el.classList.remove('active-lock'));
        this.properties.pressed.delete(keyCode);
      }
    }
  }

  onControlListener(event, keyCode) {
    this.properties.ctrl = !this.properties.ctrl;

    const currentKeyInDOM = this.elements.keysContainer.querySelector(
      `.key[data-code=${keyCode}]`,
    );
    const ctrlKeys = this.elements.keysContainer.querySelectorAll(
      '.key[data-code=ControlLeft], .key[data-code=ControlRight]',
    );

    if (event.type === 'mousedown') {
      currentKeyInDOM.classList.add('active-lock');

      document.body.addEventListener(
        'mouseup',
        () => {
          currentKeyInDOM.classList.remove('active-lock');
          this.properties.ctrl = !this.properties.ctrl;
        },
        { once: true },
      );
    } else if (event.type === 'dblclick') {
      if (this.properties.ctrl) {
        currentKeyInDOM.classList.add('active-lock');
        this.functions.checkShortcut(keyCode);
      } else {
        ctrlKeys.forEach((el) => el.classList.remove('active-lock'));
        this.properties.pressed.delete(keyCode);
      }
    }
  }

  onMetaLeftListener(event, keyCode) {
    if (event.type === 'keyup') return;
    alert('событие на мета кнопку');
    // const currentKeyInDOM = this.elements.keysContainer.querySelector(`.key[data-code=${keyCode}]`);
    // currentKeyInDOM.classList.toggle("active-lock");
  }

  onAltListener(event, keyCode) {
    this.properties.alt = !this.properties.alt;

    const currentKeyInDOM = this.elements.keysContainer.querySelector(
      `.key[data-code=${keyCode}]`,
    );
    const altKeys = this.elements.keysContainer.querySelectorAll(
      '.key[data-code=AltLeft], .key[data-code=AltRight]',
    );

    if (event.type === 'mousedown') {
      currentKeyInDOM.classList.add('active-lock');

      document.body.addEventListener(
        'mouseup',
        () => {
          currentKeyInDOM.classList.remove('active-lock');
          this.properties.alt = !this.properties.alt;
        },
        { once: true },
      );
    } else if (event.type === 'dblclick') {
      if (this.properties.alt) {
        currentKeyInDOM.classList.add('active-lock');
        this.functions.checkShortcut(keyCode);
      } else {
        altKeys.forEach((el) => el.classList.remove('active-lock'));
        this.properties.pressed.delete(keyCode);
      }
    }
  }

  onSpecialKeyListener(event, keyCode) {
    event.preventDefault();

    switch (keyCode) {
      case 'Backspace':
        this.eventHandlers.onBackspaceHandler(event);
        break;
      case 'Tab':
        this.eventHandlers.onTabHandler(event);
        break;
      case 'Enter':
        this.eventHandlers.onEnterHandler(event);
        break;
      case 'CapsLock':
        this.eventHandlers.onCapsLockHandler(event, keyCode);
        break;
      case 'MetaLeft':
        this.eventHandlers.onMetaLeftHandler(event, keyCode);
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.eventHandlers.onShiftHandler(event, keyCode);
        break;
      case 'ControlLeft':
      case 'ControlRight':
        this.eventHandlers.onControlHandler(event, keyCode);
        break;
      case 'AltLeft':
      case 'AltRight':
        this.eventHandlers.onAltHandler(event, keyCode);
        break;
    }
  }

  onNotSpecialKeyListener(event) {
    event.preventDefault();
    let currentKeyInDOM;

    switch (event.type) {
      case 'click':
        currentKeyInDOM = event.currentTarget;
        break;

      case 'keydown':
        const keyCode = event.code;
        currentKeyInDOM = this.elements.keysContainer.querySelector(
          `.key[data-code=${keyCode}]`,
        );
    }

    this.elements.targetTextArea.value += currentKeyInDOM.textContent;
  }

  onMousedownListener(event) {
    const currentTargetEl = event.currentTarget;
    currentTargetEl.classList.add('active');

    currentTargetEl.addEventListener('mouseover', toggleActive);
    currentTargetEl.addEventListener('mouseout', toggleActive);

    document.addEventListener(
      'mouseup',
      () => {
        currentTargetEl.classList.remove('active');
        currentTargetEl.removeEventListener('mouseover', toggleActive);
        currentTargetEl.removeEventListener('mouseout', toggleActive);
      },
      { once: true },
    );

    function toggleActive(e) {
      e.currentTarget.classList.toggle('active');
    }
  }

  onKeydownListener(event) {
    const keyCode = event.code;
    const currentKeyInDOM = this.elements.keysContainer.querySelector(
      `.key[data-code=${keyCode}]`,
    );
    if (!currentKeyInDOM) return;

    this.functions.checkShortcut(keyCode);

    currentKeyInDOM.classList.add('active');
    const isSpecialKey = currentKeyInDOM.classList.contains('key_special');
    isSpecialKey
      ? this.eventHandlers.onSpecialKeyHandler(event, keyCode)
      : this.eventHandlers.onNotSpecialKeyHandler(event);
  }

  onKeyupListener(event) {
    document.body.addEventListener('keyup', this.eventHandlers.onKeyupHandler, {
      once: true,
    });
    const keyCode = event.code;
    const currentKeyInDOM = this.elements.keysContainer.querySelector(
      `.key[data-code=${keyCode}]`,
    );
    if (!currentKeyInDOM) return;

    currentKeyInDOM.classList.remove('active');
    this.properties.pressed.delete(keyCode);

    const isSpecialKey = currentKeyInDOM.classList.contains('key_special');
    if (isSpecialKey) this.eventHandlers.onSpecialKeyHandler(event, keyCode);
  }

  checkShortcut(keyCode) {
    this.properties.pressed.add(keyCode);
    if (this.properties.pressed.size !== 2) return;

    const isChangeLanguageShortCut = this.properties.pressed.has('AltLeft')
      && this.properties.pressed.has('ControlLeft');

    if (isChangeLanguageShortCut) this.functions.changeLanguage();
  }

  changeLanguage() {
    this.properties.language === 'ru'
      ? (this.properties.language = 'eng')
      : (this.properties.language = 'ru');

    this.elements.notSpecialKeys.forEach(this.functions.setTextContentForKey);

    localStorage.setItem('language', this.properties.language);
  }
}

export default Keyboard;
