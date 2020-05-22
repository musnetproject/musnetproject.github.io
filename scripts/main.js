function setCopyrightYear() {
  var date = new Date();
  var elem = document.getElementById("year");
  elem.innerHTML = date.getFullYear();
}

function getServerInfo() {
  var info = {
    domain: undefined,
    ip: undefined,
    status: undefined,
    timestamp: undefined
  };

  function fillHTML() {
    var statSym = document.getElementById('status-symbol');
    // var stat = document.getElementById('status');
    var isRunning = false;

    if (info.timestamp != undefined) {
      if (
        (info.domain == 'server.musnet.io') &&
        (info.ip == '89.40.143.195') &&
        (info.status == 'running')
      ) {
        isRunning = true;
      }
    }

    if (statSym.classList.contains('loading')) {
      statSym.classList.remove('loading');
    }
    if (isRunning) {
      statSym.classList.add('green');
      // stat.innerHTML = 'running';
    } else {
      statSym.classList.add('red');
      // stat.innerHTML = 'down';
    }
  }

  function sendRequest() {
    let url = 'https://server.musnet.io';
    let request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.timeout = 10000;
    request.responseType = 'json';
    request.onload = function() {
      var response = request.response;
      info.domain = response['domain'];
      info.ip = response['ip'];
      info.status = response['status'];
      info.timestamp = Date.now();
    }
    request.onerror = function() {
      info.timestamp = Date.now();
    }
    request.send();
  }

  function checkStatusAndUpdate() {
    var intervObj = undefined;
    var t = 0;
    function responseReceived() {
      t++;
      if ((info.timestamp != undefined) || (t > 20)) {
        clearInterval(intervObj);
        fillHTML();
      }
    }
    intervObj = setInterval(responseReceived, 500);
  }

  sendRequest();
  checkStatusAndUpdate();
}
