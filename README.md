markdown-in-js
---

zero-overhead markdown in your react components 

```jsx 
const App = () => markdown`
## This is some content. 

${ <span> interpolate more <Content/> </span> }

you can <i>inline *html*</i>
<div style=${{fontWeight: 'bold'}} className=${'some more styles'} onClick=${handler}>
  interpolate attributes as expected
</div>
`

- gets compiled to react elements via a babel plugin
- preserves interpolations 
- built with [commonmark](https://github.com/jgm/commonmark.js)

usage
---
add `'markdown-in-js/babel'` to the `plugins` field of your babel config


todo
---
- optionally no-wrap paragraphs 
- custom components for markdown primitives  
- `@markdown <custom>` pragma
- tests!
