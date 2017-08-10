# Picostyled

> Lightweight styled components.

[![774B gzip][gzip-badge]][bundlesize]

[gzip-badge]: https://img.shields.io/badge/bundled%20&%20gzip-774%20B-brightgreen.svg
[bundlesize]: https://github.com/siddharthkp/bundlesize

## Features

- **🚀 Lightweight CSS in JS library**: Only 0.7 KB (bundled & gzipped)
- **💅 Styled components**: Returns styled components like [styled-components](https://www.styled-components.com/) that everyone loves :)
- **❤️ For Picodom**: [Picodom](https://github.com/picodom/picodom) is just 1 KB Virtual DOM builder and patch algorithm

```
$ npm install picostyled
```

## How to use

Picostyled works well with Media Queries (`@media`), Pseudo-element and Pseudo-classes (`:hover`).

```js
const themeColor = '#00897b'
const Text = styled('h1')`
  font-size: ${props => props.small ? '32px' : '64px'};
  cursor: pointer;
  color: white;
  margin: .1em 0;
  transition: all .2s ease-in-out;

  &:hover {
    transform: scale(1.3);
  }

  @media (max-width: 450px) {
    font-size: 32px;
  }
`

const Wrapper = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background-color: ${themeColor};
`

return (
  <Wrapper>
    <Text>{state.trim() === '' ? ':)' : state}</Text>
    <Text small>components</Text>
  </Wrapper>
)
```

Perfect example with Picodom and webpack is [here](https://github.com/idered/picostyled/tree/master/example).
