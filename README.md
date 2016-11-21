markdown-in-js
---

zero-overhead markdown in your react components 

```jsx 
import markdown /* or `md` */ from 'markdown-in-js' 

const App = () => markdown`
## This is some content. 
You can write _markdown_ as you'd like. 

${ <span> interpolate more <Content/> </span> }

you can <i>inline *html*</i> or even <OtherComponents/>, wow

<div style=${{ fontWeight: 'bold' }} 
    className=${'some more styles'} 
    onClick=${handler}>
  interpolate attributes as expected
</div>
`
```

- gets compiled to react elements via a babel plugin
- preserves interpolations 
- built with [commonmark](https://github.com/jgm/commonmark.js)

You can use custom components like so - 
```jsx
import md from 'markdown-in-js'
import { MyHeading, MyLink } from './path/to/components'

const App = () => md({ h1: MyHeading, a: MyLink })`
# this will be a custom header
[custom link component](/url/to/link)
`
```

usage
---

- add `'markdown-in-js/babel'` to the `plugins` field of your babel config
- (optional) add [prismjs](http://prismjs.com/) for syntax highlighting of code blocks 


todo
---

- optionally no-wrap paragraphs 
- optionally return array of elements
- `@markdown <custom>` pragma
- tests!
