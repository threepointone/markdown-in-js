import React from 'react'
import renderer from 'react-test-renderer'
import markdown from '../../lib'

const App = () => markdown`
# Title

This test should fail, since we aren't using a babelrc with the plugin defined`

describe('markdown-in-js', () => {
  test('Throws error when plugin not in .babelrc', () => {
    expect(() => renderer.create(<App />)).toThrowError(
      "you forgot to add 'markdown-in-js/babel' to your babel plugins"
    )
  })
})
