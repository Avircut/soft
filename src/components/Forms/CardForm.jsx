import React, { useEffect, useState } from "react";
import moment from "moment";
import FormSelect from "../UI/FormSelect/FormSelect";
import { useForm } from "react-hook-form";
import FormInput from '../UI/FormInput/FormInput';
import Button from "../UI/Button/Button";
import {v4 as uuidv4} from 'uuid';
import MaskInput from "../UI/MaskInput/MaskInput";
const CardForm = ({card,setCard, closeModal,...props}) => {
  const {register,handleSubmit, control, reset, formState: { errors}} = useForm(); // React-hook-form. Для валидации
  const [date,setDate] = useState({});
  const today = moment().format('YYYY-MM-DD');
  const [uuid,setUuid] = useState();
  const cardStates=[ // States для react-select
    {value:'active', label:'active'},
    {value:'blocked', label:'blocked'}
  ];
  const applyData = (data) => { // Изменение локальной копии записи
    if(data.status) data.status = data.status.value; else data.status='active';
    data.uuid = data.uuid? data.uuid : uuidv4();
    data.phone = data.phone.replace(/[+() -]/g,'');
    data.state = 1; // State = 1 только если валидация формы прошла и форма готова к отправке на сервер 
    setCard({...card, ...data});
    closeModal();
  }
  useEffect(() => { // Заполнение формы начальныи данными
    if(card){
      const status = {value:card.status,label:card.status};
      setDate(moment.unix(card.created_date).format('dd, D MMMM YYYY H:mm:ss'));
      reset({...card,status});
    }
    else{
      setUuid(uuidv4());
    }
  },[])
  useEffect(() => {
    if(uuid) reset({uuid});
  },[uuid])
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-3">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Данные по карте</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Данные о созданной бонусной карте и её держателе</p>
      </div>
      <div className="border-t border-gray-200">
        <form onSubmit={handleSubmit(applyData)}>
          <dl>
            {
              card ?
              <>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Уникальный идентификатор карты</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{card.uuid}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Баланс</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{card.balance}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Дата создания карты</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{''+date}</dd>
                </div>
                {card.created_user &&
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Создавший карту пользователь</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{card.created_user}</dd>
                  </div>
                }
                {card.created_store_uuid &&
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Торговая точка</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{card.created_store_uuid}</dd>
                  </div>
                }

                {card.created_device_uuid &&
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Терминал</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{card.created_device_uuid}</dd>
                  </div>
                }

                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm flex items-center font-medium text-gray-500">Статус</dt>
                  <FormSelect error={errors.status} control={control} Required={true} defaultValue={cardStates[0]} name={'status'} options={cardStates}/>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm flex items-center font-medium text-gray-500">Держатель</dt>
                  <FormInput error={errors.holder} {...register('holder',{required:false})} type={'text'} name={'holder'} placeholder={'Введите имя...'}/>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Номер карты</dt>
                  <FormInput error={errors.number} {...register('number',{required:true})} type={'text'} name={'number'} disabled={card?true:false}/>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"> 
                  <dt className="text-sm flex items-center font-medium text-gray-500">Номер телефона</dt>
                  <MaskInput error={errors.phone} control={control} type='text' name={'phone'} mask={'+7(999)999-9999'}/>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm flex items-center font-medium text-gray-500">Дата рождения</dt>
                  <FormInput error={errors.birthdate} {...register('birthdate',{required:false})} max={today} type={'date'} name={'birthdate'} />
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Продажи</dt>
                  <FormInput error={errors.sales} {...register('sales',{required:false})} type={'text'} name={'sales'} disabled={true}/>
                </div>
              </>
              :
              <>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm flex items-center font-medium text-gray-500">UUID карты</dt>
                  <FormInput error={errors.uuid} {...register('uuid',{required:true})} type={'text'} name={'uuid'} disabled={true}/>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm flex items-center font-medium text-gray-500">Держатель</dt>
                  <FormInput error={errors.holder} {...register('holder',{required:false})} type={'text'} name={'holder'} placeholder={'Введите имя...'}/>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Номер карты*</dt>
                  <FormInput error={errors.number} {...register('number',{required:true})} type={'text'} name={'number'} disabled={card?true:false}/>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"> 
                  <dt className="text-sm flex items-center font-medium text-gray-500">Номер телефона</dt>
                  <MaskInput error={errors.phone} control={control} type='text' name={'phone'} mask={'+7(999)999-9999'}/>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm flex items-center font-medium text-gray-500">Дата рождения</dt>
                  <FormInput error={errors.birthdate} {...register('birthdate',{required:false})} max={today} type={'date'} name={'birthdate'} />
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Продажи</dt>
                  <FormInput error={errors.sales} {...register('sales',{required:false})} type={'number'} step={0.01} name={'sales'} />
                </div>
              </>
            }
            <Button classname={'block mx-auto'}>Отправить</Button>
          </dl>
        </form>
      </div>
    </div>
  )
}
export default CardForm;