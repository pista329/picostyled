import {
  hashString,
  getProperties,
  parseSelector,
  getValidAttributes,
  css
} from './utils'

let _id = 0
let cache = {}

const sheet = document.head.appendChild(document.createElement('style')).sheet
const insert = rule => sheet.insertRule(rule, sheet.cssRules.length)
const generateName = str => `p${(_id++).toString(36)}`
const createRule = (className, properties, media) => {
  const rule = `.${className}{${properties}}`

  return media ? `${media}{${rule}}` : rule
}

const parse = (rules, child = '', media) => {
  const inlineRules = rules.replace(/^\s+|\s+$|[\t\n\r]*/gm, '') // remove whitespace
  const selectors = inlineRules.match(/[&|@](.*?){(.*?)}/g) || []
  const properties = getProperties(inlineRules)
  const hash = hashString(rules)

  if (cache[hash]) return cache[hash]

  const className = generateName(hash)

  insert(createRule(className, properties))

  selectors.forEach(item => {
    let {selector, props} = parseSelector(item)

    if (/^@/.test(selector)) {
      insert(createRule(className, props, selector))
    } else {
      selector = selector.replace(/^&/, className)
      insert(createRule(selector, props))
    }
  })

  cache[hash] = className

  return className
}

export default h => tag => (chunks, ...interpolations) => (props, children) => {
  props = props || {}

  const className = parse(css(chunks, interpolations, props))
  const attributes = getValidAttributes(props, document.createElement(tag))

  const data = Object.assign({}, attributes, {
    class: [props.className, className].filter(Boolean).join(''),
    ref: props.innerRef || null
  })

  return h(tag, data, children)
}
