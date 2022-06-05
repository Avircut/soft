import React from 'react';
const StatusIndicator = React.forwardRef(({status,...props},ref) => {
  const truthyValues = ['commited','active','SELL'];
  const isGood = truthyValues.includes(status);
  return (
    <>
      <td className={`w-1 h-full absolute ${isGood ? 'bg-green-500' : 'bg-yellow-500'}`} {...props}/>
    </>
  );
});

export default StatusIndicator;