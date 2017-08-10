import {h, patch} from 'picodom'
import picostyled from '../'

const styled = picostyled(h)
let element, oldNode

function render(newNode) {
  return (element = patch(
    document.body,
    element,
    oldNode,
    (oldNode = newNode)
  ))
}

function view(state) {
  const keyColor = '#f07';

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
    background-color: ${keyColor};
  `

  return (
    <Wrapper>
      <Text>{state.trim() === '' ? ':)' : state}</Text>
      <Text small>components</Text>
    </Wrapper>
  )
}

render(view('picostyled'))
