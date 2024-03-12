import Signup from "./SignUp"
import Login from "./LogIn"

type Props = {
  isLogin: boolean
  PORT: string
}

const Authentication = ({ isLogin, PORT }: Props) => {
  return <>{isLogin ? <Login PORT={PORT} /> : <Signup PORT={PORT} />}</>
}

export default Authentication