import React, {  useEffect, useState } from 'react';
import Table from '../../components/Table/Table';
import {useHttp} from '../../hooks/http.hook';
import CardForm from '../../components/Forms/CardForm';
import Modal from 'react-modal/lib/components/Modal';
import {toast} from 'react-toastify';
const Cards = () => {
  const {loading, request,error,clearError} = useHttp();
  const [isCardOpen,setIsCardOpen] = useState(false);
  const [cards,setCards] = useState();
  const [selectedCard,setSelectedCard] = useState();
  const visibleHeaders = [{value:'number', label:'Номер'},{value:'holder', label:'Держатель'},{value:'sales', label:'Продано'},{value:'balance',label:'Баланс'}]; // Поля, которые будут отображаться в таблице
  const hiddenHeaders = ['status'];
  const totalValues = [{value:'sales',label:'Продано'},{value:'balance',label:'Баланс'}]; // Список полей, которые должны отображаться
  useEffect(() => {
    getCards();
  },[]);
  const addCard = () => {
    setSelectedCard(undefined);
    setIsCardOpen(true);
  }
  useEffect(() => {
    clearError();
  },[error])
  useEffect(() => { //  Добавить новую или изменить уже существующую запись
    if(selectedCard && selectedCard.state){
      const query = selectedCard;
      const sendCard = async () => {
        try{
          await request('https://bonus-test.evoapp.ru/api/3rdparty/card','POST',query);
          toast.success('Выполнено!',{position:'bottom-right',theme:'light'});
          getCards();
        }
        catch(e){
          toast.error('Произошла ошибка :(',{position:'bottom-right',theme:'light'});
          console.log(e.message);
        }
      }
      sendCard();
    }
  },[selectedCard])
  const handleModal = async () => {
    setIsCardOpen(false);
  }
  const getSelectedCard = async (cell) => { // Получить данные о выбранной карте
    const row = cell.closest('tr');
    const number = row.querySelector(':nth-child(5)').innerHTML;
    try{
      const card = await request(`https://bonus-test.evoapp.ru/api/3rdparty/card/${number}`,'GET');
      setSelectedCard(card);
      setIsCardOpen(true);
    }
    catch(e){
      toast.error('Произошла ошибка при получении карты с сервера :(',{position:'bottom-right',theme:'light'});
      console.log(e.message);
    }
  }
  const getCards = async () => { //Получить список всех карт
      try{
        const cards = await request('https://bonus-test.evoapp.ru/api/3rdparty/card','GET');
        setCards(cards);
        return cards;
      }
      catch(e){
        toast.error('Произошла ошибка при получении карт с сервера :(',{position:'bottom-right',theme:'light'});
        console.log(e.message);
      }
  }
  return (
    <div className='flex-col flex flex-1 pt-5'>
      <h2 className='text-center text-4xl font-bold text-gray-900'>Карты</h2>
      <Table rows={cards} addAction={addCard} setRows={setCards} loading={loading} getSelectedRow={getSelectedCard} visibleHeaders={visibleHeaders} hiddenHeaders={hiddenHeaders} totalValues={totalValues}/>
      <Modal
        isOpen={isCardOpen}
        onRequestClose={()=> setIsCardOpen(false)}
        overlayClassName='overlay'
        className='modal'
        >
          <CardForm card={selectedCard} setCard={setSelectedCard} closeModal={handleModal} />
        </Modal>
    </div>
  );
};

export default Cards;