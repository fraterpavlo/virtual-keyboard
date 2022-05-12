export default class TextArea {
  rows = null;

  cols = null;

  id = null;

  constructor(textareaId, rows, cols) {
    this.id = textareaId;
    this.rows = rows;
    this.cols = cols;

    const textAreaElement = document.createElement('textarea');
    textAreaElement.setAttribute('rows', `${rows}`);
    textAreaElement.setAttribute('cols', `${cols}`);
    textAreaElement.id = textareaId;
    textAreaElement.classList.add('textarea');

    textAreaElement.addEventListener('input', () => {
      this.value = textAreaElement.value;
    });

    document.body.appendChild(textAreaElement);
  }
}
