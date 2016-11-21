import React from 'react'
import { render } from 'react-dom'

import markdown from '../src' // so the linter won't complain

const App = () => markdown`
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

and <p> what about _this_ </p>

This is an H1
=============

This is an H2
-------------

# This is an H1

## This is an H2

###### This is an H6
`


render(<App/>, window.app)

