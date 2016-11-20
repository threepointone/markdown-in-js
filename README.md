markdown-in-js
---

zero-overhead markdown in your react components 

```jsx 
const App = () => markdown`
## This is some content. 
You can write _markdown_ as you'd like. 

${ <span> interpolate more <Content/> </span> }

you can <i>inline *html*</i>
<div style=${{fontWeight: 'bold'}} className=${'some more styles'} onClick=${handler}>
  interpolate attributes as expected
</div>
`
```

- gets compiled to react elements via a babel plugin
- preserves interpolations 
- built with [commonmark](https://github.com/jgm/commonmark.js)

usage
---
add `'markdown-in-js/lib/babel'` to the `plugins` field of your babel config


todo
---

- code highlighting via prism.js
- optionally no-wrap paragraphs 
- optionally return array of elements
- custom components for markdown primitives  
- `@markdown <custom>` pragma
- tests!
