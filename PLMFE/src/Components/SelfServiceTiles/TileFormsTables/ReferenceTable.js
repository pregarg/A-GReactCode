export default function RefereceTable({ referenceTableRowsData }) {
  const tdData = () => {
    console.log("Row Data ------------------>01", referenceTableRowsData);

    if (!!referenceTableRowsData && referenceTableRowsData.length > 0) {
      return referenceTableRowsData.map((data, index) => {
        console.log("Row Data ------------------>02", data);
        console.log("Row Data ------------------>03", index);
        //Changed by Nidhi Gupta on 05/30/2023 in order to map state to table(lowercase)

        const reference =
          "reference" in data && data.reference.value !== undefined
            ? data.reference.value
            : data.reference;
        return (
          <tr key={index}>
            <td>
              {"name" in data && data.name.value !== undefined
                ? data.name.value
                : data.name}
            </td>
            <td>
              {"description" in data && data.description.value !== undefined
                ? data.description.value
                : data.description}
            </td>
            <td>
              <a href={reference} target="_blank" rel="noreferrer">
                {reference}
              </a>
            </td>
          </tr>
        );
      });
    }
  };

  return (
    <>
      <table className="table table-bordered tableLayout" id="ReferenceTable">
        <thead>
          <tr className="tableRowStyle tableHeaderColor">
            {/* <th scope="col" style={{width:"6%"}}><button className='addBtn' onClick={() => {}} >
                        <i className="fa fa-plus"></i></button></th> */}
            <th scope="col">Name</th>
            <th scope="col">References Material</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>{tdData()}</tbody>
      </table>
      {/* {(typeTableRowsData.length<=0)?<div className="invalid-feedback" style={{display:'block'}}>Atleast one entry is required</div>:null} */}
      {/* <GridModal name={"Reference Information"} validationObject={isTouched} modalShow={modalShow} handleModalChange={handleModalChange} dataIndex={dataIndex} 
            tdDataReplica = {tdDataReplica} deleteTableRows={deleteTableRows} gridName={TypeTable.displayName} gridRowsFinalSubmit={gridRowsFinalSubmit}
            decreaseDataIndex={decreaseDataIndex} operationValue={operationValue}></GridModal> */}
    </>
  );
}
