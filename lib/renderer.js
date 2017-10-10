'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Renderer = function () {
  function Renderer() {
    _classCallCheck(this, Renderer);
  }

  _createClass(Renderer, [{
    key: 'render',
    value: function render(ast) {
      var walker = ast.walker(),
          event = void 0,
          type = void 0;

      this.buffer = '';
      this.lastOut = '\n';

      while (event = walker.next()) {
        type = event.node.type;
        if (this[type]) {
          this[type](event.node, event.entering);
        } else {
          // console.log('missed', event.node.type)
        }
      }
      return this.buffer;
    }

    /**
     *  Concatenate a literal string to the buffer.
     *
     *  @param str {String} The string to concatenate.
     */

  }, {
    key: 'lit',
    value: function lit(str) {
      this.buffer += str;
      this.lastOut = str;
    }
  }, {
    key: 'cr',
    value: function cr() {
      if (this.lastOut !== '\n') {
        this.lit('\n');
      }
    }

    /**
     *  Concatenate a string to the buffer possibly escaping the content.
     *
     *  Concrete renderer implementations should override this method.
     *
     *  @param str {String} The string to concatenate.
     */

  }, {
    key: 'out',
    value: function out(str) {
      this.lit(str);
    }
  }]);

  return Renderer;
}();

exports.default = Renderer;