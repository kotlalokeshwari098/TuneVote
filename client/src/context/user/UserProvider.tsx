import React from 'react'
import { useState } from 'react';
import {type UserContextType,UserContext  } from './UserContext';

interface UserProviderProps {
  children: React.ReactNode;
}

const UserProvider = ({children}:UserProviderProps) => {
    const storedUserData=localStorage.getItem('user');
    const userData=storedUserData && JSON.parse(storedUserData);
    const [user,setUser]=useState<UserContextType['user']>(userData|| null || undefined)

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider