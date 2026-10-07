function parseText(str){
      var lines=String(str||'').replace(/\r/g,'').split('\n'),blocks=[],para=[];
        function flush(){if(para.length){blocks.push({type:'p',text:para.join(' ').trim()});para=[]}}
          function isList(s){return /^(?:[•\-*–]|\d+[.)]|[a-zA-Z][.)]|\([a-zA-Z]\))\s+/.test(s)}
            function isSep(s){return /^\s*[:|+\-\s]+$/.test(s)&&s.indexOf('|')>=0}
              function isHead(s){return s.length<=80&&(/:$/.test(s)||(/[A-Z]/.test(s)&&s===s.toUpperCase()&&/[A-Z]/.test(s)))}
                for(var i=0;i<lines.length;i++){
                    var raw=lines[i],s=raw.trim();
                        if(!s){flush();continue}
                            if(/^#+/.test(s)){flush();blocks.push({type:'h',level:Math.min(2,(s.match(/^#+/)[0].length)),text:s});continue}
                                if(isList(s)){flush();blocks.push({type:'li',text:s});continue}
                                    if((s.indexOf('|')>=0||raw.indexOf('\t')>=0)){
                                          flush();var cells=s.indexOf('|')>=0?s.split('|').map(function(x){return x.trim()}):raw.split('\t').map(function(x){return x.trim()});
                                                cells=cells.filter(function(x,i,a){return !(i===0&&x==='')&&!(i===a.length-1&&x==='')});
                                                      if(cells.length&&!isSep(s))blocks.push({type:'table',rows:[cells]});continue
                                                          }
                                                              if(isHead(s)){flush();blocks.push({type:'h',level:2,text:s});continue}
                                                                  para.push(s)
                                                                    }
                                                                      flush();return mergeTextTables(blocks)
                                                                      }
                                                                      function mergeTextTables(blocks){
                                                                        var out=[];
                                                                          blocks.forEach(function(b){
                                                                              if(b.type==='table'&&out.length&&out[out.length-1].type==='table')out[out.length-1].rows.push(b.rows[0]);
                                                                                  else out.push(b)
                                                                                    });return out
                                                                                    }
}