import "twin.macro"
import Skeleton from "react-loading-skeleton"

import { Container, Column, ColumnHeader, ColumnBody, List } from "./styles"

const PlaceholderItem = () => (
  <li tw="flex justify-between items-center mb-2">
    <div tw="flex-grow mr-4">
      <Skeleton height={20} />
    </div>
    <div>
      <Skeleton circle width={40} height={40} />
    </div>
  </li>
)

const PlaceholderColumn = () => (
  <Container>
    <Column>
      <ColumnHeader>
        <div tw="flex-grow m-2 p-2">
          <Skeleton height={30} />
        </div>
      </ColumnHeader>

      <ColumnBody>
        <List>
          <PlaceholderItem />
          <PlaceholderItem />
          <PlaceholderItem />
        </List>
      </ColumnBody>
    </Column>
  </Container>
)

export default PlaceholderColumn
