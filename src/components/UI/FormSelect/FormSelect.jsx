import React from 'react';
import cl from './FormSelect.module.css';
import Select from 'react-select';
import { Controller } from 'react-hook-form';
// Просто выпадающий список с возможностью поиска. Библиотека react-select. Чтобы подгружать выпадающий список во время работы программы - AsyncSelect.
const FormSelect = ({children, error, classname, address, Required, control, labelText, name, options, defaultValue, ...props}) => {
  // У меня есть сомнения по поводу того, что это вообще нужно, но я не помню уже будет ли всё работать без этих 2 функций.
  // Асинхронный запрос на сервер, который дает информацию об адресах. (пользователь вводит "Мо", а ему варианты по типу "г. Москва")
  // небольшое изменение стиля select'а
  const customStyles={
    control: (provided) => ({
      ...provided,
      borderColor: error? '#dc2626':'#eeeeee',
      height:'42px'
    })
  }
    return (
      <label className={[cl.label,classname].join(" ")}>{labelText}
      {control?
        <Controller // Контроллер нужен для валидации значений в react-hook-form
          name={name}
          control={control}
          defaultValue={defaultValue}
          rules={{required:Required}}
          render={({field:{onChange,value,name}}) => (
            <Select  
              styles={customStyles}
              onChange={(value)=>{onChange(value); if(props.onChange) props.onChange(value);}}
              value={value}
              name={name}
              className={cl.select} 
              options={options}
              isDisabled={props.isDisabled}
              placeholder={props.placeholder}
              theme={(theme) =>({
                ...theme,
                colors:
                {
                  ...theme.colors,
                  primary:error?'#dc2626':'#ababab'
                }
              })}
            />
          )}
        />
      :
        <Select  
          styles={customStyles}
          name={name}
          className={cl.select} 
          options={options}
          theme={(theme) =>({
            ...theme,
            colors:
            {
              ...theme.colors,
              primary:error?'#dc2626':'#ababab'
            }
          })}
          {...props}
        />

      }

      </label>
    );
};
export default FormSelect;