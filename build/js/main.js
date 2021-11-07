const accordionButtons = document.querySelectorAll('.page-footer__accordion-button');
const accordionContents = document.querySelectorAll('.page-footer__accordion-content');

const sliceText = document.querySelector('.about__slice-text');
const text = sliceText.textContent;

const form = document.querySelector('.form');
//const inputName = document.querySelector('input#name');

const inputTelephone = form.querySelector('input[type=tel]');
//const inputMessage = document.querySelector('textarea');

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

function isRequiredInputEmpty(form) {
  const inputRequired = form.querySelectorAll('input[required]');
  inputRequired.forEach(function (input) {
    return input === 0;
  })
}

function submitForm(form) {
  form.addEventListener('submit', function (evt) {
    const inputName = form.querySelector('input[type=text]');
    const inputTelephone = form.querySelector('input[type=tel]');
    const inputMessage = form.querySelector('textarea');
    if (isRequiredInputEmpty(form)) {
      evt.preventDefault();
    } else if (isStorageSupport) {
      console.log(5)
      localStorage.setItem('name', inputName.value);
      localStorage.setItem('telephone', inputTelephone.value);
      localStorage.setItem('message', inputMessage.value);
    }
  })
}

/*function isRequiredInputEmpty() {
  inputTelephone.value === 0 || inputName.value === 0
}



function submitForm() {
  form.addEventListener('submit', function (evt) {
    if (isRequiredInputEmpty()) {
      evt.preventDefault();
    } else if (isStorageSupport) {
      console.log(5)
      localStorage.setItem('name', inputName.value);
      localStorage.setItem('telephone', inputTelephone.value);
      localStorage.setItem('message', inputMessage.value);
    }
  })
}*/

submitForm(form);

function createTelephoneMask(telephone) {
  telephone.addEventListener('focus', function () {
    telephone.value = FIRST_SYMBOL;
  })
  telephone.addEventListener('input', function (evt) {
    if (telephone.value == 0) {
      telephone.value = FIRST_SYMBOL + telephone.value;
    } else {
      if (/[0-9]/.test(evt.data)) {
        if (telephone.value.length >= (POSITION_PARENTHESIS_MASK - 1) && telephone.value.length < POSITION_PARENTHESIS_MASK) {
          telephone.value += ')';
        }
      } else {
        const position = evt.target.selectionStart;
        telephone.value = telephone.value.substring(0, position - 1);
      }
    }
  })
}

createTelephoneMask(inputTelephone);

const orderCallButton = document.querySelector('.page-header__order-call');
const orderCallTemplate = document.querySelector('#order-call').content.querySelector('.modal');
const orderCallModal = orderCallTemplate.cloneNode(true);
const closeOrderCallModalButton = orderCallModal.querySelector('.modal__button');
const inputNameModal = orderCallModal.querySelector('input#name');

function closeOrderCallModal() {
  document.body.removeChild(orderCallModal);
  document.body.classList.remove('page-body--opened-modal');
  document.removeEventListener('keydown', onDocumentKeydown);
  document.removeEventListener('click', onDocumentClick);
  closeOrderCallModalButton.removeEventListener('click', onCloseOrderCallModalButtonClick);
}

const onDocumentKeydown = function (evt) {
  if (evt.key === 'Escape' || evt.key === 'Esc') {
    evt.preventDefault();
    closeOrderCallModal();
  }
};

const onDocumentClick = function (evt) {
  if (evt.target !== orderCallModal && evt.target !== orderCallButton && !orderCallModal.contains(evt.target)) {
    closeOrderCallModal();
  }
};

const onCloseOrderCallModalButtonClick = function () {
  closeOrderCallModal();
}

function openOrderCallModal() {
  orderCallButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    document.body.prepend(orderCallModal);
    inputNameModal.focus();
    const formOrderCall = orderCallModal.querySelector('.form');
    const telephoneOrderCall = formOrderCall.querySelector('input[type=tel]');
    createTelephoneMask(telephoneOrderCall);
    submitForm(formOrderCall);
    document.body.classList.add('page-body--opened-modal');
    document.addEventListener('keydown', onDocumentKeydown);
    document.addEventListener('click', onDocumentClick);
    closeOrderCallModalButton.addEventListener('click', onCloseOrderCallModalButtonClick);
  })
}

openOrderCallModal();
