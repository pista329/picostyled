import { h } from 'picodom'
import hashStr from './hash'

let _id = 0
let cache = {}

const sheet = document.head.appendChild(document.createElement('style')).sheet
const insert = rule => sheet.insertRule(rule, sheet.cssRules.length)

const createRule = (className, properties, media) => {
  const rule = `.${className}{${properties}}`

  return media ? `${media}{${rule}}` : rule
}

const replaceWhitespace = str => str.replace(/\s|\\n/g, '')
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

const css = (chunks, interpolations, props) =>
  chunks.map((chunk, i) =>
    interpolations[i] && typeof interpolations[i] === 'function'
      ? `${chunk}${interpolations[i](props || {})}`
      : interpolations[i]
      ? `${chunk}${interpolations[i]}`
      : chunk
  ).join('')

const createBaseClass = (properties, selector, media) => {
  return className
}

const parse = (rules, child = '', media) => {
  const inlineRules = rules.replace(/^\s+|\s+$|[\t\n\r]*/gm, '') // remove whitespace
  const selectors = inlineRules.match(/&(.*?){(.*?)}/g) || []
  const queries = inlineRules.match(/@(.*?){(.*?)}/g) || []
  const properties = getProperties(rules)

  const hash = hashStr(rules)

  if (cache[hash]) return cache[hash]

  const className = generateName(hash)

  insert(createRule(className, properties))

  cache[hash] = className

  selectors
    .map(item => {
      let { selector, props } = parseSelector(item)

      selector = selector.replace(/^&/, className)

      insert(createRule(selector, props))
    })

  queries
    .map(item => {
      let { selector, props } = parseSelector(item)

      insert(createRule(className, props, selector))
    })

  return className
}

export default tag => (decls, ...interpolations) => (props, children) => {
  const declarations = css(decls, interpolations, props)

  return h(tag, { class: parse(declarations) }, children)
}
