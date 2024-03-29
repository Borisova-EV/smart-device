(function () {
  const accordionTitles = document.querySelectorAll('.page-footer__accordion-title');
  const accordionContents = document.querySelectorAll('.page-footer__accordion-content');

  const ACCORDION_HIDDEN_CLASS = 'page-footer__accordion-content--hidden';
  const ACCORDION_CURRENT_TITLE_CLASS = 'page-footer__accordion-title--current';

  function closeAccordionContent() {
    accordionContents.forEach(function (elem) {
      elem.classList.add(ACCORDION_HIDDEN_CLASS);
    })
  }

  function changeAccordionTitle(currentTitle) {
    accordionTitles.forEach(function (title) {
      if (title !== currentTitle) {
        title.classList.remove(ACCORDION_CURRENT_TITLE_CLASS);
      }
    })
  }

  function openAccordionMenu() {
    closeAccordionContent();
    accordionTitles.forEach(function (title) {
      title.addEventListener('click', function () {
        changeAccordionTitle(this);
        this.classList.toggle(ACCORDION_CURRENT_TITLE_CLASS);
        const content = this.nextElementSibling;
        accordionContents.forEach(function (elem) {
          if (elem === content) {
            elem.classList.toggle(ACCORDION_HIDDEN_CLASS);
          } else {
            elem.classList.add(ACCORDION_HIDDEN_CLASS);
          }
        })
      })
    })
  }

  openAccordionMenu();
})();

(function () {
  const sliceText = document.querySelector('.about__slice-text');
  const text = sliceText.textContent;

  let smallDevice = window.matchMedia("(max-width: 1023px)");

  const START_INDEX_SLICE_TEXT = 0;
  const END_INDEX_SLICE_TEXT = 216;

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

})();

(function () {
  const form = document.querySelector('.form');
  const inputTelephone = form.querySelector('input[type=tel]');
  const page = document.body;
  const orderCallButton = document.querySelector('.page-header__order-call');
  const orderCallTemplate = document.querySelector('#order-call').content.querySelector('.modal');
  const orderCallModal = orderCallTemplate.cloneNode(true);
  const closeOrderCallModalButton = orderCallModal.querySelector('.modal__button');
  const inputNameModal = orderCallModal.querySelector('input#name-order-call');
  const focusableElements = orderCallModal.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];

  let isStorageSupport = true;
  let storageName = '';
  let storageTelephone = '';
  let storageMessage = '';

  const FIRST_SYMBOL = '+7(';
  const SYMBOL_MASK = ')';
  const POSITION_SYMBOL_MASK = 7;
  const TELEPHONE_NUMBER_LENGTH = 14;

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
    return Array.from(inputRequired).some((elem) => elem.value == 0)
  }

  function submitForm(form) {
    form.addEventListener('submit', function (evt) {
      const inputName = this.querySelector('input[type=text]');
      const inputTelephone = this.querySelector('input[type=tel]');
      const inputMessage = this.querySelector('textarea');

      if (isRequiredInputEmpty(this) || inputTelephone.value.length !== TELEPHONE_NUMBER_LENGTH) {
        evt.preventDefault();
      } else if (isStorageSupport) {
        localStorage.setItem('name', inputName.value);
        localStorage.setItem('telephone', inputTelephone.value);
        localStorage.setItem('message', inputMessage.value);
      }
    })
  }

  submitForm(form);

  function createTelephoneMask(telephone) {
    telephone.addEventListener('focus', function () {
      this.value = FIRST_SYMBOL;
    })
    telephone.addEventListener('input', function (evt) {
      if (this.value == 0) {
        this.value = FIRST_SYMBOL + telephone.value;
      } else {
        if (/[0-9]/.test(evt.data)) {
          if (this.value.length >= (POSITION_SYMBOL_MASK - 1) && this.value.length < POSITION_SYMBOL_MASK) {
            this.value += SYMBOL_MASK;
          }
        } else {
          const position = evt.target.selectionStart;
          this.value = this.value.substring(0, position - 1);
        }
      }
    })
  }

  createTelephoneMask(inputTelephone);

  function closeOrderCallModal() {
    page.removeChild(orderCallModal);
    page.classList.remove('page-body--opened-modal');

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

  function trapFocus() {
    orderCallModal.addEventListener('keydown', function (evt) {
      console.log(document.activeElement);
      if (evt.key === 'Tab') {
        if (evt.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            evt.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            evt.preventDefault();
          }
        }
      }
    })
  }

  function openOrderCallModal() {
    orderCallButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      page.prepend(orderCallModal);

      inputNameModal.focus();
      const formOrderCall = orderCallModal.querySelector('.form');
      const telephoneOrderCall = formOrderCall.querySelector('input[type=tel]');
      createTelephoneMask(telephoneOrderCall);
      submitForm(formOrderCall);

      trapFocus();

      page.classList.add('page-body--opened-modal');
      document.addEventListener('keydown', onDocumentKeydown);
      document.addEventListener('click', onDocumentClick);
      closeOrderCallModalButton.addEventListener('click', onCloseOrderCallModalButtonClick);
    })
  }

  openOrderCallModal();
})();

(function () {
  const anchors = document.querySelectorAll('.anchor-link');

  function addSmoothScroll() {
    if (anchors.length) {
      for (let anchor of anchors) {
        anchor.addEventListener('click', function (e) {
          e.preventDefault()

          const blockID = anchor.getAttribute('href')

          document.querySelector(blockID).scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          })
        })
      }
    }
  }

  addSmoothScroll();
})();
