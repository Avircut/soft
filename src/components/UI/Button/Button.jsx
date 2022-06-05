import React from 'react';
import cl from './Button.module.css';

const Button = ({children, classname, ...props}) => {
  return (
    <button className={[cl.btn,classname].join(" ")} {...props}>
      {children}
    </button>
  );
  };
export default Button;