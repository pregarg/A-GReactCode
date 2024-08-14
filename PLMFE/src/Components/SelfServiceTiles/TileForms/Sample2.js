const getGridDataValues = (tableData, caseNumber) => {
  console.log("getGridDataValues :", tableData);
  //var headers = document.getElementById(tableId).headers;
  let returnArray = [];
  tableData.map((data) => {
    const dataObject = {};
    const dataKeys = Object.keys(data);
    dataKeys.forEach((dataValue) => {
      const dataKeyType = typeof data[dataValue];
      console.log("getGridDataValues data[dataValue] :", data[dataValue]);
      console.log("getGridDataValues dataKeyType :", dataKeyType);
      if (dataKeyType === "object") {
        console.log("Inside Data Object if: ", dataObject);
        if (data[dataValue]) {
          if (data[dataValue].value) {
            if (data[dataValue].value instanceof Date) {
              // dataObject[dataValue] =
              //   data[dataValue].value.toLocaleDateString();
              dataObject[dataValue] = extractDate(data[dataValue].value);
            } else {
              dataObject[dataValue] = data[dataValue].value;
            }
          }

          //Added by Nidhi Gupta on 6/12/2023
          else if (data[dataValue].value == "") {
            dataObject[dataValue] = "";
          } else {
            if (data[dataValue] instanceof Date) {
              //dataObject[dataValue] = data[dataValue].toLocaleDateString();
              dataObject[dataValue] = extractDate(data[dataValue]);
            } else {
              dataObject[dataValue] = data[dataValue];
            }
          }
          // else {
          //      dataObject[dataValue] = '';
          //  }
          //till here
        } else {
          dataObject[dataValue] = "";
        }
        //dataObject[dataValue] = (data[dataValue].value!==undefined)?data[dataValue].value:'');
      }
      if (dataKeyType !== "object") {
        dataObject[dataValue] = data[dataValue];
      }
    });
    dataObject.caseNumber = caseNumber;
    returnArray.push(dataObject);
  });
  console.log("getGridDataValues returnArray :", returnArray);
  return returnArray;
};
