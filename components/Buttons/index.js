import tw, { styled } from "twin.macro"
import Loader from "../icons/Loader"

const Button = styled.button`
  ${tw`rounded-lg text-white text-center`}

  @media (prefers-reduced-motion: no-preference) {
    transition: box-shadow 0.2s;
  }

  :focus {
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.5);
    outline: none;
  }

  :disabled {
    ${tw`opacity-75 text-gray-300`}
  }
`

const GradientButton = styled(Button)`
  background-image: linear-gradient(
    45deg,
    #e96443 0%,
    #904e95 51%,
    #e96443 100%
  );
  padding: 1rem 3rem;
  text-transform: uppercase;
  background-size: 200% auto;
  ${tw`shadow`}

  @media (prefers-reduced-motion: no-preference) {
    transition: background-position 0.5s;
  }

  :hover {
    background-position: right center;
    color: #fff;
    text-decoration: none;
  }

  :disabled {
    background-position: left center;
  }
`

const OutlineButton = styled.button`
  ${tw`p-4 rounded-lg border text-center`}

  @media (prefers-reduced-motion: no-preference) {
    transition: background-color 0.3s;
  }

  :hover {
    background-color: #fff2;
  }

  :disabled {
    ${tw`opacity-75 text-gray-300 bg-transparent`}
  }
`

const AirplaneSvg = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 12L13 12M5 12L3 21L21 12L3 3L5 12Z"
    />
  </svg>
)

const Airplane = styled(AirplaneSvg)`
  ${tw`h-6 w-6 absolute left-4 top-0 bottom-0 my-auto transform -rotate-90`}
  transition: all 0.7s ease-in;
  transform-origin: 0 50px;

  ${({ $state }) =>
    $state === "pending" && tw`rotate-0 animate-pulse duration-300`}

  ${({ $state }) =>
    $state === "sent" && "transform: rotate(0) translateX(450px);"}

  ${({ $state }) => $state === "fail" && tw`rotate-180`}

  ${({ $state }) => $state === "reset" && tw`transition-none`}
`

const SendButton = ({ state, children, ...props }) => (
  <GradientButton
    disabled={state !== "reset"}
    tw="relative overflow-hidden"
    {...props}
  >
    <Airplane $state={state} />
    {state === "reset" && children}
    {state === "pending" && "Sending email..."}
    {state === "fail" && "Failed"}
    {state === "sent" && "Sent!"}
  </GradientButton>
)

const LoaderButton = ({ loading, loaderHeight = 48, children, ...props }) => (
  <GradientButton disabled={loading} {...props}>
    {loading ? <Loader tw="mx-auto" height={loaderHeight} /> : children}
  </GradientButton>
)

export { GradientButton, OutlineButton, SendButton, LoaderButton }
