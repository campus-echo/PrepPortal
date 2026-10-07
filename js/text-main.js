(function(){
      var required=['$','esc','setStatus','showMsg','buildMicro','analyze','renderAnalysis','parseText'];
        function textMissing(name){var m=document.createElement('div');m.className='modal';m.innerHTML='<div class="modal-box" role="dialog" aria-modal="true"><p></p><button type="button">OK</button></div>';m.querySelector('p').textContent='File not loaded: '+name+'. Check file name/path in the repo.';document.body.appendChild(m);m.querySelector('button').addEventListener('click',function(){m.remove()})}
          for(var i=0;i<required.length;i++){if(typeof window[required[i]]!=='function'){if(typeof window.showMsg==='function')showMsg('File not loaded: '+required[i]+'. Check file name/path in the repo.');else textMissing(required[i]);return}}
            var input=$('#sourceText'),cols=$('#columns'),analysis=$('#analysis'),stage=$('#stage'),download=$('#download'),make=$('#make');
              var blocks=[],meta={pages:1,bodyFont:5,scanned:false},name='text';
                make.addEventListener('click',function(){
                    try{blocks=parseText(input.value);var stats=analyze(blocks,meta);renderAnalysis(stats,meta,analysis);analysis.hidden=false;renderSheet();stage.hidden=false;download.hidden=false;setStatus('Analysis complete.')}
                        catch(e){showMsg('Text could not be processed: '+(e&&e.message?e.message:String(e)))}
                          });
                            cols.addEventListener('change',renderSheet);download.addEventListener('click',printSheet);
                              function renderSheet(){if(!blocks.length){stage.innerHTML='';return}stage.innerHTML=buildMicro(blocks);$('.sheet',stage).style.columnCount=String(cols.value)}
                                function printSheet(){document.title=name+'-micro';window.print();setTimeout(function(){document.title='Text to Micro'},500)}
                                })();
})