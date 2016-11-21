export default class Renderer {
  render(ast) {
    let walker = ast.walker()
      , event
      , type

    this.buffer = ''
    this.lastOut = '\n'

    while((event = walker.next())) {
      type = event.node.type
      if (this[type]) {
        this[type](event.node, event.entering)
      }
      else {
        // console.log('missed', event.node.type)
      }
    }
    return this.buffer
  }

  /**
   *  Concatenate a literal string to the buffer.
   *
   *  @param str {String} The string to concatenate.
   */
  lit(str) {
    this.buffer += str
    this.lastOut = str
  }

  cr() {
    if (this.lastOut !== '\n') {
      this.lit('\n')
    }
  }

  /**
   *  Concatenate a string to the buffer possibly escaping the content.
   *
   *  Concrete renderer implementations should override this method.
   *
   *  @param str {String} The string to concatenate.
   */
  out(str) {
    this.lit(str)
  }

}

