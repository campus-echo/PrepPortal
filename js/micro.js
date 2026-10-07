function buildMicro(blocks){
      var out='<div class="sheet">';
        (blocks||[]).forEach(function(b){
            if(b.type==='h')out+='<h3>'+esc(b.text)+'</h3>';
                else if(b.type==='p')out+='<p>'+esc(b.text)+'</p>';
                    else if(b.type==='li')out+='<div class="li">'+esc(b.text)+'</div>';
                        else if(b.type==='table'){
                              out+='<table><tbody>';
                                    (b.rows||[]).forEach(function(row,i){out+='<tr>';
                                            row.forEach(function(cell){out+=(i===0?'<th>':'<td>')+esc(cell)+(i===0?'</th>':'</td>')});
                                                    out+='</tr>'
                                                          });out+='</tbody></table>';
                                                              }else if(b.type==='img')out+='<figure><img src="'+esc(b.src)+'" alt="PDF diagram or image"></figure>';
                                                                });
                                                                  return out+'</div>'
                                                                  }
}