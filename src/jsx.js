import Renderer from './renderer'

import { escapeXml as esc } from 'commonmark/lib/common'

let reUnsafeProtocol = /^javascript:|vbscript:|file:|data:/i
let reSafeDataProtocol = /^data:image\/(?:png|gif|jpeg|webp)/i

let potentiallyUnsafe = url => 
  reUnsafeProtocol.test(url) &&
  !reSafeDataProtocol.test(url)


export default class JSXRenderer extends Renderer {
  constructor(options) {
    super(options)
    options = options || {}
    // by default, soft breaks are rendered as newlines in HTML
    options.softbreak = options.softbreak || '\n'
    // set to "<br />" to make them hard breaks
    // set to " " if you want to ignore line wrapping in source

    this.disableTags = 0
    this.lastOut = '\n'
    this.options = options
  }

  tag(name, attrs, selfclosing) {
    if (this.disableTags > 0) {
      return
    }
    this.buffer += ('<' + name)
    if (attrs && attrs.length > 0) {
      let i = 0
      let attrib
      while ((attrib = attrs[i]) !== undefined) {
        this.buffer += (' ' + attrib[0] + '="' + attrib[1] + '"')
        i++
      }
    }
    if (selfclosing) {
      this.buffer += ' /'
    }
    this.buffer += '>'
    this.lastOut = '>'
  }


  /* Node methods */

  text(node) {
    this.out(node.literal)
  }

  softbreak() {
    this.lit(this.options.softbreak)
  }

  linebreak() {
    this.tag('_m_.br', [], true)
    this.cr()
  }

  link(node, entering) {
    let attrs = this.attrs(node)
    if (entering) {
      if (!(this.options.safe && potentiallyUnsafe(node.destination))) {
        attrs.push([ 'href', esc(node.destination, true) ])
      }
      if (node.title) {
        attrs.push([ 'title', esc(node.title, true) ])
      }
      this.tag('_m_.a', attrs)
    } else {
      this.tag('/_m_.a')
    }
  }

  image(node, entering) {
    if (entering) {
      if (this.disableTags === 0) {
        if (this.options.safe && potentiallyUnsafe(node.destination)) {
          this.lit('<_m_.img src="" alt="')
        } else {
          this.lit('<_m_.img src="' + esc(node.destination, true) +
                '" alt="')
        }
      }
      this.disableTags += 1
    } else {
      this.disableTags -= 1
      if (this.disableTags === 0) {
        if (node.title) {
          this.lit('" title="' + esc(node.title, true))
        }
        this.lit('" />')
      }
    }
  }

  emph(node, entering) {
    this.tag(entering ? '_m_.em' : '/_m_.em')
  }

  strong(node, entering) {
    this.tag(entering ? '_m_.strong' : '/_m_.strong')
  }

  paragraph(node, entering) {
    let grandparent = node.parent.parent
      , attrs = this.attrs(node)
    if (grandparent !== null &&
        grandparent.type === 'list') {
      if (grandparent.listTight) {
        return
      }
    }
    if (entering) {
      this.cr()
      this.tag('_m_.p', attrs)
    } else {
      this.tag('/_m_.p')
      this.cr()
    }
  }

  heading(node, entering) {
    let tagname = '_m_.h' + node.level
      , attrs = this.attrs(node)
    if (entering) {
      this.cr()
      this.tag(tagname, attrs)
    } else {
      this.tag('/' + tagname)
      this.cr()
    }
  }

  code(node) {
    this.tag('_m_.code')
    this.out(node.literal)
    this.tag('/_m_.code')
  }

  code_block(node) {

    let info_words = node.info ? node.info.split(/\s+/) : []
      , attrs = this.attrs(node)
    if (info_words.length > 0 && info_words[0].length > 0) {
      attrs.push([ 'className', 'language-' + esc(info_words[0], true) ])
    }
    this.cr()
    this.tag('_m_.pre')
    this.tag('_m_.code', attrs)
    this.lit(`{\`${node.literal}\`}`, false)
    this.tag('/_m_.code')
    this.tag('/_m_.pre')
    this.cr()
  }

  thematic_break(node) {
    let attrs = this.attrs(node)
    this.cr()
    this.tag('_m_.hr', attrs, true)
    this.cr()
  }

  block_quote(node, entering) {
    let attrs = this.attrs(node)
    if (entering) {
      this.cr()
      this.tag('_m_.blockquote', attrs)
      this.cr()
    } else {
      this.cr()
      this.tag('/_m_.blockquote')
      this.cr()
    }
  }

  list(node, entering) {
    let tagname = node.listType === 'bullet' ? 'ul' : 'ol'
      , attrs = this.attrs(node)

    if (entering) {
      let start = node.listStart
      if (start !== null && start !== 1) {
        attrs.push([ 'start', start.toString() ])
      }
      this.cr()
      this.tag('_m_.' + tagname, attrs)
      this.cr()
    } else {
      this.cr()
      this.tag('/_m_.' + tagname)
      this.cr()
    }
  }

  item(node, entering) {
    let attrs = this.attrs(node)
    if (entering) {
      this.tag('_m_.li', attrs)
    } else {
      this.tag('/_m_.li')
      this.cr()
    }
  }

  html_inline(node) {
    if (this.options.safe) {
      this.lit('<!-- raw HTML omitted -->')
    } else {
      this.lit(node.literal)
    }
  }

  html_block(node) {
    this.cr()
    if (this.options.safe) {
      this.lit('<!-- raw HTML omitted -->')
    } else {
      this.lit(node.literal)
    }
    this.cr()
  }

  custom_inline(node, entering) {
    if (entering && node.onEnter) {
      this.lit(node.onEnter)
    } else if (!entering && node.onExit) {
      this.lit(node.onExit)
    }
  }

  custom_block(node, entering) {    
    this.cr()
    if (entering && node.onEnter) {
      this.lit(node.onEnter)
    } else if (!entering && node.onExit) {
      this.lit(node.onExit)
    }
    this.cr()
  }

  /* Helper methods */

  out(s) {
    this.lit(esc(s, false))
  }

  attrs(node) {
    let att = []
    if (this.options.sourcepos) {
      let pos = node.sourcepos
      if (pos) {
        att.push([ 'data-sourcepos', String(pos[0][0]) + ':' +
                        String(pos[0][1]) + '-' + String(pos[1][0]) + ':' +
                        String(pos[1][1]) ])
      }
    }
    return att
  }

}

