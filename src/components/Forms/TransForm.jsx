import React, { useEffect, useState } from "react";
import moment from "moment";
import FormSelect from "../UI/FormSelect/FormSelect";
import { useForm } from "react-hook-form";
import FormInput from '../UI/FormInput/FormInput';
import Button from "../UI/Button/Button";
import {v4 as uuidv4} from 'uuid';
import MaskInput from "../UI/MaskInput/MaskInput";
const TransForm = ({transaction,setTransaction,card_uuid, closeModal,...props}) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i; // Regexp для проверки введенных UUID
  const {register,handleSubmit, control, reset, formState: { errors}} = useForm();
  const [date,setDate] = useState(); // Дата транзакции
  const [uuid,setUuid] = useState(); // UUID Транзакции
  const [dateActivation,setDateActivation] = useState(); // Дата активации транзакции
  const transactionStates=[
    {value:'commited', label:'commited'},
    {value:'prepared', label:'prepared'}
  ];
  const today = moment().format('YYYY-MM-DD');
  const applyData = (data) => { // Изменить локальную копию транзакции для дальнейшего отправления на сервер
    if(data.state) data.state = data.state.value;
    if(!data.period) data.period = Math.floor(+ new Date() /1000);
    else data.period = (+ new Date(data.period)) / 1000;
    if(data.period_activate) data.period_activate = + new Date(data.period_activate)/1000;
    data.status = 1; // State = 1 только если валидация формы прошла и форма готова к отправке на сервер 
    setTransaction({...transaction, ...data});
    closeModal();
  }
  useEffect(() => { //Установка дат в удобный для человека формат
    if(transaction){
      const status = {value:transaction.status,label:transaction.status};
      setDate(moment.unix(transaction.period).format('dd, D MMMM YYYY H:mm:ss'));
      if(transaction.period_activate) setDateActivation(moment.unix(transaction.period_activate).format('dd, D MMMM YYYY H:mm:ss'));
      reset({...transaction,status});
    }
    else {
      setUuid(uuidv4());
    }
  },[])
  useEffect(() => {
    if(uuid){
      reset({uuid,card_uuid:card_uuid});
    }
  },[uuid])
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-3">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Данные по транзакции</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Данные по транзакции и сущностям, которые её создали</p>
      </div>
      <div className="border-t border-gray-200">
        <form onSubmit={handleSubmit(applyData)}>
          <dl>
            {
              transaction ?
              <>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Уникальный идентификатор транзакции</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{transaction.uuid}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">ID аккаунта</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{transaction.account_id}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Уникальный идентификатор карты</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{transaction.card_uuid}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Изменение баланса</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{transaction.delta}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Дата транзакции</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{''+date}</dd>
                </div>
                {dateActivation &&
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Дата активации транзакции</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{''+dateActivation}</dd>
                  </div>
                }
                {transaction.user_uid &&
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Создавший транзакцию пользователь</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{transaction.user_uid}</dd>
                  </div>
                }
                {transaction.created_store_uuid &&
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Торговая точка</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{transaction.store_uuid}</dd>
                  </div>
                }
                {transaction.created_device_uuid &&
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Терминал</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{transaction.device_uuid}</dd>
                  </div>
                }
                {transaction.receipt_uuid && 
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Чек транзакции</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{transaction.receipt_uuid}</dd>
                  </div>            
                }
                {transaction.details!='null' &&
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Детали транзакции</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{transaction.details}</dd>
                  </div>
                }
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm flex items-center font-medium text-gray-500">Состояние</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{transaction.state}</dd>
                </div>
                {transaction.comment &&
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm flex items-center font-medium text-gray-500">Комментарий</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{transaction.comment}</dd>
                  </div>
                }
              </>
              :
              <>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm flex items-center font-medium text-gray-500">Номер транзакции</dt>
                  <FormInput error={errors.uuid} {...register('uuid',{required:true})} type={'text'} name={'uuid'} disabled={true}/>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm flex items-center font-medium text-gray-500">Номер карты</dt>
                  <FormInput error={errors.card_uuid} {...register('card_uuid',{required:true})} type={'text'} name={'card_uuid'} disabled={true}/>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm flex items-center font-medium text-gray-500">Сумма изменения*</dt>
                  <FormInput error={errors.delta} {...register('delta',{required:true})} type={'number'} step={0.01} name={'delta'} placeholder={'100'}/>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm flex items-center font-medium text-gray-500">Состояние*</dt>
                  <FormSelect error={errors.state} control={control} Required={true} defaultValue={transactionStates[0]} name={'state'} options={transactionStates}/>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"> 
                  <dt className="text-sm flex items-center font-medium text-gray-500">Дата транзакции</dt>
                  <FormInput error={errors.period} {...register('period',{required:false})} max={today} type={'date'} name={'period'}/>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"> 
                  <dt className="text-sm flex items-center font-medium text-gray-500">Дата активации транзакции</dt>
                  <FormInput error={errors.period_activate} {...register('period_activate',{required:false})} type={'date'} name={'period_activate'}/>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"> 
                  <dt className="text-sm flex items-center font-medium text-gray-500">Торговая точка</dt>
                  <MaskInput error={errors.store_uuid} control={control} type='text' name={'store_uuid'} mask={'********-****-****-****-************'} filter={uuidRegex}/>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"> 
                  <dt className="text-sm flex items-center font-medium text-gray-500">Терминал</dt>
                  <MaskInput error={errors.device_uuid} control={control} type='text' name={'device_uuid'} mask={'********-****-****-****-************'} filter={uuidRegex}/>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"> 
                  <dt className="text-sm flex items-center font-medium text-gray-500">Чек</dt>
                  <MaskInput error={errors.receipt_uuid} control={control} type='text' name={'receipt_uuid'} mask={'********-****-****-****-************'} filter={uuidRegex}/>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"> 
                  <dt className="text-sm flex items-center font-medium text-gray-500">Комментарий</dt>
                  <FormInput error={errors.comment} {...register('comment',{required:false})} type={'text'} name={'comment'}/>
                </div>
                <Button classname={'block mx-auto'}>Отправить</Button>
              </>
            }
          </dl>
        </form>
      </div>
    </div>
  )
}
export default TransForm;