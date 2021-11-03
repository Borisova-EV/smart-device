const accordionButtons = document.querySelectorAll('.page-footer__accordion-button');
const accordionContents = document.querySelectorAll('.page-footer__accordion-content');
const sliceText = document.querySelector('.about__slice-text');
const text = sliceText.textContent;

let smallDevice = window.matchMedia("(max-width: 1023px)");

const START_INDEX_SLICE_TEXT = 0;
const END_INDEX_SLICE_TEXT = 208;

function closeAccordionContent() {
  accordionContents.forEach(function (elem) {
    elem.classList.add('page-footer__accordion-content--hidden');
  })

}

function openAccordionMenu() {
  closeAccordionContent();
  accordionButtons.forEach(function (button) {
    button.addEventListener('click', function (evt) {
      const buttonCurrent = evt.target;
      console.log(evt.target);
      buttonCurrent.classList.toggle('page-footer__accordion-button--current');
      if (button !== buttonCurrent) {
        button.classList.remove('page-footer__accordion-button--current');
        console.log(3);
      }
      const content = buttonCurrent.nextElementSibling;
      accordionContents.forEach(function (elem) {
        console.log(4);
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

