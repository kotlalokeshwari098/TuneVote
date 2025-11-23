
import { Link } from 'react-router'

const Home = () => {
  return (
    <div>
        VoteTune 
        <Link to='/signup'>Create Jam</Link>
        <Link to='/join-jam'>Join Jam</Link>
    </div>
  )
}

export default Home