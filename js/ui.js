function $(sel, root){return (root||document).querySelector(sel)}
function esc(value){return String(value==null?'':value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')}
function setStatus(text){var el=$('#status');if(el)el.textContent=text||''}
function showMsg(message){
  var modal=$('#msgModal');
    if(!modal){
        modal=document.createElement('div');modal.id='msgModal';modal.className='modal';
            modal.innerHTML='<div class="modal-box" role="dialog" aria-modal="true"><p id="msgText"></p><button id="msgOk" type="button">OK</button></div>';
                document.body.appendChild(modal);
                  }
                    var ok=$('#msgOk',modal);
                      if(!ok.dataset.bound){ok.dataset.bound='1';ok.addEventListener('click',function(){modal.hidden=true})}
                        $('#msgText',modal).textContent=message;modal.hidden=false;ok.focus()
                        }