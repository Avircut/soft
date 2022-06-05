// Хук для сортировки объектов
export const useSort = () => {
  const sort = (arr,header) => {
    function isNumber(n) {  // Проверка на число
      return /^-?[\d.]+(?:e-?\d+)?$/.test(n); 
    } 
    function cmp(a,b){ // Функция сортиврока
      if(isNumber(a[header]) && isNumber(b[header])){
        return a[header] - b[header];
      }
      else {
        if(a[header] === b[header]) return 0;
        else if (a[header] === null || a[header]==='') return 1;
        else if (b[header] === null || b[header]==='') return -1;
        else return (a[header] > b[header])? 1 : -1;
      }
    }
    const sortedArr = [...arr].sort(cmp);
    return sortedArr;
  }
  return sort;   
}