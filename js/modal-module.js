function openModalModule(elem) {
  btnName = elem.getAttribute('data-name');
  let modal = document.querySelector(`#${btnName}`);
  
  if (modal) {
    document.body.style.cssText = `overflow: hidden;`;
    
    let ground = modal.querySelector('.modal-module__ground');
    if (ground) {
      ground.style.cssText = `visibility: visible; opacity: 1;`;
    }
    
    let block = modal.querySelector('.modal-module__block');
    if (block) {
      block.style.cssText = `opacity: 1; transform: translateY(0);`;
    }
    
    let btnClose = modal.querySelector('.modal-module__close');
    if (btnClose) {
      btnClose.addEventListener('click', function(event) {
        event.preventDefault();
        document.body.removeAttribute("style");
        ground.removeAttribute("style");
        block.removeAttribute("style");
      })
    }
  } else {
    console.warn('Проверьте атрибут id у модалки, либо правильность добавления data-name у кнопки');
  }
}