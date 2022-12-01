function goConfirmation() {
  
  let phoneInput = document.querySelector('#js_phone_input');
  let phoneValue = phoneInput.value;
  let phoneValueClear = phoneValue.replace(/[^0-9]/g, '');
  
  // если номер введен полностью
  if (phoneValueClear.length === 11) {
    setValuePhone(phoneValue);
    transition();
  } else {
    phoneInput.style.cssText = `
      border: 1px solid rgba(255, 0, 45, 0.7);
      box-shadow: rgba(255, 0, 45, 0.7) 0px 0px 3px;
      transition: all 0.1s ease;
    `;
    phoneInput.addEventListener("focus", function() {
      this.removeAttribute('style');
    });
  }
  
  
  
  
  
  function setValuePhone(value) {
    let phoneLine = document.querySelector('#js_phone_line');
    phoneLine.textContent = value;
  }
  
  function transition() {
    let writeBlock = document.querySelector('.creation-registration__data-write');  
    let confirmBlock = document.querySelector('.creation-registration__sms-confirmation');
    
    writeBlock.setAttribute('data-visibility', 'js_hide');
    confirmBlock.setAttribute('data-visibility', 'js_show');
    
    writeBlock.style.cssText = `
      visibility: hidden; 
      opacity: 0; 
      transform: translateX(-100%); 
      position: absolute; 
      top: 0; 
      transition: all 0.3s ease;
    `;
    confirmBlock.removeAttribute('style');
    confirmBlock.style.cssText = `
      visibility: visible; 
      opacity: 1; 
      transform: translateX(0); 
      top: 0; 
      transition: all 0.3s ease;
    `;
  }
}

function goSetData() {
  let writeBlock = document.querySelector('.creation-registration__data-write');
  let confirmBlock = document.querySelector('.creation-registration__sms-confirmation');
  
  writeBlock.setAttribute('data-visibility', 'js_show');
  confirmBlock.setAttribute('data-visibility', 'js_hide');
  
  writeBlock.removeAttribute('style');
  confirmBlock.style.cssText = `
    visibility: hidden; 
    opacity: 0; 
    transform: translateX(100%); 
    position: absolute; 
    top: 0; 
    transition: all 0.3s ease;
  `;
  
  writeBlock.style.cssText = `
    visibility: visible; 
    opacity: 1; 
    transform: translateX(0%); 
    top: 0; 
    transition: all 0.3s ease;
  `;
  
}