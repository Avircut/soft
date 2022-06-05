import React from 'react';
import { Controller } from 'react-hook-form';
import cl from './MaskInput.module.css';
import InputMask from 'react-input-mask';
  const MaskInput =  ({classname, control, labelText,error,name,mask,labelClass,Required,filter, ...props}) =>  {
    return (
      <label className={[cl.label,labelClass].join(" ")}>
        {labelText?labelText:''}
        <Controller
          as={InputMask}
          control={control}
          mask={mask}
          name={name}
          rules={{pattern:filter,required:Required}}
          render={
            ({field:{onChange,value}}) => (
              <InputMask 
                onChange={onChange}
                value={value || ''}
                name={name}
                mask={mask} 
                className={[classname, cl.input,error?cl.error:''].join(" ")} 
                {...props}
              />
            )
          }        
          />
      </label>
    );
    };
export default MaskInput;