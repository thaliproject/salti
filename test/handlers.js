'use strict';

var colors = require('colors');

module.exports =

[function (req, res) {
  console.log(colors.green('\tin the handler for get'));
  res.status(200).json({ message: 'you made it' });
  // next();
}, function (req, res) {
  console.log(colors.green('\tin the post handler'));
  res.status(200).json({ name: 'you made it' });
  // next();
}, function (req, res) {
  console.log(colors.green('\tin the put handler'));
  res.status(200).json({ name: 'you made it' });
  // next();
}];
