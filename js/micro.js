function buildMicro(blocks) {
      var h = '';
        blocks.forEach(function (b) {
            if (b.type === 'h') h += '<h3>' + esc(b.text) + '</h3>';
                else if (b.type === 'p') h += '<p>' + esc(b.text) + '</p>';
                    else if (b.type === 'li') h += '<div class="li">' + esc(b.text) + '</div>';
                        else if (b.type === 'img') h += '<figure><img src="' + b.src + '" alt=""></figure>';
                            else if (b.type === 'table') {
                                  var max = 0;
                                        b.rows.forEach(function (r) { max = Math.max(max, r.length); });
                                              h += '<table>';
                                                    b.rows.forEach(function (r, ri) {
                                                            var tag = ri === 0 ? 'th' : 'td';
                                                                    h += '<tr>';
                                                                            for (var c = 0; c < max; c++) {
                                                                                      h += '<' + tag + '>' + esc(r[c] || '') + '</' + tag + '>';
                                                                                              }
                                                                                                      h += '</tr>';
                                                                                                            });
                                                                                                                  h += '</table>';
                                                                                                                      }
                                                                                                                        });
                                                                                                                          return h;
                                                                                                                          }
}