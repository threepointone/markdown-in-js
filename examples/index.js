import React from 'react'
import { render } from 'react-dom'

import md from '../src' 

function log() {
  console.log(this) //eslint-disable-line
  return this 
}

const App = () => md({ h1: 'h2' })`
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
`::log()


render(<App/>, window.app)

