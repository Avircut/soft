import React from 'react';

const Total = ({children,...props}) => {
  return (
    <div className='flex gap-3 items-center justify-center'>
      {children}
    </div>
  );
};

export default Total;