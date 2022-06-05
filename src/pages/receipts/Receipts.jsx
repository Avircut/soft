import React, { useEffect, useState } from 'react';
import Table from '../../components/Table/Table';
import styles from './Receipts.module.css';
import Modal from 'react-modal/lib/components/Modal';
import { useHttp } from '../../hooks/http.hook';
import ReceiptForm from '../../components/Forms/ReceiptForm';
import FormSelect from '../../components/UI/FormSelect/FormSelect';
import FormInput from '../../components/UI/FormInput/FormInput';
import { useForm } from 'react-hook-form';
import Button from '../../components/UI/Button/Button';
import AltButton from '../../components/UI/Button/AltButton/AltButton';
import moment from 'moment';
import {toast} from 'react-toastify';
const Receipts = () => {
  const {loading, request} = useHttp(); // для HTTP запросов на сервер
  const {register,handleSubmit, control, reset, formState: { errors}} = useForm(); // React-hook-form. Для валидации
  const [receipts, setReceipts] = useState();
  const [selectedReceipt,setSelectedReceipt] = useState(); // Выбранный чек (нужна чтобы получить потом его данные в модалку)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const today = moment().format('YYYY-MM-DD');
  const [cardNumbers,setCardNumbers] = useState();
  const visibleHeaders = [{value:'number', label:'Номер'},{value:'card_uuid',label:'Карта'},{value:'period', label:'Дата'},{value:'totalWithDiscount', label:'Итог'}]; // Поля, которые будут отображаться в таблице
  const hiddenHeaders = ['type']; // Список скрытых полей
  const totalValues = [{value:'totalWithDiscount',label:'Всего со скидкой'},{value:'total',label:'Всего без скидки'}]; // Список полей, которые должны отображаться
  useEffect(() => {
    getData();
  },[])
  const filterData = async (data) => { // Фильтразция чеков
    let url = 'https://bonus-test.evoapp.ru/api/3rdparty/receipt?';
    if(data.from) {
      data.from= (+ new Date(data.from))/1000;
    } else data.from = 0;
    url+=`from=${data.from}&`;
    if(data.to){
      data.to = (+ new Date(data.to))/1000; 
      url +=`to=${data.to}&`;
    }
    if(data.uuid) url +=`cardUuid=${data.uuid.value}`;
    if(url[url.length-1]==='&') url = url.substring(0,url.length-1);
    try{
      const receipts = await request(url,'GET');
      setReceipts(receipts);
      return receipts;
    }
    catch(e){
      toast.error('Не вышло отфильтровать чеки :(',{position:'bottom-right',theme:'light'});
      console.log(e.message);
    }
  }
  const resetFilter = (e) => { // Сброс фильтра
    e.preventDefault();
    reset({uuid:1,from:0,to:0});
    getData();
  }
  const getData = async () => { // Получение всех чеков с сервера
    try{
      const receipts = await request('https://bonus-test.evoapp.ru/api/3rdparty/receipt?from=0','GET');
      setReceipts(receipts);
      let numbers = receipts.map(receipt => receipt.card_uuid);
      numbers = [...new Set(numbers)];
      numbers = numbers.map(receipt => ({value:receipt,label:receipt}));
      setCardNumbers(numbers);
      return receipts;
    }
    catch(e){
      toast.error('Не вышло получить чеки :(',{position:'bottom-right',theme:'light'});
      console.log(e.message);
    }
  }
  const getSelectedReceipt = async (cell) => { // Установить выбранный чек для отображения в модалке
    const row = cell.closest('tr');
    const index = row.querySelector(':nth-child(1)').innerHTML;
    setSelectedReceipt(receipts[index]);
    setIsFormOpen(true);
  }
  return (
    <div className='flex-col flex flex-1 pt-5'>
      <div className='container'>
        <h2 className='text-center text-4xl font-bold mb-4 text-gray-900'>Чеки</h2>
        {cardNumbers&&
          <form className={styles.filter} onSubmit={handleSubmit(filterData)}>
            <FormSelect error={errors.uuid} control={control} Required={false} name={'uuid'} options={cardNumbers} labelText={'Номер карты'} placeholder={'Выберите...'}/>
            <FormInput error={errors.from} {...register('from',{required:false})} type={'date'} max={today} name={'from'} labelText={'От'}/>
            <FormInput error={errors.to} {...register('to',{required:false})} type={'date'} max={today} name={'to'} labelText={'До'}/>
            <div className='flex gap-3'>
            <Button classname={'mt-auto'}>Применить</Button>
            <AltButton classname={'mt-auto'} onClick={resetFilter}>Сбросить</AltButton>
            </div>
          </form>
        }
        <Table rows={receipts} setRows={setReceipts} loading={loading} getSelectedRow={getSelectedReceipt} visibleHeaders={visibleHeaders} hiddenHeaders={hiddenHeaders} totalValues={totalValues}/>
        <Modal
          isOpen={isFormOpen}
          onRequestClose={()=> setIsFormOpen(false)}
          overlayClassName='overlay'
          className='modal'
          >
            <ReceiptForm receipt={selectedReceipt} closeModal={()=>setIsFormOpen(false)}/>
          </Modal>
      </div>
    </div>
  );
};

export default Receipts;