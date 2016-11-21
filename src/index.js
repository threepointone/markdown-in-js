const markdown = (o, fn) => {
  if((o.length >= 0 && o.raw) || (fn && fn.length && fn.raw)) {
    throw new Error('you forgot to add \'markdown-in-js/babel\' to your babel plugins')  
  } 
  if(typeof o === 'function') {
    return markdown({}, o)
  }
  if(!fn) {
    return nextFn => markdown(o, nextFn) 
  }
  if(typeof fn === 'function') {
    return fn({
      'br': 'br', 'a': 'a', 'img': 'img', 'em': 'em', 'strong': 'strong', 'p': 'p',
      'h1': 'h1', 'h2': 'h2', 'h3': 'h3', 'h4': 'h4', 'h5': 'h5', 'h6': 'h6',
      'code': 'code', 'pre': 'pre', 'hr': 'hr', 'blockquote': 'blockquote',
      'ul': 'ul', 'ol': 'ol', 'li': 'li', ...o
    })
  }
  
}

module.exports = markdown
