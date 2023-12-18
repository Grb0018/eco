import { useDispatch } from 'react-redux';
import './App.css';
import Home from './Pages/Home';
import { Routes, Route, BrowserRouter, } from "react-router-dom"
import Men from './Pages/Men';
import Product_Detail from './Pages/Product_page';
import No_page from './Pages/404';
import Signup from './Pages/Signup';
import { useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { addUser, setChecked, setOrderList } from './redux/storeSlice';
import Cart from './Pages/Cart';
import Signin from './Pages/Signin';
import { setDoc } from 'firebase/firestore';
import Women from './Pages/Women';
import User from './Pages/User';
import About from './Pages/About';
import Order from './Pages/Order';
import WishList from './Pages/Wishlist';
function App() {
  const dispatch = useDispatch();
  const ObjectFilter = (ObjectData, item) => {
    return Object.fromEntries(
      Object.entries(ObjectData)
        .filter(([key, value]) => key !== item));
  }
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getDoc(doc(db, "users", user.uid)).then(snapshot => {
          if (snapshot.data() === undefined) {
            let uid = user.uid
            var user_data = {
              uid: uid,
              email: user.email,
              password: "",
              city: "",
              state: "",
              pincode: "",
              country: "",
              name: user.displayName,
              gender: "",
              phone_number: "",
              cart: [],
              wishlist: [],
              orders: []
            };
            setDoc(doc(db, "users", uid), user_data).then(val => {

              dispatch(addUser([{
                uid: uid,
                email: user.email,
                city: "",
                state: "",
                pincode: "",
                country: "",
                name: user.displayName,
                gender: "",
                phone_number: "",
                cart: [],
                wishlist: []
              }]));
              dispatch(setChecked(true));
            });
          } else {
            dispatch(addUser([ObjectFilter(snapshot.data(), snapshot.data()["orders"])]));
            dispatch(setOrderList(snapshot.data()["orders"]));
            dispatch(setChecked(true));
          }

        });
        
      }else{
        dispatch(setChecked(true));
      }

    })
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route index path='/' element={<Home />} />
        <Route path='/men' element={<Men />} />
        <Route path='/women' element={<Women />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/:type/:itemId' element={<Product_Detail />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/user' element={<User />} />
        <Route path='/about' element={<About />} />
        <Route path='/order' element={<Order />} />
        <Route path='/wishlist' element={<WishList />} />
        <Route path={"*"} element={<No_page />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
