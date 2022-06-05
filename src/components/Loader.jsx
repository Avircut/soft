import React from 'react';
import RingLoader from 'react-spinners/RingLoader';
// Анимашка при загрузке с сервера
const Loader = ({loading,...props}) => {

  if(loading) return (
    <div className='absolute left-0 right-0 top-10 bottom-10 flex items-center justify-center z-10'>
      <RingLoader color={'#36D7B7'} loading={loading} size={100}/>
    </div>
  );
  else return null;
};

export default Loader;