import React from 'react'
import { render } from 'react-dom'

import markdown from '../src' // so the linter won't complain

const App = () => <div>hello world</div>

render(<App/>, window.app)

// let x = md `here`

let x = markdown`
This is some text <span style=${{ fontWeight: 'bold' }}> we _here_ </span>

This is more text. And some more. And more. 

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
