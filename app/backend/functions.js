export function getDay(date) {
    const map = {
      0: 'Sunday',
      1: 'Monday',
      2: 'Tuesday',
      3: 'Wednesday',
      4: 'Thursday',
      5: 'Friday',
      6: 'Saturday'
    }
    return map[date.getDay()]
  }

export function titleCase(words) {
  var separateWord = words.toLowerCase().split(' ');
  for (var i = 0; i < separateWord.length; i++) {
      separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
      separateWord[i].substring(1);
  }
  return separateWord.join(' ');
}

export function searchFilter(text, array, ...variables) { // variables are the fields to filter by   
  const textData = text.toLowerCase();
  const newData = array.filter(item => {
    let inNewData = false;
    for (const element of variables) {
      const itemText = item[element].toLowerCase();
      if (itemText.indexOf(textData) > -1) {
        inNewData = true;
        break; 
      }
    }      
    return inNewData; 
  });   
  return newData;
};

export const convertToDay = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat'
]

export const convertToMonth = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]


