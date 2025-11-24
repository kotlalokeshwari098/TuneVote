
import { 
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider}
   from "react-router"
import Home from "./pages/Home"
import Signup from "./pages/Signup"
import SignIn from "./pages/SignIn"
import JoinJam from "./pages/JoinJam"
import CreateJam from "./pages/CreateJam"
import ViewJams from "./pages/ViewJams"
import UserProtectWrapper from "./pages/UserProtectWrapper"
import JamRoom from "./pages/JamRoom"

const routes=createBrowserRouter(
  createRoutesFromElements(
    <Route>
       <Route path='/' element={<Home />}/>
       <Route path='/signup' element={<Signup/>}/>
       <Route path='/signin' element={<SignIn />}/>
       <Route path='/view-jams' element={<ViewJams />}/>
       <Route element={<UserProtectWrapper /> }>
          <Route path='/join-jam' element={<JoinJam />}/>
          <Route path='/create-jam' element={<CreateJam />}/>
          <Route path='/jam-room/:jamName' element={<JamRoom />}/>
       </Route>      
    </Route>
  )
)


const App = () => {
  return (
    <>    
      <RouterProvider router={routes}/>
    </>
  )
}

export default App