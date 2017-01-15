import { re, parseTable, parseNpTable } from './parser'
import render from './renderer'

export const replaceTablesWithHTML = src => src
  .replace(re.table, (match, ...capture) => render(parseTable(...capture)))
  .replace(re.nptable, (match, ...capture) => render(parseNpTable(...capture)))

export const replaceTableStubs = src => src
  .replace(/spur\-element\-([a-zA-Z])/gm, (x, element) => `_m_.${element}`)
  .replace(/spur\-align\-(left|right|center)/gm, (x, align) => `style={{textAlign: '${align}'}}`)
