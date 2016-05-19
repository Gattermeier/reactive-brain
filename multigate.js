'use strict';
// Reactive Implementation of MultiGate Forwardcircuit with Backward Propagation of Gradients
// Based on: http://karpathy.github.io/neuralnets/

var Rx = require('rx');
var EventEmitter = require('events').EventEmitter;

// Default inputs
var inputs = {
  x: -2,
  y: 5,
  z: -4,
  h: 0.001
}

// Helper Functions
var forwardMultiplyGate = (a, b) => {
  return a * b;
};

var forwardAddGate = (a, b) => {
  return a + b;
};

var backwardPropagation = (data) => {
  // derivate of multiplyGate wrt its inputs
  var derivative_f_wrt_z = data.q;
  var derivative_f_wrt_q = data.z;

  // derivative of the addGate wrt its inputs
  var derivative_q_wrt_x = 1.0;
  var derivative_q_wrt_y = 1.0;

  // chain derivates
  var derivative_f_wrt_x = derivative_q_wrt_x * derivative_f_wrt_q;
  var derivative_f_wrt_y = derivative_q_wrt_y * derivative_f_wrt_q;
  data.x = data.x + data.h * derivative_f_wrt_x;
  data.y = data.y + data.h * derivative_f_wrt_y;
  data.z = data.z + data.h * derivative_f_wrt_z;
  return data
};

// Reactive Implementation of Circuit

var inputEmitter = new EventEmitter();
var circuit = Rx.Observable.fromEvent(inputEmitter, 'data');

var circuit = circuit.map(data => { // addGate
    data = data || inputs; // defaults
    data.q = forwardAddGate(data.x, data.y);
    return data
  })
  .map(data => { // multiplyGate
    data.f = forwardMultiplyGate(data.q, data.z);
    return data
  })
  .map(data => { // backward Propagation
    inputs = backwardPropagation(data);
    return inputs
  });

circuit.subscribe((data) => {
  console.log(data);
});

inputEmitter.emit('data', inputs);
inputEmitter.emit('data', inputs);
inputEmitter.emit('data', inputs);
