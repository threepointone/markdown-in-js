import { name as packageName } from '../package.json'

import * as babylon from 'babylon'

import commonmark from 'commonmark'
import JSXRenderer from './jsx'


module.exports = {
  visitor: {
    Program: {
      enter(path) {
        let libName
        path.traverse({
          ImportDeclaration(path) {
            if (path.node.source.value === packageName) {
              const specifiers = path.get('specifiers')
              for (const specifier of specifiers) {
                if (specifier.isImportDefaultSpecifier()) {
                  libName = specifier.node.local.name
                  break
                }
                else if (specifier.isImportSpecifier() && specifier.node.imported.name === 'default') {
                  libName = specifier.node.local.name
                  break
                }
              }
            }
          },
          CallExpression(path) {
            if (!path.get('callee').isIdentifier() || path.node.callee.name !== 'require') {
              return
            }
            const args = path.get('arguments')
            const arg = args[0]
            if (!arg || !arg.isStringLiteral() || arg.node.value !== packageName) {
              return
            }
            const parent = path.parentPath()
            if (parent.isVariableDeclarator()) {
              const id = parent.get('id')
              if (id.isIdentifier()) {
                libName = id.name
              }
            }
            else if (parent.isAssignmentExpression()) {
              const id = parent.get('left')
              if (id.isIdentifier()) {
                libName = id.name
              }
            }
          }
        })


        if (!libName) {
          // the module is not required in this file.
          return
        }

        path.traverse({
          TaggedTemplateExpression(path) {

            let code = path.hub.file.code
            let tagName = path.node.tag.name
            if(path.node.tag.type === 'CallExpression') {
              tagName = path.node.tag.callee.name
            }

            if(tagName === libName) {
              let reader = new commonmark.Parser()
              let writer = new JSXRenderer()
              let stubs = path.node.quasi.expressions.map(x => code.substring(x.start, x.end))
              let stubCtx = stubs.reduce((o, stub, i) => (o['spur-' + i] = stub, o), {})
              let ctr = 0
              let strs = path.node.quasi.quasis.map(x => x.value.cooked)
              let src = strs.reduce((arr, str, i) => {
                arr.push(str)
                if(i !== stubs.length) {
                  arr.push('spur-'+ctr++)
                }
                return arr
              }, []).join('')
              let parsed = reader.parse(src)
              let intermediateSrc = writer.render(parsed)
              // replace with stubs
              let newSrc = intermediateSrc.replace(/spur\-[0-9]+/gm, x => `{${stubCtx[x]}}`)
              let transformed = babylon.parse(`${tagName}(${
                path.node.tag.type === 'CallExpression' ?
                  code.substring(path.node.tag.arguments[0].start, path.node.tag.arguments[0].end) + ', ' :
                  ''
                }_m_ => <div className='_markdown_'>${newSrc}</div>)`, { plugins: ['*']
                })
              path.replaceWith(transformed.program.body[0])
            }
          }
        })
      }
    }

  }
}

