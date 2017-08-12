import hashStr from './hash'

let _id = 0
let cache = {}

const sheet = document.head.appendChild(document.createElement('style')).sheet
const insert = rule => sheet.insertRule(rule, sheet.cssRules.length)
const createRule = (className, properties, media) => {
  const rule = `.${className}{${properties}}`

  return media ? `${media}{${rule}}` : rule
}
const getSelector = str => str.match(/[&|@](.*?){/g)[0].replace(/{$/, '')
const getDeclaration = str => str.match(/{(.*?)}/)[1]
const getProperties = str => str
  .replace(/[&|@](.*?){(.*?)}/g, '') // remove selectors
  .split(/;/) // split properties
  .filter(Boolean)
  .join(';')
const parseSelector = str => ({
  selector: getSelector(str),
  props: getProperties(getDeclaration(str))
})
const generateName = str => `p${(_id++).toString(36)}`
const getValidAttributes = (props, el) => Object.keys(props)
  .filter(prop => prop in el)
  .reduce((all, attr) => {
    all[attr] = props[attr]
    return all
  }, {})

const css = (chunks, interpolations, props) =>
  chunks.map((chunk, i) =>
    interpolations[i] && typeof interpolations[i] === 'function'
      ? `${chunk}${interpolations[i](props || {})}`
      : interpolations[i]
        ? `${chunk}${interpolations[i]}`
        : chunk
  ).join('')

const parse = (rules, child = '', media) => {
  const inlineRules = rules.replace(/^\s+|\s+$|[\t\n\r]*/gm, '') // remove whitespace
  const selectors = inlineRules.match(/[&|@](.*?){(.*?)}/g) || []
  const properties = getProperties(rules)
  const hash = hashStr(rules)

  if (cache[hash]) return cache[hash]

  const className = generateName(hash)

  insert(createRule(className, properties))

  selectors
    .map(item => {
      let { selector, props } = parseSelector(item)
      let rule

      if (/^@/.test(selector)) {
        rule = createRule(className, props, selector)
      } else {
        selector = selector.replace(/^&/, className)
        rule = createRule(selector, props)
      }

      insert(rule)
    })

  cache[hash] = className

  return className
}

export default h => tag => (chunks, ...interpolations) => (props, children) => {
  props = props || {}

  const el = document.createElement(tag)
  const declarations = css(chunks, interpolations, props)
  const className = parse(declarations)
  const validAttributes = getValidAttributes(props, el)
  const data = Object.assign({}, validAttributes, {
    class: props.className ? `${props.className} ${className}` : className
  })

  return h(tag, data, children)
}
