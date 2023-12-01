import { useDispatch } from 'react-redux';
import './App.css';
import Home from './Pages/Home';
import { Routes,Route,BrowserRouter, } from "react-router-dom"
import Men from './Pages/Men';
import Product_Detail from './Pages/Product_page';
import No_page from './Pages/404';
import Login from './Pages/Login';
import Signup from './Pages/Logout';
import { useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { addUser } from './redux/storeSlice';
function App() {
  const dispatch = useDispatch();
  useEffect(()=>{
    onAuthStateChanged(auth,(user)=>{
      getDoc(doc(db,"users",user.uid)).then(snapshot=>{
        dispatch(addUser([snapshot.data()]));
      })
    })
  },[])

  return (
    <BrowserRouter>
    <Routes>
      <Route index path='/' element={<Home />}/>
      <Route path='/men' element={<Men />}/>
      <Route path='/signin' element={<Login />}/>
      <Route path='/signup' element={<Signup />}/>
      <Route path='/product/:itemId' element={<Product_Detail />}/>
      <Route path={"*"} element={<No_page />}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
