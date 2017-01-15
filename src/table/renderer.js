// Create cell element with alignment
//
// The `align` attribute isn't valid, even though some markdown renderers use it.
// We can't use a style object prior to markdown parsing, and we can't use a
// style string in React. Instead, place a stub for alignment and swap after
// markdown parsing.
const renderCell = (type, align, value) => {
  if (align) {
    return `<spur-element-${type} spur-align-${align}>${value}</spur-element-${type}>`
  } else {
    return `<spur-element-${type}>${value}</spur-element-${type}>`
  }
}

// Render gfm table markdown to HTML
//
// Use placeholder elements so that we can replace with _m_.element. We can't
// use _m_ directly here, since it isn't a valid HTML tag and will get encoded
// during markdown parsing
export default ({ header, align, cells }) => {
  let str = ''

  str += '<spur-element-table>'
  str += '<spur-element-thead>'
  str += '<spur-element-tr>'
  str += header.map((value, i) => renderCell('th', align[i], value)).join('')
  str += '</spur-element-tr>'
  str += '</spur-element-thead>'
  str += '<spur-element-tbody>'

  for (let i = 0; i < cells.length; i++) {
    str += '<spur-element-tr>'
    str += cells[i].map((value, j) => renderCell('td', align[j], value)).join('')
    str += '</spur-element-tr>'
  }

  str += '</spur-element-tbody>'
  str += '</spur-element-table>'

  // Keep table in a separate block from subsequent markdown
  str += '\n\n'

  return str
}
