'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var markdown = function markdown(o, fn) {
  if (o.length >= 0 && o.raw || fn && fn.length && fn.raw) {
    throw new Error('you forgot to add \'markdown-in-js/babel\' to your babel plugins');
  }
  if (typeof o === 'function') {
    return markdown({}, o);
  }
  if (!fn) {
    return function (nextFn) {
      return markdown(o, nextFn);
    };
  }
  if (typeof fn === 'function') {
    return fn(_extends({
      'br': 'br', 'a': 'a', 'img': 'img', 'em': 'em', 'strong': 'strong', 'p': 'p',
      'h1': 'h1', 'h2': 'h2', 'h3': 'h3', 'h4': 'h4', 'h5': 'h5', 'h6': 'h6',
      'code': 'code', 'pre': 'pre', 'hr': 'hr', 'blockquote': 'blockquote',
      'ul': 'ul', 'ol': 'ol', 'li': 'li' }, o));
  }
};

module.exports = markdown;