var extractMeta={};
async function extractPDF(file,onProgress){
  if(typeof pdfjsLib==='undefined')throw new Error('PDF.js is not loaded');
    pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      var data=await file.arrayBuffer(),pdf=await pdfjsLib.getDocument({data:data}).promise,allPages=[],sizes=[],scanned=false;
        for(var pn=1;pn<=pdf.numPages;pn++){
            if(onProgress)onProgress('Analyzing page '+pn+' of '+pdf.numPages+'…');
                var page=await pdf.getPage(pn),viewport=page.getViewport({scale:1}),text=await page.getTextContent(),items=[];
                    text.items.forEach(function(it){
                          var fs=Math.sqrt(it.transform[0]*it.transform[0]+it.transform[1]*it.transform[1])||1;
                                var pt=viewport.convertToViewportPoint(it.transform[4],it.transform[5]);
                                      if(it.str.trim()){items.push({x:pt[0],y:it.transform[5],screenY:pt[1],fs:fs,text:it.str,width:it.width||0});sizes.push({size:fs,chars:it.str.length})}
                                          });
                                              var rects=mergeRects(await findPageImages(page,viewport));
                                                  if(rects.some(function(r){return r.w*r.h>viewport.width*viewport.height*.85}))scanned=true;
                                                      items=items.filter(function(it){return !rects.some(function(r){return pointInRect(it.x,it.screenY,r)})});
                                                          var lines=makeLines(items),images=[];
                                                              for(var ri=0;ri<rects.length;ri++)if(rects[ri].w>=24&&rects[ri].h>=24)images.push({type:'img',src:await cropPage(page,viewport,rects[ri]),_y:rects[ri].y+rects[ri].h/2});
                                                                  allPages.push({lines:lines,images:images})
                                                                    }
                                                                      var body=commonFont(sizes),all=[];
                                                                        allPages.forEach(function(pg){var pageBlocks=linesToBlocks(pg.lines,body).concat(pg.images);pageBlocks.sort(function(a,b){return (a._y||0)-(b._y||0)});pageBlocks.forEach(function(b){delete b._y;delete b._fs});all=all.concat(pageBlocks)});
                                                                          extractMeta={pages:pdf.numPages,bodyFont:body,scanned:scanned};return all
                                                                          }
                                                                          function commonFont(list){var map={};list.forEach(function(x){var k=(Math.round(x.size*10)/10).toFixed(1);map[k]=(map[k]||0)+x.chars});var best=0,key=0;Object.keys(map).forEach(function(k){if(map[k]>best){best=map[k];key=Number(k)}});return key}
                                                                          function makeLines(items){
                                                                            items.sort(function(a,b){return b.y-a.y||a.x-b.x});var lines=[];
                                                                              items.forEach(function(it){var line=lines[lines.length-1],tol=Math.max(2,.4*it.fs);
                                                                                  if(!line||Math.abs(line.y-it.y)>tol){line={y:it.y,items:[],fs:it.fs};lines.push(line)}
                                                                                      line.items.push(it);line.fs=(line.fs+it.fs)/2
                                                                                        });
                                                                                          return lines.map(function(l){l.items.sort(function(a,b){return a.x-b.x});var cells=[],cur='',start=0,last=null;
                                                                                              l.items.forEach(function(it){var gap=last?it.x-(last.x+last.width):0;if(!cur){cur=it.text;start=it.x}else if(gap>1.5*l.fs){cells.push(cur.trim());cur=it.text;start=it.x}else{cur+=gap>.12*l.fs?' '+it.text:it.text}last=it});if(cur.trim())cells.push(cur.trim());return {y:l.y,screenY:l.items[0].screenY,fs:l.fs,cells:cells,text:cells.join(' ')}
                                                                                                })
                                                                                                }
                                                                                                function linesToBlocks(lines,body){
                                                                                                  var out=[],i=0;
                                                                                                    while(i<lines.length){
                                                                                                        if(lines[i].cells.length>=2){var j=i+1;while(j<lines.length&&lines[j].cells.length>=2&&lines[j].cells.length<=Math.max(8,lines[i].cells.length+2))j++;if(j-i>=2){out.push({type:'table',rows:lines.slice(i,j).map(function(l){return l.cells}),_y:lines[i].screenY});i=j;continue}}
                                                                                                            var l=lines[i],list=/^(?:[•\-*–]|\d+[.)]|[a-zA-Z][.)]|\([a-zA-Z]\))\s+/.test(l.text);
                                                                                                                if(list){var lt=l.text,ly=l.screenY,lj=i+1;while(lj<lines.length&&!isSpecialLine(lines[lj],body)&&Math.abs(lines[lj].y-l.y)<=1.6*l.fs){lt+=' '+lines[lj].text;lj++}out.push({type:'li',text:lt,_y:ly});i=lj;continue}
                                                                                                                    if(l.text.length<=150&&l.fs>=1.12*body){out.push({type:'h',level:l.fs>=1.5*body?1:2,text:l.text,_y:l.screenY,_fs:l.fs});i++;continue}
                                                                                                                        var text=l.text,y=l.screenY,j=i+1;
                                                                                                                            while(j<lines.length&&!isSpecialLine(lines[j],body)&&Math.abs(lines[j].y-l.y)<=1.6*l.fs){text+=' '+lines[j].text;j++}
                                                                                                                                out.push({type:'p',text:text.trim(),_y:y});i=j
                                                                                                                                  }
                                                                                                                                    for(var k=1;k<out.length;k++)if(out[k].type==='h'&&out[k-1].type==='h'&&Math.abs(out[k]._fs-out[k-1]._fs)<0.1){out[k-1].text+=' '+out[k].text;out.splice(k,1);k--}
                                                                                                                                      return out
                                                                                                                                      }
                                                                                                                                      function isSpecialLine(l,body){return l.cells.length>=2||/^(?:[•\-*–]|\d+[.)]|[a-zA-Z][.)]|\([a-zA-Z]\))\s+/.test(l.text)||(l.text.length<=150&&l.fs>=1.12*body)}
                                                                                                                                      function pointInRect(x,y,r){return x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h}
                                                                                                                                      function mergeRects(rs){var changed=true;while(changed){changed=false;outer:for(var i=0;i<rs.length;i++)for(var j=i+1;j<rs.length;j++)if(overlap(rs[i],rs[j])){rs[i]=unionRect(rs[i],rs[j]);rs.splice(j,1);changed=true;break outer}}return rs}
                                                                                                                                      function overlap(a,b){return !(a.x+a.w<b.x||b.x+b.w<a.x||a.y+a.h<b.y||b.y+b.h<a.y)}
                                                                                                                                      function unionRect(a,b){var x=Math.min(a.x,b.x),y=Math.min(a.y,b.y),r=Math.max(a.x+a.w,b.x+b.w),bot=Math.max(a.y+a.h,b.y+b.h);return{x:x,y:y,w:r-x,h:bot-y}}
                                                                                                                                      async function findPageImages(page,viewport){
                                                                                                                                        var op=await page.getOperatorList(),ctm=[1,0,0,1,0,0],stack=[],rs=[];
                                                                                                                                          for(var i=0;i<op.fnArray.length;i++){var fn=op.fnArray[i],a=op.argsArray[i];
                                                                                                                                              if(fn===pdfjsLib.OPS.save){stack.push(ctm.slice());continue}if(fn===pdfjsLib.OPS.restore){ctm=stack.pop()||ctm;continue}
                                                                                                                                                  if(fn===pdfjsLib.OPS.transform){ctm=pdfjsLib.Util.transform(ctm,a);continue}
                                                                                                                                                      if(fn===pdfjsLib.OPS.paintFormXObjectBegin){stack.push(ctm.slice());ctm=pdfjsLib.Util.transform(ctm,a[0]||[1,0,0,1,0,0]);continue}
                                                                                                                                                          if(fn===pdfjsLib.OPS.paintFormXObjectEnd){ctm=stack.pop()||ctm;continue}
                                                                                                                                                              if(fn===pdfjsLib.OPS.paintImageXObject||fn===pdfjsLib.OPS.paintInlineImageXObject||fn===pdfjsLib.OPS.paintImageMaskXObject)rs.push(transformRect(ctm,1,1,viewport))
                                                                                                                                                                }return rs
                                                                                                                                                                }
                                                                                                                                                                function transformRect(m,w,h,v){var p=[[0,0],[w,0],[0,h],[w,h]].map(function(q){var x=m[0]*q[0]+m[2]*q[1]+m[4],y=m[1]*q[0]+m[3]*q[1]+m[5];return v.convertToViewportPoint(x,y)});var xs=p.map(function(q){return q[0]}),ys=p.map(function(q){return q[1]}),x=Math.min.apply(null,xs),y=Math.min.apply(null,ys);return{x:x,y:y,w:Math.max.apply(null,xs)-x,h:Math.max.apply(null,ys)-y}}
                                                                                                                                                                function cropPage(page,v,r){var c=document.createElement('canvas'),scale=2,cw=Math.max(1,Math.round(v.width*scale)),ch=Math.max(1,Math.round(v.height*scale));c.width=cw;c.height=ch;var ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,cw,ch);return page.render({canvasContext:ctx,viewport:v,transform:[scale,0,0,scale,0,0]}).promise.then(function(){var x=Math.max(0,Math.floor(r.x*scale)),y=Math.max(0,Math.floor(r.y*scale)),w=Math.min(cw-x,Math.ceil(r.w*scale)),h=Math.min(ch-y,Math.ceil(r.h*scale));var crop=document.createElement('canvas');crop.width=Math.max(1,w);crop.height=Math.max(1,h);crop.getContext('2d').drawImage(c,x,y,w,h,0,0,w,h);return crop.toDataURL('image/png')})}