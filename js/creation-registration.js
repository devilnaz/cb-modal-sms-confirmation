function goConfirmation() {
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