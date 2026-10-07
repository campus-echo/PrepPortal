var fileEl = $('file'), colsEl = $('cols'), sheet = $('sheet');
var fileName = 'micro-sheet';

fileEl.addEventListener('change', async function () {
  var f = fileEl.files[0];
    if (!f) return;
      if (!/\.pdf$/i.test(f.name) && f.type !== 'application/pdf') {
          showMsg('Sirf PDF file chuno.');
              return;
                }
                  $('analysis').hidden = true;
                    $('actions').hidden = true;
                      sheet.hidden = true;

                        try {
                            var res = await extractPDF(f, setStatus);
                                setStatus('Analysis ho gaya, micro bana raha hu...');
                                    var s = analyze(res);
                                        renderAnalysis(s, res, $('analysis'));

                                            sheet.innerHTML = buildMicro(res.blocks);
                                                sheet.style.columnCount = colsEl.value;
                                                    sheet.hidden = false;
                                                        $('actions').hidden = false;
                                                            fileName = f.name.replace(/\.pdf$/i, '') + '-micro';
                                                                setStatus('Ho gaya ✔  (' + f.name + ')');
                                                                  } catch (e) {
                                                                      setStatus('');
                                                                          showMsg('PDF nahi khul paayi: ' + e.message);
                                                                            }
                                                                            });

                                                                            colsEl.addEventListener('change', function () {
                                                                              sheet.style.columnCount = colsEl.value;
                                                                              });

                                                                              $('dl').addEventListener('click', function () {
                                                                                var old = document.title;
                                                                                  document.title = fileName;
                                                                                    window.print();
                                                                                      setTimeout(function () { document.title = old; }, 1500);
                                                                                      });