'use strict';

var _package = require('../package.json');

var _babylon = require('babylon');

var babylon = _interopRequireWildcard(_babylon);

var _commonmark = require('commonmark');

var _commonmark2 = _interopRequireDefault(_commonmark);

var _jsx = require('./jsx');

var _jsx2 = _interopRequireDefault(_jsx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

module.exports = {
  visitor: {
    Program: {
      enter: function enter(path) {
        var libName = void 0;
        path.traverse({
          ImportDeclaration: function ImportDeclaration(path) {
            if (path.node.source.value === _package.name) {
              var specifiers = path.get('specifiers');
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                for (var _iterator = specifiers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var specifier = _step.value;

                  if (specifier.isImportDefaultSpecifier()) {
                    libName = specifier.node.local.name;
                    break;
                  } else if (specifier.isImportSpecifier() && specifier.node.imported.name === 'default') {
                    libName = specifier.node.local.name;
                    break;
                  }
                }
              } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                  }
                } finally {
                  if (_didIteratorError) {
                    throw _iteratorError;
                  }
                }
              }
            }
          },
          CallExpression: function CallExpression(path) {
            if (!path.get('callee').isIdentifier() || path.node.callee.name !== 'require') {
              return;
            }
            var args = path.get('arguments');
            var arg = args[0];
            if (!arg || !arg.isStringLiteral() || arg.node.value !== _package.name) {
              return;
            }
            var parent = path.parentPath();
            if (parent.isVariableDeclarator()) {
              var id = parent.get('id');
              if (id.isIdentifier()) {
                libName = id.name;
              }
            } else if (parent.isAssignmentExpression()) {
              var _id = parent.get('left');
              if (_id.isIdentifier()) {
                libName = _id.name;
              }
            }
          }
        });

        if (!libName) {
          // the module is not required in this file.
          return;
        }

        path.traverse({
          TaggedTemplateExpression: function TaggedTemplateExpression(path) {

            var code = path.hub.file.code;
            var tagName = path.node.tag.name;
            if (path.node.tag.type === 'CallExpression') {
              tagName = path.node.tag.callee.name;
            }

            if (tagName === libName) {
              (function () {
                var reader = new _commonmark2.default.Parser();
                var writer = new _jsx2.default();
                var stubs = path.node.quasi.expressions.map(function (x) {
                  return code.substring(x.start, x.end);
                });
                var stubCtx = stubs.reduce(function (o, stub, i) {
                  return o['spur-' + i] = stub, o;
                }, {});
                var ctr = 0;
                var strs = path.node.quasi.quasis.map(function (x) {
                  return x.value.cooked;
                });
                var src = strs.reduce(function (arr, str, i) {
                  arr.push(str);
                  if (i !== stubs.length) {
                    arr.push('spur-' + ctr++);
                  }
                  return arr;
                }, []).join('');
                var parsed = reader.parse(src);
                var intermediateSrc = writer.render(parsed);
                // replace with stubs
                var newSrc = intermediateSrc.replace(/spur\-[0-9]+/gm, function (x) {
                  return '{' + stubCtx[x] + '}';
                });
                var transformed = babylon.parse(tagName + '(' + (path.node.tag.type === 'CallExpression' ? code.substring(path.node.tag.arguments[0].start, path.node.tag.arguments[0].end) + ', ' : '') + '_m_ => <div className=\'_markdown_\'>' + newSrc + '</div>)', { plugins: ['*']
                });
                path.replaceWith(transformed.program.body[0]);
              })();
            }
          }
        });
      }
    }

  }
};