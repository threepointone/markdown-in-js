import React from 'react'
import { render } from 'react-dom'

import md from 'markdown-in-js'

function log() {
  console.log(this) //eslint-disable-line
  return this
}

const App = () => md({
  h1: 'h2',
  th: ({ children, style }) =>
    <th style={{ ...style, fontWeight: 'bold' }}>{children}</th>
})`
# title

This is some text <span style=${{ fontWeight: 'bold' }}> we _here_ </span>

This is more text. And some more. And more.
\`\`\`jsx
let x = alpha
function xyz(){

}
\`\`\`

here's some \`inline code\`

${'I interpolated some text here'}

and <span style=${{ fontWeight: 'bold' }} className=${'someclasssomething else'}>
this is some inline _italicized_ *bold* html
and this bit is _${'interpolated'}_
</span>

and <span> what about _this_ </span>

This is an H1
=============

This is an H2
-------------

# This is an H1

## This is an H2

###### This is an H6

Table

| Left-aligned | Center-aligned | Right-aligned |
| :---         |     :---:      |          ---: |
| git status   | git status     | git status    |
| git diff     | git diff       | git diff      |

Table without pipes

Markdown | Less | Pretty
--- | --- | ---
*Still* | \`renders\` | **nicely**
1 | <span style=${{ fontWeight: 'bold' }}>2</span> | 3

`::log()


render(<App/>, window.app)

