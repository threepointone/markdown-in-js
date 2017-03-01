import React from 'react'
import renderer from 'react-test-renderer'
import markdown from '../../lib'

const App = () => markdown`
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
`

describe('markdown-in-js', () => {
  test('Markdown correctly compiles', () => {
    const component = renderer.create(<App />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
