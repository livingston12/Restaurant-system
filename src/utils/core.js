/**
 * Get pagination summary for frontend and backend paginated tables
 * @param {number} pageSize pagination size
 * @param {number} pageIndex current page index
 * @param {number} dataLength length of the retrieved data.
 * If paginating on frontend use same value as pageSize
 * @param {number} total of elements to paginate
 * @return {string} pagination summary
 */
export const pagesSummary = (pageSize, pageIndex, dataLength, total) => {
  const start = pageSize * pageIndex - (pageSize - 1);
  const end = pageSize * pageIndex - (pageSize - 1) + dataLength - 1;

  return `${start} - ${end <= total ? end : total} / ${total} Results`;
};

export const stringToDate = sdate => {
  const indexOfT = sdate.indexOf("T");
  const date = sdate.substring(0, indexOfT);
  return new Date(`${date}`);
};

export const stringToDatetime = sdate => {
  const indexOfT = sdate.indexOf("T");
  const date = sdate.substring(0, indexOfT);
  const time = sdate.substring(indexOfT + 1, sdate.length - 1);
  return new Date(`${date} ${time}`);
};

export const dateFormat = date => {
  const YEAR = date.getFullYear();
  const MONTH = date.getMonth() + 1;
  const DAY = date.getDate();
  return `${YEAR}-${MONTH}-${DAY}`;
};

export const dateTimeFormat = date => date.toLocaleString();

export const mapToArray = obj => {
  return Object.entries(obj).map(([key, value]) => {
    return { key, value };
  });
};

export const getViewFilters = (entity, filters) => {
  const entityFilters = filters[entity];
  let viewFilters = null;

  if (entityFilters) {
    // JSON.parse to Remove vuex observer from Object
    viewFilters = JSON.parse(JSON.stringify(Object.assign(entityFilters)));
    const regex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/i;
    Object.keys(viewFilters).forEach(filterField => {
      if (
        viewFilters[filterField] !== undefined &&
        viewFilters[filterField] !== null &&
        typeof viewFilters[filterField] === "string" &&
        viewFilters[filterField].match(regex)
      ) {
        viewFilters[filterField] = new Date(viewFilters[filterField]);
      }
    });
  }
  return viewFilters;
};

export const scrollToTop = () => {
  window.scroll({
    top: 0,
    left: 0,
    behavior: "smooth"
  });
};

export const getEncode = text => {
  return text.replace(/@/g, "%40");
};

export const isValidJSONString = str => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

/**
 * Create a new function that calls func with thisArg and args.
 * @param {function} func the function to be executed
 * @param {number} wait the wait time for the function to be executed
 * @param {boolean} immediate flag to identify
 * if the funtion is excecuted immediately
 * @return {function} new function that handles the execution
 */
export function debounce(func, wait, immediate) {
  let timeout;
  return function(...theArgs) {
    const context = this; // eslint-disable-line no-invalid-this
    const args = theArgs;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
}

export function areDatesEqual(date1, date2) {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

/**
 * The objective is to retrieve a date at specific time
 * @param {time} time the quantity of hours to add to the date
 * @return {Date} the new date at specific time
 */
export function getSpecificDate(time) {
  const date = new Date();
  return date.setHours(date.getHours() + time);
}

/**
 * Format text to JSON
 * @param {text} text string object
 * @return {Object} the text converted to an Object
 */
export function formatJson(text) {
  const obj = JSON.parse(text);
  return JSON.stringify(obj, undefined, 4);
}

export function sort(data = [], property = "") {
  return data.sort((a, b) => {
    let result = 0;
    if (a[property] < b[property]) {
      result = -1;
    } else if (a[property] > b[property]) {
      result = 1;
    }
    return result;
  });
}

export function exportCSVFile(headers, items, fileTitle) {
  const csv = convertToCSV(items);
  const exportedFileName = fileTitle + ".csv" || "export.csv";
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, exportedFileName);
  } else {
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", exportedFileName);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

function convertToCSV(objArray) {
  if (!objArray) {
    return null;
  }
  const array = [Object.keys(objArray[0])].concat(objArray);
  return array
    .map(item => {
      const objItems = Object.entries(item);
      let obj = "";
      const listObj = [];
      for (let index = 0; index < objItems.length; index++) {
        const currentObj = objItems[index][1];
        const typeObj = typeof currentObj;
        obj = typeObj !== "object" ? currentObj : getStringCommas(currentObj);
        listObj.push(obj);
      }
      return listObj;
    })
    .join("\n");
}

function getStringCommas(objArray) {
  const value = Object.entries(objArray)
    .map(item => {
      const array = [];
      array.push(item[1]);
      return array.join(",");
    })
    .join(",");
  return value.replaceAll(",", " - ");
}

export function getStringBySeparator(array, separator) {
  return array.join(separator);
}

export function findItemInArray(object, searhValue) {
  const objKey = Object.keys(object).findIndex(function(el) {
    return el.toLowerCase().indexOf(searhValue.toString().toLowerCase()) > -1;
  });
  if (objKey === null || objKey === -1) {
    return null;
  }
  return Object.entries(object)[objKey][1];
}

/**
 * Combine two arrays
 * @param {Array} arr1 a list
 * @param {Array} arr2 a list
 * @param {text} delimiter delimiter
 * @return {Array} combination of two arrays
 */
export function combineArrays(arr1, arr2, delimiter = " ") {
  if (!arr2) {
    return arr1;
  }

  return arr1.flatMap(el1 => arr2.map(el2 => `${el1}${delimiter}${el2}`));
}

/**
 * Get unique values from array
 * @param {Object} value element
 * @param {Number} index index
 * @param {Array} self array
 * @return {Array} with unique values
 */
export function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

/**
 * Generate random id
 * @return {String} id
 */
export function generateRandomId() {
  return (
    "_" +
    Math.random()
      .toString(36)
      .substr(2, 9)
  );
}

/**
 * Transform object values to array
 * @param {Object} val element
 * @return {Array} arr
 */
export function objectValuesToArray(val) {
  const arr = [];
  for (const v in val.value) {
    if (Object.prototype.hasOwnProperty.call(val.value, v)) {
      arr.push(val.value[v]);
    }
  }
  return arr;
}

export function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export function getURLImage(typeId, fileName, urlPandora, typeImgages) {
  let directory = typeImgages.find(x => x.typeId === typeId);
  directory = directory ? directory.type : null;
  const file = `${urlPandora}/Images/${directory}/${fileName}`;
  return file;
}

export function isNumbered(value) {
  value = value ? value : window.event;
  var charCode = value.which ? value.which : value.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
    value.preventDefault();
  } else {
    return true;
  }
}

export const numberFormat = (number, decimals, dec_point, thousands_point) => {
  if (number === null || !isFinite(number)) {
    throw new TypeError("number is not valid");
  }

  if (!decimals) {
    var len = number.toString().split(".").length;
    decimals = len > 1 ? len : 0;
  }

  if (!dec_point) {
    dec_point = ".";
  }

  if (!thousands_point) {
    thousands_point = ",";
  }

  number = parseFloat(number).toFixed(decimals);

  number = number.replace(".", dec_point);

  var splitNum = number.split(dec_point);
  splitNum[0] = splitNum[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands_point);
  number = splitNum.join(dec_point);

  return number;
};

export function removeItemFromArray(array, index) {
  array.splice(index, 1);
  return array;
}

export function validateForm(formData) {
  let isError = false;

  Object.keys(formData).forEach(f => {
    if (!formData) {
      isError = true;
    }
    isError = this.$refs[f].validate(true);
  });
  return !isError;
}

export function resetForm(formData) {
  Object.keys(formData).forEach(f => {
    this.$refs[f].reset();
  });
}

export function returnError(data, message, statusCode) {
  const dataError = {
    isOpen: true,
    modalType: "",
    isErorr: false,
    errors: [],
    title: "Error inesperado",
    color: "red"
  };
  let listErrors = [];

  if (data) {
    const { errors } = data;
    listErrors = Object.values(errors);
    if (listErrors.length > 0) {
      dataError.modalType = "list";
      dataError.isErorr = true;
      dataError.errors = listErrors;
    } else if (statusCode === "201") {
      listErrors.push(message);
      dataError.isErorr = true;
      dataError.errors = listErrors;
      dataError.color = "green";
      dataError.title = "";
    } else {
      listErrors.push(message);
      dataError.isErorr = true;
      dataError.errors = listErrors;
    }
  } else {
    listErrors.push(message);
    dataError.isErorr = true;
    dataError.errors = listErrors;
  }
  return dataError;
}

export function maxArray(array) {
  return Math.max(...array);
}

export function sumArray(array) {
  const reducer = (previousValue, currentValue) => previousValue + currentValue;
  return array.reduce(reducer);
}
