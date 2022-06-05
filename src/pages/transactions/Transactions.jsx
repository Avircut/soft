import React, { useEffect, useState } from 'react';
import Table from '../../components/Table/Table';
import styles from './Transactions.module.css';
import Modal from 'react-modal/lib/components/Modal';
import { useHttp } from '../../hooks/http.hook';
import FormSelect from '../../components/UI/FormSelect/FormSelect';
import TransForm from '../../components/Forms/TransForm';
import FormInput from '../../components/UI/FormInput/FormInput';
import { useForm } from 'react-hook-form';
import Button from '../../components/UI/Button/Button';
import AltButton from '../../components/UI/Button/AltButton/AltButton';
import moment from 'moment';
import {toast} from 'react-toastify';
const Transactions = () => {
  const {loading, request} = useHttp(); // Для HTTP запросов
  const {register,handleSubmit, control, reset, formState: { errors}} = useForm(); // React-hook-form. Для валидации
  const {handleSubmit:handleSubmit2, control:control2, formState: { errors:errors2}} = useForm(); // React-hook-form. Для валидации
  const [transactions, setTransactions] = useState(); 
  const [selectedTransaction,setSelectedTransaction] = useState(); // Выбранная транзакция для отображения в модалке
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCardSelectionOpen, setCardSelectionOpen] = useState(false); // Модалка для выбора карты, если при добавлении новой транзакции не было выбрано в фильтре карты
  const [cardNumbers,setCardNumbers] = useState(); // Список номеров карт (для Select)
  const [carduuid,setCarduuid] = useState(); // UUID карты, чтобы передать его в модалку
  const today = moment().format('YYYY-MM-DD');
  const visibleHeaders = [{value:'uuid', label:'Номер'},{value:'period', label:'Дата'},{value:'delta',label:'Разница'},{value:'comment',label:'Комментарий'}]; // Поля, которые будут отображаться в таблице
  const hiddenHeaders = ['state'];
  const totalValues = [{value:'delta',label:'Разность'}]; // Список полей, которые должны отображаться
  useEffect(() => {
    getData();
  },[])
  const filterData = async (data) => { // Фильтр
    let url = 'https://bonus-test.evoapp.ru/api/3rdparty/transaction?';
    if(data.from) { // Обработка дат, перевод их в unix timestamp для отправки на сервер
      data.from= (+ new Date(data.from))/1000;
    } else data.from = 0;
    url+=`from=${data.from}&`;
    if(data.to){
      data.to = (+ new Date(data.to))/1000; 
      url +=`to=${data.to}&`;
    }
    if(data.uuid) url +=`card_uuid=${data.uuid.value}`;
    if(url[url.length-1]==='&') url = url.substring(0,url.length-1); // Убрать конечный &, если были выбраны не все поля
    try{
      let transactions = await request(url,'GET');
      transactions = transactions.map(transaction => ({...transaction,details:JSON.stringify(transaction.details)}))
      setTransactions(transactions);
      return transactions;
    }
    catch(e){
      toast.error('Не вышло отфильтровать транзакции :(',{position:'bottom-right',theme:'light'});
      console.log(e.message);
    }
  }
  useEffect(() => { // Регистрация транзакций
    if(selectedTransaction && selectedTransaction.status){
      const query = [selectedTransaction];
      const registerTransaction = async () => {
        try{
          await request('https://bonus-test.evoapp.ru/api/3rdparty/transaction','POST',query);
          toast.success('Транзакция зарегистрирована!',{position:'bottom-right',theme:'light'});
          getData();
        }
        catch(e){
          toast.error('Не получилось зарегистрировать транзакцию :(',{position:'bottom-right',theme:'light'});
          console.log(e.message);
        }
      }
      registerTransaction();
    }
  },[selectedTransaction])
  const resetFilter = (e) => { // Сброс формы с фильтром и обновление данных
    e.preventDefault();
    reset({uuid:1,from:0,to:0});
    setCarduuid(undefined);
    getData();
  }
  const addTransaction = () => {
    setSelectedTransaction(undefined);
    if(carduuid){
      setIsFormOpen(true);
    }
    else setCardSelectionOpen(true);
  }
  const displayForm = ()=> {
    setIsFormOpen(true);
    setCardSelectionOpen(false);
  }
  const getData = async () => { // Получение всех транзакций с сервера
    try{
      let transactions = await request('https://bonus-test.evoapp.ru/api/3rdparty/transaction?from=0','GET');
      transactions = transactions.map(transaction => ({...transaction,details:JSON.stringify(transaction.details)}));
      setTransactions(transactions);
      let numbers = transactions.map(transaction => transaction.card_uuid);
      numbers = [...new Set(numbers)];
      numbers = numbers.map(transaction => ({value:transaction,label:transaction}));
      setCardNumbers(numbers);
      return transactions;
    }
    catch(e){
      toast.error('Не вышло получить транзакции :(',{position:'bottom-right',theme:'light'});
      console.log(e.message);
    }
  } // Получить транзакцию для отображения в модалке
  const getSelectedTransaction = async (cell) => {
    const row = cell.closest('tr');
    const index = row.querySelector(':nth-child(1)').innerHTML;
    setSelectedTransaction(transactions[index]);
    setIsFormOpen(true);
  }
  return (
    <div className='flex-col flex flex-1 pt-5'>
      <div className='container'>
        <h2 className='text-center text-4xl font-bold mb-4 text-gray-900'>Транзакции</h2>
        {cardNumbers&&
          <form className={styles.filter} onSubmit={handleSubmit(filterData)}>
            <FormSelect error={errors.uuid} control={control} Required={false} name={'uuid'} options={cardNumbers} labelText={'Номер карты'} placeholder={'Выберите...'} onChange={(value)=>setCarduuid(value.value)}/>
            <FormInput error={errors.from} {...register('from',{required:false})} type={'date'} max={today} name={'from'} labelText={'От'}/>
            <FormInput error={errors.to} {...register('to',{required:false})} type={'date'} max={today} name={'to'} labelText={'До'}/>
            <div className='flex gap-3'>
            <Button classname={'mt-auto'}>Применить</Button>
            <AltButton classname={'mt-auto'} onClick={resetFilter}>Обновить</AltButton>
            </div>
          </form>
        }


        <Table rows={transactions} setRows={setTransactions} loading={loading} addAction={addTransaction} getSelectedRow={getSelectedTransaction} visibleHeaders={visibleHeaders} hiddenHeaders={hiddenHeaders} totalValues={totalValues}/>
        <Modal
          isOpen={isFormOpen}
          onRequestClose={()=> setIsFormOpen(false)}
          overlayClassName='overlay'
          className='modal'
          >
            <TransForm transaction={selectedTransaction} setTransaction={setSelectedTransaction} closeModal={()=>setIsFormOpen(false)} card_uuid={carduuid}/>
          </Modal>
          <Modal
          isOpen={isCardSelectionOpen}
          onRequestClose={()=> setCardSelectionOpen(false)}
          overlayClassName='overlay'
          className='modal'
          >
            <form className='flex flex-col p-5 gap-3 items-center justify-center' onSubmit={handleSubmit2(displayForm)}>
              <h2>Внимание</h2>
              <p>Выберите карту, для которой вы хотите создать зарегистрировать транзакцию</p>
              <FormSelect control={control2} error={errors2.card} name='card' Required={true} options={cardNumbers} placeholder={'Выберите...'} classname={'min-w-full'} onChange={(value)=>setCarduuid(value.value)}/>
              <Button>Принять</Button>
            </form>
          </Modal>
      </div>
    </div>
  );
};

export default Transactions;