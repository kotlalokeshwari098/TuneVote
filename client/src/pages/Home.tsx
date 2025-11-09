import React from 'react'
import { Link } from 'react-router'

const Home = () => {
  return (
    <div>
        VoteTune 
        <Link to='/signup'>Create Jam</Link>
        <button>Join Jam</button>
    </div>
  )
}

export default Home