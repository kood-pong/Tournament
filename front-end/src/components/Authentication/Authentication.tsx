import Signup from "./SignUp"
import Login from "./LogIn"

type Props = {
  isLogin: boolean
}

const Authentication = ({ isLogin }: Props) => {
  return <>{isLogin ? <Login /> : <Signup />}</>
}

export default Authentication