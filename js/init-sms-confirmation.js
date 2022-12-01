// если ты здесь, чтобы поправить код, то https://imgur.com/Vj8oKmf.png

// функция запускает весь процесс
emailRework();

function emailRework() {
  let allEmailBlock = document.querySelectorAll('.head-slider-text--buttons---mail');

  if (allEmailBlock.length) {
    for (let inputBlock of allEmailBlock) {
      let image = inputBlock.querySelector('img');
      let input = inputBlock.querySelector('[name="email"]');
      let domain = window.location.origin;
      
      image.setAttribute('src', `${domain}/images/phone.svg`);
      input.setAttribute('placeholder', 'Ваш телефон');
      input.setAttribute('data-name', 'js_input_phone');
      input.removeAttribute('onkeypress');
    }
  } else {
    console.log('На стр. отсутствуют email инпуты');
  }

  let allEmailBtn = document.querySelectorAll('.head-slider-text--buttons--create');

  if (allEmailBtn.length) {
    for (let btn of allEmailBtn) {
      btn.setAttribute('onclick', 'hangEvents()');
    }
  } else {
    console.log('На стр. отсутствуют email кнопки');
  }
};


/**
 * событие по клику для кнопок "попробовать бесплатно"
 */
function hangEvents() {
  let allPhoneInput = document.querySelectorAll('[data-name="js_input_phone"]');
  
  if (allPhoneInput.length) {
    for (let phoneInput of allPhoneInput) {
      if (phoneInput.value != '') {
        document.querySelector('#js_phone_line').textContent = phoneInput.value;
        sendRequestBySms(phoneInput.value);
        startTimerResendSms();
        openModalModule('#modal_sms_confirmation');
        initCodeInput();
        return;
      }
    }
  }
  
}

/**
 * открывает модальное окно с смс подтверждением
 */
function openModalModule(modalElem) {
  
    let modal = document.querySelector(modalElem);

    if (modal) {
      document.body.style.overflow = 'hidden';
      
      let ground = modal.querySelector('.modal-module__ground');
      if (ground) {
        ground.style.cssText = `visibility: visible; opacity: 1;`;
      }
      
      let block = modal.querySelector('.modal-module__block');
      if (block) {
        block.style.cssText = `opacity: 1; transform: translateY(0);`;
      }
      
      // устанавливает событие для закрытия модального окна
      let btnClose = modal.querySelectorAll('[data-name="modal_close"]');
      if (btnClose.length) {
        for (let btn of btnClose) {
          btn.addEventListener('click', function(event) {
            event.preventDefault();
            document.body.style.overflow = 'auto';
            ground.removeAttribute("style");
            block.removeAttribute("style");
          })
        }
      }
    }
  
}

function sendRequestBySms(valuePhone) {
  $.ajax({
      type: 'POST',
      url: window.location.origin + '/send_code1.php',
      data: "phone" + valuePhone,
      success: function (data) {
        console.log('отправилось');
      },
      error: function() {
        console.log('не отправилось');
      },
  });
}

/**
 * функция отвечает за часть с вводом кода из СМСа
 * нужно переделывать
 */
function initCodeInput() {
  document.querySelector('#js_code_input').addEventListener('keydown', function (event) {
    // Разрешаем: backspace
    if (event.keyCode == 8) {
      event.preventDefault();
      if (this.value.slice(-1) == ' ') {
        this.value = this.value.slice(0, -2);
      } else {
        this.value = this.value.slice(0, -1);
      }
    } else {
      // Запрещаем все, кроме цифр на основной клавиатуре, а так же Num-клавиатуре
      if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
        event.preventDefault();
      } else {
        event.preventDefault();
        if (this.value.length < 6) {
          this.value = this.value + event.key + ' ';
        } else if (this.value.length > 5 && this.value.length <= 6) {
          this.value = this.value + event.key;
        }
      }
    }
    
    // делает или не делает кнопку активным
    let btnConfirm = document.querySelector('#js_btn_confirmation_sms');
    if (this.value.length === 7) {
      btnConfirm.classList.remove('cb-btn-module_disabled');
      btnConfirm.classList.add('cb-btn-module_hover-dark');
      btnConfirm.setAttribute('onclick', 'checkCode(this)');
    } else {
      let status = btnConfirm.classList.contains('cb-btn-module_disabled');
      if (!status) {
        btnConfirm.classList.add('cb-btn-module_disabled');
        btnConfirm.classList.remove('cb-btn-module_hover-dark');
        btnConfirm.removeAttribute('onclick');
      }
    }
     
  })
}

function checkCode(elem) {
  let inputCode = document.querySelector('#js_code_input');
  let codeValue = inputCode.value.replace(/[^0-9]/g, '');
    $.ajax({
      type: 'POST',
      url: window.location.origin + '/check_code.php',
      data: "phone" + valuePhone + "&code=" + codeValue,
      success: function (data) {
        console.log('success');
        startCreateAccount();
      },
      error: function() {
        console.log('no success');
        let codeInput = document.querySelector('#js_code_input');
        codeInput.style.cssText = `
          border: 2px solid  #ff7d7dcf;
          box-shadow: #ff7d7d 0px 0px 4px;
        `;
        codeInput.addEventListener('focus', function() {
          this.removeAttribute('style');
        })
      },
  });
}

/**
 * событие для повторной отправки СМС
 */
function resendSms() {
  let value = document.querySelector('#js_phone_line').textContent;
  let desc = document.querySelector('#js_description_timer');
  let btn = document.querySelector('#js_send_again');
  desc.style.display = 'block';
  btn.style.display = 'none';
  sendRequestBySms(value);
  startTimerResendSms();
}

/**
 * запускает таймер исходя из значения в localStorage, инчае устанавливает новый таймер в localStorage
 */
function startTimerResendSms() {
  let hasTimeStorage = localStorage.getItem('end-resend-time');
  let timeStorage = new Date(hasTimeStorage);
  let newDate = new Date();
  
  if (hasTimeStorage && newDate < timeStorage) {
    startTimer('js_timer_code', timeStorage);
  } else {
    let minutes = 3;
    let endTime = addMinutesToDate(newDate, minutes);
    localStorage.setItem('end-resend-time', endTime);
    startTimer('js_timer_code', endTime);
  };
  
  function addMinutesToDate(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
  };
  
  function startTimer(elemId, endtime) {
    var clock = document.getElementById(elemId);
    
    var timeinterval = setInterval(function() {
      var t = getTimeRemaining(endtime);
      
      clock.innerHTML = t.minutes + ':' + t.seconds;
      
      if( t.total <= 0 ) {
        clearInterval(timeinterval);
        let desc = document.querySelector('#js_description_timer');
        let btn = document.querySelector('#js_send_again');
        desc.style.display = 'none';
        btn.style.display = 'block';
      }
    }, 1000);
  };
  
  function getTimeRemaining(endtime) { 
    
    var t = Date.parse(endtime) - Date.parse(new Date());
    
    var seconds = Math.floor( (t/1000) % 60 ); 
    if (seconds <= 9) {
      seconds = '0' + seconds;
    }
    var minutes = Math.floor( (t/1000/60) % 60 );
    if (minutes <= 9) {
      minutes = '0' + minutes;
    }
    
    return {  
      'total': t, 
      'minutes': minutes,  
      'seconds': seconds  
    };  
  };
};


/**
 * самая хрупкая часть всей системы
 * функция отвечает за запуск создания быстрых аккаунтов
 */
function startCreateAccount() {

      start_create_animation();

      let programCodeId = document.querySelector('#js-code-program');
      let additionType = document.querySelector(".addition-main-panel__type");
      let resultAdditionType;
      if (additionType) {
        resultAdditionType = (additionType.textContent == "Дополнение") ? false : true;
      }

        if (programCodeId && resultAdditionType) {
          configur_id = Number(programCodeId.textContent);
        } else if ($("#acc-type").attr("acc_type") == 215) {
          configur_id = 215;
        } else {
          if ($("#mconf_id") && $("#mconf_id").length > 0) {
            var idVal = $("#mconf_id").val();
            var curUrl = location.href;
            var urlSearcher = new URLSearchParams(window.location.search);

            if (curUrl.indexOf("?config=") > -1) {
              configur_id = urlSearcher.get("config");
            } else {
              configur_id = idVal && idVal != null ? idVal : 0;
            }
          } else {
            configur_id = 0;
          }
        }
      // Постим форму
      var f_str = "";
      if (getCookie('friend_id')) f_str = "&friend=" + encodeURIComponent(getCookie('friend_id'));
      var p_str = "";
      if (getCookie('partner_id')) p_str = "&code=" + encodeURIComponent(getCookie('partner_id'));
      var r_str = "";
      if (getCookie('referer_frm')) r_str = "&referer=" + encodeURIComponent(getCookie('referer_frm'));
      if (configur_id < 0) {
          client_phone += "|" + -configur_id;
          configur_id = 126;
      }
      var UTM = Object.fromEntries((location.search.match(/(?:utm_).+?=[^&]*/g) || []).map(function (n){ return n.split('=')}))
      var date = new Date(Date.now() + 60e3); // +1 минута от тек.даты
      date = date.toUTCString();
      $.ajax({
          type: 'POST',
          url: window.location.origin + '/client_register_fast.php',
          headers: {
              "validateAcc": date
          },
          data: "mconf_id=" + configur_id + "&memail=" + encodeURIComponent(email) + r_str + p_str + f_str +"&utm_source="+UTM.utm_source+"&utm_medium="+UTM.utm_medium+"&utm_campaign="+UTM.utm_campaign+"&utm_content="+UTM.utm_content+"&utm_term="+UTM.utm_term+"&utm_mark_title="+encodeURIComponent(getCookie('title_mark')),
          success: function (data) {
            if (data.includes('<title>404 Not Found</title>')) {
              console.log('При создании пришел ответ 404 Not Found');
              setTimeout(function() {
                $('#load_block').hide();
                $('#fix_banner').css('z-index','999');
                $('.blur').css('z-index','0');
                warningModule();
              }, 3000)
            } else {
              data = JSON.parse(data);
              if (data.type == 'standard') {
                  setTimeout(function() {
                      setInterval(goto_new_acc(data.data.command.data.command.parameters.login), 200);
                  }, 30000);
              } else if (data.type == 'fast') {
                  setInterval(goto_new_acc(data.data.command.data.command.parameters.login), 200);
              }

              //CarrotQuest API
              //Передача User ID
              var clientId = data.data.command.data.client;
              var hash = data.hash;
            }
          },
          error: function() {
            setTimeout(function() {
              $('#load_block').hide();
              $('#fix_banner').css('z-index','999');
              $('.blur').css('z-index','0');
              warningModule();
            }, 3000)
          },
      });
};
