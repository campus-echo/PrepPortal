function $(id) { return document.getElementById(id); }

function setStatus(t) { $('status').textContent = t; }

function showMsg(t) {
  $('modalText').textContent = t;
    $('modal').hidden = false;
    }

    $('modalOk').addEventListener('click', function () {
      $('modal').hidden = true;
      });

      function esc(t) {
        return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }