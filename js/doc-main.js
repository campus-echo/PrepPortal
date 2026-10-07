(function(){
      var required=['$','esc','setStatus','showMsg','buildMicro','analyze','renderAnalysis','extractPDF'];
        function docMissing(name){var m=document.createElement('div');m.className='modal';m.innerHTML='<div class="modal-box" role="dialog" aria-modal="true"><p></p><button type="button">OK</button></div>';m.querySelector('p').textContent='File not loaded: '+name+'. Check file name/path in the repo.';document.body.appendChild(m);m.querySelector('button').addEventListener('click',function(){m.remove()})}
          for(var i=0;i<required.length;i++){if(typeof window[required[i]]!=='function'){if(typeof window.showMsg==='function')showMsg('File not loaded: '+required[i]+'. Check file name/path in the repo.');else docMissing(required[i]);return}}
            var fileInput=$('#pdfFile'),cols=$('#columns'),analysis=$('#analysis'),stage=$('#stage'),download=$('#download');
              fileInput.addEventListener('change',function(){if(fileInput.files[0])runPDF(fileInput.files[0])});
                cols.addEventListener('change',renderSheet);
                  download.addEventListener('click',printSheet);
                    var blocks=[],meta={},name='document';
                      async function runPDF(file){
                          try{setStatus('Opening PDF…');analysis.hidden=false;stage.hidden=true;download.hidden=true;name=file.name.replace(/\.pdf$/i,'');
                                blocks=await extractPDF(file,function(t){setStatus(t)});meta=window.extractMeta||{};var stats=analyze(blocks,meta);renderAnalysis(stats,meta,analysis);setStatus('Analysis complete.');renderSheet();stage.hidden=false;download.hidden=false
                                    }catch(e){setStatus('');showMsg('PDF could not be opened: '+(e&&e.message?e.message:String(e)))}
                                      }
                                        function renderSheet(){if(!blocks.length)return;var sheet=buildMicro(blocks);stage.innerHTML=sheet;$('.sheet',stage).style.columnCount=String(cols.value)}
                                          function printSheet(){document.title=name+'-micro';window.print();setTimeout(function(){document.title='Document to Micro'},500)}
                                          })();
})