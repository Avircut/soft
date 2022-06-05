import React, { useContext } from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import { AuthContext } from '../context';
import Cards from '../pages/cards/Cards';
import Login from '../pages/login/Login';
import Receipts from '../pages/receipts/Receipts';
import Transactions from '../pages/transactions/Transactions';
// Роутер нужен для определения куда можно пускать пользователя, а куда - нет. И какие данные отображать при перехода пользователя на те или иные ссылки.
// Нужен в первую очередь чтобы ограничить возможность клиента входить в личный кабинет, когда он не авторизован.
const AppRouter = () => {
  const {isAuth} = useContext(AuthContext);
  return (
    isAuth
      ?
      <Routes>
        <Route path="/" element={<Cards/>}/>
        <Route path="/receipts" element={<Receipts/>}/>
        <Route path="/transactions" element={<Transactions/>}/>
        <Route path='*' element={<Navigate replace to="/"/>}/>
      </Routes>
      :
    <Routes>
      <Route path='*' element={<Login/>}/>
    </Routes>
  );
};

export default AppRouter;