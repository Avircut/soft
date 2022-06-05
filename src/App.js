import './styles/App.css';
import { useState } from 'react';
import { AuthContext } from './context';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import NavBar from './components/NavBar';
import Modal from 'react-modal/lib/components/Modal';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
Modal.setAppElement('#root');
function App() {
  if(!localStorage.getItem('auth')) // При первом запуске приложения устанавливаем состояние авторизации
    localStorage.setItem('auth',JSON.stringify({isAuth:false}));
  const [isAuth,setIsAuth] = useState(JSON.parse(localStorage.getItem('auth')).isAuth);
  return (
    <AuthContext.Provider value={{
      isAuth,
      setIsAuth
    }}>
      <ToastContainer/>
      <BrowserRouter>
      {isAuth&& 
      <NavBar/>
      }
        <AppRouter/>
      </BrowserRouter>
  </AuthContext.Provider>
  );
}

export default App;
