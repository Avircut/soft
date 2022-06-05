import React, { useEffect, useState } from 'react';
import styles from './Table.module.css';
import FormButton from '../UI/Button/FormButton/FormButton';
import { CSVLink } from 'react-csv';
import { DownloadIcon, PlusIcon,  } from '@heroicons/react/solid';
import ErrorBoundary from '../ErrorBoundary';
import Loader from '../Loader';
import Total from '../Total';
import moment from 'moment';
import { useSort } from '../../hooks/sort.hook';
import StatusIndicator from '../UI/StatusIndicator';
import ReactTooltip from 'react-tooltip';
const Table = ({rows, setRows, addAction, loading, getSelectedRow, visibleHeaders, hiddenHeaders, totalValues, ...props}) => {
  const [exportData,setExportData] = useState(); // Данные для экспорта (текущий набор rows с датами в читаемом формате)
  const [totalElements,setTotalElements] = useState([]); // Элементы для отображения внизу таблицы (итоги всей таблицы)
  const sort = useSort();
  const sortByColumn = (header) => setRows(sort(rows,header)); // Сортировка по выбранному столбцу
  useEffect(() => {
    if(rows){
      const total = {};
      rows.forEach(card => { // Расчет всех итогов всех столбцов, которые указаные в TotalValues
        for(let value of Object.entries(card)){
          totalValues.forEach(totalValue => {
            if(totalValue.value === value[0]){
              if(total[totalValue.label] ===undefined) total[totalValue.label]=0;
              total[totalValue.label] += parseInt(value[1]);
            }
          })
        }
      })
      const elements = [];
      for(let value of Object.entries(total)){
        elements.push(
          <span className={styles.total} key={value[0]}>{value[0]}: {value[1]}</span>
        )
      }
      setTotalElements(elements);
      makeExportDates();
      ReactTooltip.rebuild();
    }
  },[rows]);
  const makeExportDates = () => { // Перевод всех дат в удобочитаемый формат
    const data =rows.map(row => {
      let newRow = {...row};
      if(Number(row.created_date)){
        newRow.created_date=moment.unix(row.created_date).format('D.M.YYYY');
      }
      if(Number(row.period)){
        newRow.period=moment.unix(row.period).format('D.M.YYYY');
      }
      if(Number(row.period_activate)){
        newRow.period_activate=moment.unix(row.period_activate).format('D.M.YYYY');
      }
      return newRow;
    });
    setExportData(data);
  }
  return (
    <ErrorBoundary>
      <ReactTooltip wrapper={'td'} type='dark' place="left" effect='solid'/>
      <div className={styles.tableContainer}>
        <Loader loading={loading}/>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr className={styles.tableRow}>
              {hiddenHeaders && hiddenHeaders.map(header => 
              <th key={header} className={styles.tableHeading} style={{display:'none'}}>{header}</th>
              )}
              {visibleHeaders && visibleHeaders.map(header => 
                <th key={header.label} className={styles.tableHeading} onClick={()=>sortByColumn(header.value)}>{header.label}</th>
              )}
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {rows && rows.map((card,index) =>
              <tr className={styles.tableRow} key={card.uuid} onClick={e => getSelectedRow(e.target)}>
                <td className={styles.tableCell} style={{display:'none'}}>{index}</td>
                {hiddenHeaders && hiddenHeaders.map(header => 
                  <React.Fragment key={card[header]}>
                    <StatusIndicator data-tip={card[header]} status={card[header]}/>
                    <td className={styles.tableCell} style={{display:'none'}}>{card[header]}</td>
                  </React.Fragment>
                )}
                {visibleHeaders && visibleHeaders.map(header => 
                  <td key={card[header.value] + card.uuid} className={styles.tableCell}>{(parseInt(card[header.value])>1530000000 && header.value!='number')?''+moment.unix(card[header.value]).format('dddd, D MMMM YYYY, H:mm:ss') :card[header.value]}</td>
                )}
              </tr>
              )}
          </tbody>
        </table>
        <div className={styles.buttonGroup}>
          <div className={styles.defaultBtns}>
            {addAction &&
              <FormButton onClick={addAction} classname={styles.addBtn}>Добавить<PlusIcon/></FormButton>
            }
          </div>
          {rows &&
                <Total>
                  <span>Итого:{rows.length}</span>
                  {totalElements}
                </Total>
          }
          <ErrorBoundary>
            {exportData &&
              <CSVLink separator=';' data={exportData}>
                <FormButton classname={styles.expBtn}>Экспорт<DownloadIcon/></FormButton>
              </CSVLink>
            }

          </ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Table;