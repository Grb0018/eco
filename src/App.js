import { Provider } from 'react-redux';
import './App.css';
import Home from './Pages/Home';
import { Routes,Route,BrowserRouter, } from "react-router-dom"
import { store } from './redux/store';
import Men from './Pages/Men';
import Product_Detail from './Pages/Product_page';
import No_page from './Pages/404';
import Login from './Pages/Login';
import Logout from './Pages/Logout';
function App() {
  return (
    <Provider store={store}>
    <BrowserRouter>
    <Routes>
      <Route index path='/' element={<Home />}/>
      <Route path='/men' element={<Men />}/>
      <Route path='/signin' element={<Login />}/>
      <Route path='/signup' element={<Logout />}/>
      <Route path='/product/:itemId' element={<Product_Detail />}/>
      <Route path={"*"} element={<No_page />}/>
      
    
    </Routes>
    </BrowserRouter>
    </Provider>
  );
}

export default App;
