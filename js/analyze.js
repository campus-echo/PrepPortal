function analyze(res) {
      var s = { pages: res.pageCount, headings: 0, paras: 0, items: 0, tables: 0, rows: 0, images: 0, words: 0, outline: [] };
        res.blocks.forEach(function (b) {
            if (b.type === 'h') { s.headings++; s.outline.push(b); s.words += b.text.split(/\s+/).length; }
                else if (b.type === 'p') { s.paras++; s.words += b.text.split(/\s+/).length; }
                    else if (b.type === 'li') { s.items++; s.words += b.text.split(/\s+/).length; }
                        else if (b.type === 'table') { s.tables++; s.rows += b.rows.length; }
                            else if (b.type === 'img') { s.images++; }
                              });
                                return s;
                                }

                                function renderAnalysis(s, res, el) {
                                  var chips = [
                                      ['Pages', s.pages], ['Words', s.words], ['Headings', s.headings],
                                          ['Paragraphs', s.paras], ['List items', s.items],
                                              ['Tables', s.tables], ['Table rows', s.rows], ['Images/Diagrams', s.images],
                                                  ['Body font', res.bodySize.toFixed(1) + ' pt']
                                                    ];
                                                      var h = '<div class="chips">' + chips.map(function (c) {
                                                          return '<div class="chip"><b>' + c[1] + '</b> ' + c[0] + '</div>';
                                                            }).join('') + '</div>';

                                                              if (res.scanned > 0 || (s.words < 20 * s.pages && s.images > 0)) {
                                                                  h += '<div class="warn">Ye PDF scanned lagti hai (text kam, image zyada). Text select nahi hoga, isliye page image ke roop mein micro hoga.</div>';
                                                                    }
                                                                      if (s.outline.length) {
                                                                          h += '<div class="outline"><b>Structure:</b><br>' + s.outline.slice(0, 25).map(function (b) {
                                                                                return (b.level === 1 ? '▪ ' : '&nbsp;&nbsp;– ') + esc(b.text);
                                                                                    }).join('<br>') + (s.outline.length > 25 ? '<br>...' : '') + '</div>';
                                                                                      }
                                                                                        el.innerHTML = h;
                                                                                          el.hidden = false;
                                                                                          }
}