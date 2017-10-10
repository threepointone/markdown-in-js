'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _renderer = require('./renderer');

var _renderer2 = _interopRequireDefault(_renderer);

var _common = require('commonmark/lib/common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var reUnsafeProtocol = /^javascript:|vbscript:|file:|data:/i;
var reSafeDataProtocol = /^data:image\/(?:png|gif|jpeg|webp)/i;

var potentiallyUnsafe = function potentiallyUnsafe(url) {
  return reUnsafeProtocol.test(url) && !reSafeDataProtocol.test(url);
};

var JSXRenderer = function (_Renderer) {
  _inherits(JSXRenderer, _Renderer);

  function JSXRenderer(options) {
    _classCallCheck(this, JSXRenderer);

    var _this = _possibleConstructorReturn(this, (JSXRenderer.__proto__ || Object.getPrototypeOf(JSXRenderer)).call(this, options));

    options = options || {};
    // by default, soft breaks are rendered as newlines in HTML
    options.softbreak = options.softbreak || '\n';
    // set to "<br />" to make them hard breaks
    // set to " " if you want to ignore line wrapping in source

    _this.disableTags = 0;
    _this.lastOut = '\n';
    _this.options = options;
    return _this;
  }

  _createClass(JSXRenderer, [{
    key: 'tag',
    value: function tag(name, attrs, selfclosing) {
      if (this.disableTags > 0) {
        return;
      }
      this.buffer += '<' + name;
      if (attrs && attrs.length > 0) {
        var i = 0;
        var attrib = void 0;
        while ((attrib = attrs[i]) !== undefined) {
          this.buffer += ' ' + attrib[0] + '="' + attrib[1] + '"';
          i++;
        }
      }
      if (selfclosing) {
        this.buffer += ' /';
      }
      this.buffer += '>';
      this.lastOut = '>';
    }

    /* Node methods */

  }, {
    key: 'text',
    value: function text(node) {
      this.codeAwareOut(node.literal, false);
    }
  }, {
    key: 'softbreak',
    value: function softbreak() {
      this.lit(this.options.softbreak);
    }
  }, {
    key: 'linebreak',
    value: function linebreak() {
      this.tag('_m_.br', [], true);
      this.cr();
    }
  }, {
    key: 'link',
    value: function link(node, entering) {
      var attrs = this.attrs(node);
      if (entering) {
        if (!(this.options.safe && potentiallyUnsafe(node.destination))) {
          attrs.push(['href', (0, _common.escapeXml)(node.destination, true)]);
        }
        if (node.title) {
          attrs.push(['title', (0, _common.escapeXml)(node.title, true)]);
        }
        this.tag('_m_.a', attrs);
      } else {
        this.tag('/_m_.a');
      }
    }
  }, {
    key: 'image',
    value: function image(node, entering) {
      if (entering) {
        if (this.disableTags === 0) {
          if (this.options.safe && potentiallyUnsafe(node.destination)) {
            this.lit('<_m_.img src="" alt="');
          } else {
            this.lit('<_m_.img src="' + (0, _common.escapeXml)(node.destination, true) + '" alt="');
          }
        }
        this.disableTags += 1;
      } else {
        this.disableTags -= 1;
        if (this.disableTags === 0) {
          if (node.title) {
            this.lit('" title="' + (0, _common.escapeXml)(node.title, true));
          }
          this.lit('" />');
        }
      }
    }
  }, {
    key: 'emph',
    value: function emph(node, entering) {
      this.tag(entering ? '_m_.em' : '/_m_.em');
    }
  }, {
    key: 'strong',
    value: function strong(node, entering) {
      this.tag(entering ? '_m_.strong' : '/_m_.strong');
    }
  }, {
    key: 'paragraph',
    value: function paragraph(node, entering) {
      var grandparent = node.parent.parent,
          attrs = this.attrs(node);
      if (grandparent !== null && grandparent.type === 'list') {
        if (grandparent.listTight) {
          return;
        }
      }
      if (entering) {
        this.cr();
        this.tag('_m_.p', attrs);
      } else {
        this.tag('/_m_.p');
        this.cr();
      }
    }
  }, {
    key: 'heading',
    value: function heading(node, entering) {
      var tagname = '_m_.h' + node.level,
          attrs = this.attrs(node);
      if (entering) {
        this.cr();
        this.tag(tagname, attrs);
      } else {
        this.tag('/' + tagname);
        this.cr();
      }
    }
  }, {
    key: 'code',
    value: function code(node) {
      this.tag('_m_.code');
      this.codeAwareOut('{`' + node.literal + '`}', true);
      this.tag('/_m_.code');
    }
  }, {
    key: 'code_block',
    value: function code_block(node) {

      var info_words = node.info ? node.info.split(/\s+/) : [],
          attrs = this.attrs(node);
      if (info_words.length > 0 && info_words[0].length > 0) {
        attrs.push(['className', 'language-' + (0, _common.escapeXml)(info_words[0], true)]);
      }
      this.cr();
      this.tag('_m_.pre');
      this.tag('_m_.code', attrs);
      this.codeAwareOut('{`' + node.literal + '`}', true);
      this.tag('/_m_.code');
      this.tag('/_m_.pre');
      this.cr();
    }
  }, {
    key: 'thematic_break',
    value: function thematic_break(node) {
      var attrs = this.attrs(node);
      this.cr();
      this.tag('_m_.hr', attrs, true);
      this.cr();
    }
  }, {
    key: 'block_quote',
    value: function block_quote(node, entering) {
      var attrs = this.attrs(node);
      if (entering) {
        this.cr();
        this.tag('_m_.blockquote', attrs);
        this.cr();
      } else {
        this.cr();
        this.tag('/_m_.blockquote');
        this.cr();
      }
    }
  }, {
    key: 'list',
    value: function list(node, entering) {
      var tagname = node.listType === 'bullet' ? 'ul' : 'ol',
          attrs = this.attrs(node);

      if (entering) {
        var start = node.listStart;
        if (start !== null && start !== 1) {
          attrs.push(['start', start.toString()]);
        }
        this.cr();
        this.tag('_m_.' + tagname, attrs);
        this.cr();
      } else {
        this.cr();
        this.tag('/_m_.' + tagname);
        this.cr();
      }
    }
  }, {
    key: 'item',
    value: function item(node, entering) {
      var attrs = this.attrs(node);
      if (entering) {
        this.tag('_m_.li', attrs);
      } else {
        this.tag('/_m_.li');
        this.cr();
      }
    }
  }, {
    key: 'html_inline',
    value: function html_inline(node) {
      if (this.options.safe) {
        this.lit('<!-- raw HTML omitted -->');
      } else {
        this.lit(node.literal);
      }
    }
  }, {
    key: 'html_block',
    value: function html_block(node) {
      this.cr();
      if (this.options.safe) {
        this.lit('<!-- raw HTML omitted -->');
      } else {
        this.lit(node.literal);
      }
      this.cr();
    }
  }, {
    key: 'custom_inline',
    value: function custom_inline(node, entering) {
      if (entering && node.onEnter) {
        this.lit(node.onEnter);
      } else if (!entering && node.onExit) {
        this.lit(node.onExit);
      }
    }
  }, {
    key: 'custom_block',
    value: function custom_block(node, entering) {
      this.cr();
      if (entering && node.onEnter) {
        this.lit(node.onEnter);
      } else if (!entering && node.onExit) {
        this.lit(node.onExit);
      }
      this.cr();
    }

    /* Helper methods */

  }, {
    key: 'codeAwareOut',
    value: function codeAwareOut(s, isCode) {
      isCode ? this.out(s) : this.out((0, _common.escapeXml)(s, false));
    }
  }, {
    key: 'out',
    value: function out(s) {
      this.lit(s);
    }
  }, {
    key: 'attrs',
    value: function attrs(node) {
      var att = [];
      if (this.options.sourcepos) {
        var pos = node.sourcepos;
        if (pos) {
          att.push(['data-sourcepos', String(pos[0][0]) + ':' + String(pos[0][1]) + '-' + String(pos[1][0]) + ':' + String(pos[1][1])]);
        }
      }
      return att;
    }
  }]);

  return JSXRenderer;
}(_renderer2.default);

exports.default = JSXRenderer;