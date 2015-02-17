/* jshint browser: true */
/* global console */

(function (document, console, XMLHttpRequest) {
  'use strict';

  var main = document.querySelector('main'),
      menu = main.innerHTML,
      generating = document.querySelector('template#generating').innerHTML,
      success = document.querySelector('template#success').innerHTML,
      error = document.querySelector('template#error').innerHTML;

  window.gohome = function () {
    main.className = 'menu';
    main.innerHTML = menu;
  };

  window.requestAtt = function () {
    var frag = document.createElement('div'),
        http = new XMLHttpRequest(),
        diff = Date.now(),
        timeout = setTimeout(function () 
        {
          http.abort();

          frag.innerHTML = error;
          frag.querySelector('h1').innerHTML = "Hubo un problema con la conexión.";

          main.className('error');
          main.innerHTML = frag;
        }, 30000);

    main.className = 'generating';
    main.innerHTML = generating;

    http.addEventListener('readystatechange', function () {
      if (http.readyState === 4) {
        diff = Date.now() - diff;

        clearTimeout(timeout); 

        if (http.status > 199 && http.status < 400) 
        {
          var json = JSON.parse(http.responseText);
          frag.innerHTML = success;

          frag.querySelector('h1').innerHTML = json.turn;
          frag.querySelector('h2').innerHTML = json.eta;

          main.className = 'attention';
          main.innerHTML = frag.innerHTML;
        } 
        else 
        {
          frag.innerHTML = error;
          frag.querySelector('h1').innerHTML = "No se pudo obtener su número";

          main.className = 'error';
          main.innerHTML = frag.innerHTML;
        }
      }
    }, false);

    http.open('GET', '/request-att', true);
    http.send();
  };

}(document, console, XMLHttpRequest));