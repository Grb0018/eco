import { Provider } from 'react-redux';
import './App.css';
import Home from './Pages/Home';
import { Routes,Route,BrowserRouter } from "react-router-dom"
import { store } from './redux/store';
import Men from './Component/Men';
function App() {
  return (
    <Provider store={store}>
    <BrowserRouter>
    <Routes>
      <Route index path='/' element={<Home />}/>
      <Route index path='/men' element={<Men />}/>
    
    </Routes>
    </BrowserRouter>
    </Provider>
  );
}

export default App;
