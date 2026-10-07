function analyze(blocks,meta){
      var stats={pages:meta&&meta.pages||0,words:0,headings:0,paragraphs:0,lists:0,tables:0,tableRows:0,images:0,font:meta&&meta.bodyFont||0,scanned:!!(meta&&meta.scanned),outline:[]};
        (blocks||[]).forEach(function(b){
            if(b.type==='h'){stats.headings++;if(stats.outline.length<25)stats.outline.push(b.text)}
                if(b.type==='p'){stats.paragraphs++;stats.words+=wordCount(b.text)}
                    if(b.type==='li'){stats.lists++;stats.words+=wordCount(b.text)}
                        if(b.type==='table'){stats.tables++;stats.tableRows+=(b.rows||[]).length;(b.rows||[]).forEach(function(r){r.forEach(function(c){stats.words+=wordCount(c)})})}
                            if(b.type==='img')stats.images++
                              });return stats
                              }
                              function wordCount(s){var m=String(s||'').trim().match(/\S+/g);return m?m.length:0}
                              function renderAnalysis(stats,meta,el){
                                if(!el)return;
                                  var chips=[['Pages',stats.pages],['Words',stats.words],['Headings',stats.headings],['Paragraphs',stats.paragraphs],['List items',stats.lists],['Tables',stats.tables],['Table rows',stats.tableRows],['Images/diagrams',stats.images],['Body font',stats.font?stats.font.toFixed(1)+' pt':'—']];
                                    var html=chips.map(function(c){return '<span class="chip"><b>'+esc(c[1])+'</b> '+esc(c[0])+'</span>'}).join('');
                                      if(stats.scanned)html+='<div class="warning">Warning: this PDF looks scanned. No OCR is used, so little or no text may be available.</div>';
                                        if(stats.outline.length)html+='<h3>First 25 headings</h3><ol class="outline">'+stats.outline.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ol>';
                                          el.innerHTML=html
                                          }
}