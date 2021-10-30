const accordionButtons = document.querySelectorAll('.page-footer__accordion-button');
const accordionContents = document.querySelectorAll('.page-footer__accordion-content');

function closeAccordionContent () {
  accordionContents.forEach(function (elem) {
    elem.classList.add('page-footer__accordion-content--hidden');
  })

}

function openAccordionMenu () {
  closeAccordionContent ();
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

openAccordionMenu ();
