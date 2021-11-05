const accordionButtons = document.querySelectorAll('.page-footer__accordion-button');
const accordionContents = document.querySelectorAll('.page-footer__accordion-content');
const sliceText = document.querySelector('.about__slice-text');
const text = sliceText.textContent;
const form = document.querySelector('.form');
const inputRequired = document.querySelectorAll('input[required]');
const inputName = document.querySelector('input#name');
const inputTelephone = document.querySelector('input#telephone');
const inputMessage = document.querySelector('textarea');

let smallDevice = window.matchMedia("(max-width: 1023px)");
let isStorageSupport = true;
let storageName = '';
let storageTelephone = '';
let storageMessage = '';

const START_INDEX_SLICE_TEXT = 0;
const END_INDEX_SLICE_TEXT = 208;
const FIRST_SYMBOL = '+7(';
const POSITION_PARENTHESIS_MASK = 7;

function closeAccordionContent() {
  accordionContents.forEach(function (elem) {
    elem.classList.add('page-footer__accordion-content--hidden');
  })
}

function changeButtonAccordion(currentButton) {
  accordionButtons.forEach(function (button) {
    if (button !== currentButton) {
      button.classList.remove('page-footer__accordion-button--current');
    }
  })
}

function openAccordionMenu() {
  closeAccordionContent();
  accordionButtons.forEach(function (button) {
    button.addEventListener('click', function (evt) {
      const buttonCurrent = evt.target;
      changeButtonAccordion(buttonCurrent);
      buttonCurrent.classList.toggle('page-footer__accordion-button--current');
      const content = buttonCurrent.nextElementSibling;
      accordionContents.forEach(function (elem) {
        if (elem === content) {
          elem.classList.toggle('page-footer__accordion-content--hidden');
        } else {
          elem.classList.add('page-footer__accordion-content--hidden');
        }
      })
    })
  })
}

openAccordionMenu();

function truncateString(str, num) {
  if (str.length <= num) {
    return str
  }
  return str.slice(START_INDEX_SLICE_TEXT, num) + '..'
}

function cutParagraph() {
  let newText;
  if (smallDevice.matches) {
    newText = truncateString(text, END_INDEX_SLICE_TEXT);
  } else {
    newText = text;
  }
  sliceText.textContent = newText;
}

cutParagraph();
window.addEventListener('resize', () => cutParagraph());


try {
  storageName = localStorage.getItem('name');
} catch (err) {
  isStorageSupport = false;
}
try {
  storageTelephone = localStorage.getItem('telephone');
} catch (err) {
  isStorageSupport = false;
}
try {
  storageMessage = localStorage.getItem('message');
} catch (err) {
  isStorageSupport = false;
}


function isRequiredInputEmpty() {
  inputRequired.forEach(function (input) {
    input.value === 0
  })
}

function submitForm() {
  form.addEventListener('submit', function (evt) {
    if (isRequiredInputEmpty) {
      evt.preventDefault();
    } else if (isStorageSupport) {
      localStorage.setItem('name', inputName.value);
      localStorage.setItem('telephone', inputTelephone.value);
      localStorage.setItem('message', inputMessage.value);
    }
  })
}

submitForm();

inputTelephone.addEventListener('focus', function () {
  inputTelephone.value = FIRST_SYMBOL;
})

function createTelephoneMask() {
  inputTelephone.addEventListener('input', function (evt) {
    if (inputTelephone.value == 0) {
      inputTelephone.value = FIRST_SYMBOL + inputTelephone.value;
    } else {
      if (/[0-9]/.test(evt.data)) {
        if (inputTelephone.value.length >= (POSITION_PARENTHESIS_MASK - 1) && inputTelephone.value.length < POSITION_PARENTHESIS_MASK) {
          inputTelephone.value += ')';
        }
      } else {
        const position = evt.target.selectionStart;
        inputTelephone.value = inputTelephone.value.substring(0, position - 1);
      }
    }
  })
}

createTelephoneMask();
