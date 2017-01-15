/**
 * marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */

export const re = {
  nptable: / *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/g,
  table: / *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/g
}

export const parseTable = (header, align, cells) => {
  const item = {
    header: header.replace(/^ *| *\| *$/g, '').split(/ *\| */),
    align: align.replace(/^ *|\| *$/g, '').split(/ *\| */),
    cells: cells.replace(/(?: *\| *)?\n$/, '').split('\n')
  }

  for (let i = 0; i < item.align.length; i++) {
    if (/^ *-+: *$/.test(item.align[i])) {
      item.align[i] = 'right'
    } else if (/^ *:-+: *$/.test(item.align[i])) {
      item.align[i] = 'center'
    } else if (/^ *:-+ *$/.test(item.align[i])) {
      item.align[i] = 'left'
    } else {
      item.align[i] = null
    }
  }

  for (let i = 0; i < item.cells.length; i++) {
    item.cells[i] = item.cells[i]
      .replace(/^ *\| *| *\| *$/g, '')
      .split(/ *\| */)
  }

  return item
}

export const parseNpTable = (header, align, cells) => {
  const item = {
    header: header.replace(/^ *| *\| *$/g, '').split(/ *\| */),
    align: align.replace(/^ *|\| *$/g, '').split(/ *\| */),
    cells: cells.replace(/\n$/, '').split('\n')
  }

  for (let i = 0; i < item.align.length; i++) {
    if (/^ *-+: *$/.test(item.align[i])) {
      item.align[i] = 'right'
    } else if (/^ *:-+: *$/.test(item.align[i])) {
      item.align[i] = 'center'
    } else if (/^ *:-+ *$/.test(item.align[i])) {
      item.align[i] = 'left'
    } else {
      item.align[i] = null
    }
  }

  for (let i = 0; i < item.cells.length; i++) {
    item.cells[i] = item.cells[i].split(/ *\| */)
  }

  return item
}
