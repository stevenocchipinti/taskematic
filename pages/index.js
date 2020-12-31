import tw from "twin.macro"

const Wrapper = tw.div`flex bg-gray-50 min-h-screen`
const Column = tw.div``
const List = tw.ul`rounded-lg shadow m-4 overflow-hidden`
const Item = tw.li`p-4 w-64 border-b last:border-0 bg-white text-gray-600`

const App = () => (
  <Wrapper>
    <Column>
      <List>
        <Item>Foo</Item>
        <Item>Bar</Item>
        <Item>Baz</Item>
      </List>
    </Column>
    <Column>
      <List>
        <Item>Foo</Item>
        <Item>Bar</Item>
        <Item>Baz</Item>
      </List>
    </Column>
  </Wrapper>
)

export default App
