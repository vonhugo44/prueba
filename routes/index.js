/* jshint node: true */
'use strict';

var express = require('express');
var router = express.Router();

var SignalR = require('signalr-client');
var srClient = new SignalR.client('http://25.191.61.92:5050/signalR', ['Hubsync']);

var socket = io();

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'SignalR'
  });
});

router.get('/request-att', function (req, res, next) {

  /* Request an attention number */
    var d1 = Math.round(new Date()).getTime() / 1000);
    socket.emit('ticket-push');
    console.log('pushing a ticket at : ' + d1 + ' (unixtime)');
    
  srClient.invoke('Hubsync', 'SolicitarAtencion', {
    id_totem:    '000001',
    id_sucursal: '000002',
    id_servicio: '000003',
    id_cliente:  '000004'
  });

  /* Receive the attention details */
  srClient.on('Hubsync', 'IndicarTurno', function (data) {
    res.send({
      turn: data.turno,
      eta: data.eta
    });
  });

  //  res.send('Hi!');

});

module.exports = router;

