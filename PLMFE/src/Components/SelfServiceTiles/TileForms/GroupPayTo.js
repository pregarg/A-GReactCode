import React, { useState, useEffect } from "react";
// import axios from 'axios';
import { useAxios } from "../../../api/axios.hook";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation, useNavigate } from "react-router-dom";
import PayToTable from "../TileFormsTables/PayToTable";
import FooterComponent from "../../FooterComponent";

export default function GroupPayTo() {
  GroupPayTo.displayName = "PayTo Modification";
  GroupPayTo.validate = "shouldValidate";
  let apiUrl = "http://localhost:8081/api/";
  const { customAxios: axios } = useAxios();

  let prop = useLocation();
  const navigate = useNavigate();
  const modifyValidatedAddressPayToRow = (index, data) => {
    setPayToTableRowsData((prev) => {
      prev[index] = data;
      return prev;
    });
  };
  const navigateHome = () => {
    if (prop.state !== null) {
      navigate("/DashboardLogin/Home", { replace: true });
    }

    if (prop.state === null) {
      navigate("/Home", { replace: true });
    }
  };

  const demoData = [];

  const [payToTableRowsData, setPayToTableRowsData] = useState([]);

  useEffect(() => {
    if (prop.state !== null) {
      let gridApiArray = [];
      let getCaseNumberEndpoints = [
        apiUrl + "payTo/getCase/" + prop.state.caseNumber,
      ];

      axios
        .all(getCaseNumberEndpoints.map((endpoint) => axios.get(endpoint)))
        .then((res) => {
          if (res[0].status === 200) {
            //apiArray = [...res[4].data];
            res[0].data.map((apiKey) => {
              gridApiArray.push(getGridDataValues(apiKey));
            });
            setPayToTableRowsData(...payToTableRowsData, gridApiArray);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
      console.log("payToTableRowsData Values: ", payToTableRowsData);
    }
  }, []);

  const addTableRows = (triggeredFormName) => {
    const rowsInput = {
      // specialityDefault:'',
      // primaryDefault:'',
      // pcpDefault:''
    };

    if (triggeredFormName === "PayToTable") {
      setPayToTableRowsData([...payToTableRowsData, rowsInput]);
    }
  };

  const deleteTableRows = (index, triggeredFormName, operationValue) => {
    if (
      operationValue !== "Edit" &&
      (operationValue === "Add" || operationValue === "Force Delete")
    ) {
      if (triggeredFormName === "PayToTable") {
        const rows = [...payToTableRowsData];
        rows.splice(index, 1);
        setPayToTableRowsData(rows);
      }
    }
    // const rows = [...specialityTableRowsData];
    // rows.splice(index, 1);
    // setspecialityTableRowsData(rows);
  };

  const handleGridFieldChange = (index, evnt, triggeredFormName) => {
    console.log("Inside handleGridFieldChange: ", triggeredFormName);
    let rowsInput = "";
    const { name, value } = evnt.target;
    if (triggeredFormName === "PayToTable") {
      //console.log('Inside LicenseTable');
      rowsInput = [...payToTableRowsData];
    }
    //console.log('Inside handleGridFieldChange: ',rowsInput);
    rowsInput[index][name] = value;
    if (triggeredFormName === "PayToTable") {
      setPayToTableRowsData(rowsInput);
    }
  };

  const handleGridSelectChange = (
    index,
    selectedValue,
    evnt,
    triggeredFormName,
  ) => {
    console.log("Inside select change trigeredFormName: ", triggeredFormName);
    let rowsInput = "";
    const { name } = evnt;
    if (triggeredFormName === "PayToTable") {
      console.log("Inside PayToTable");
      rowsInput = [...payToTableRowsData];
    }
    //console.log("Inside select change event: ",rowsInput);
    //rowsInput[index][name] = selectedValue;
    if (evnt.action === "clear") {
      //printConsole('Inside selectvalue null before delete: ',rowsInput[index]);
      delete rowsInput[index][name];
      //printConsole('Inside selectvalue null after delete: ',rowsInput[index]);
    } else {
      rowsInput[index][name] = selectedValue;
    }
    //console.log("rowsInput: ",rowsInput);
    if (triggeredFormName === "PayToTable") {
      setPayToTableRowsData(rowsInput);
    }
  };

  const saveGridData = () => {
    let apiUrlArray = [];
    let apiStr = apiUrl;
    let apiUrlObject = {};
    const payToResponse = getGridDataValues(payToTableRowsData);
    //console.log("specialityResponse: ",licenseResponse);
    if (payToResponse.length > 0) {
      apiUrlObject["name"] = "PayTo Table";
      apiStr = apiStr + "addPayTo/payTo";
      apiUrlObject["apiKey"] = apiStr;
      apiUrlObject["apiValue"] = payToResponse;
      apiUrlArray.push(apiUrlObject);
      apiStr = apiUrl;
      apiUrlObject = {};
    }

    if (apiUrlArray.length > 0) {
      console.log("apiUrlArray: ", apiUrlArray);
      axios
        .all(
          apiUrlArray.map((endpoint) =>
            axios.post(endpoint["apiKey"], endpoint["apiValue"]),
          ),
        )
        .then((res) => {
          for (let i = 0; i < apiUrlArray.length; i++) {
            if (res[i].status === 200) {
              alert(apiUrlArray[i]["name"] + " data saved successfuly");
            } else {
              alert("Error in saving " + apiUrlArray[i]["name"] + " data");
            }
          }
        })
        .catch((err) => {
          console.log(err.message);
          alert("Error in saving data");
        });
    }
    //     axios
    //   .post(apiUrl+'addSpeciality/speciality', specialityResponse)
    //   .then((res) => {
    //      console.log("api response: ",res.status);
    //      if(res.status === 200){
    //         alert("Speciality Data Saved Succesfully");
    //      }
    //   })
    //   .catch((err) => {
    //      console.log(err.message);
    //      alert("Error in saving data");
    //   });
  };

  const getGridDataValues = (tableData) => {
    //var headers = document.getElementById(tableId).headers;
    let returnArray = [];
    tableData.map((data) => {
      const dataObject = {};
      const dataKeys = Object.keys(data);
      dataKeys.forEach((dataValue) => {
        const dataKeyType = typeof data[dataValue];
        if (dataKeyType === "object") {
          dataObject[dataValue] =
            data[dataValue].value !== undefined ? data[dataValue].value : "";
        }
        if (dataKeyType !== "object") {
          dataObject[dataValue] = data[dataValue];
        }
      });
      returnArray.push(dataObject);
    });
    return returnArray;
  };

  return (
    <>
      <div
        className="GroupPayTo backgroundColor"
        style={{ minHeight: "100vh" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-xs-6" style={{ textAlign: "center" }}>
              <br />
              <label id="tileFormLabel" className="HeadingStyle"></label>
              <button
                type="button"
                className="btn btn-outline-primary btnStyle"
                onClick={(event) => navigateHome(event)}
                style={{ float: "left", marginLeft: "10px" }}
              >
                Go To Home
              </button>
              <button
                type="button"
                className="btn btn-outline-primary btnStyle"
                onClick={(event) => saveGridData(event)}
                style={{ float: "right", marginRight: "10px" }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
        <br />
        <div className="container" style={{ overflow: "auto", height: "auto" }}>
          <div className="accordion" id="accordionPanelsStayOpenExample">
            <div className="accordion-item">
              <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                <button
                  className="accordion-button accordionButtonStyle"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseOne"
                  aria-expanded="true"
                  aria-controls="panelsStayOpen-collapseOne"
                >
                  Pay To
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseOne"
                className="accordion-collapse collapse show"
                aria-labelledby="panelsStayOpen-headingOne"
              >
                <div className="accordion-body">
                  <div className="row">
                    <div className="col-xs-6 col-md-12">
                      <PayToTable
                        payToTableRowsData={payToTableRowsData}
                        addTableRows={addTableRows}
                        deleteTableRows={deleteTableRows}
                        calledFormName={GroupPayTo.validate}
                        handleGridSelectChange={handleGridSelectChange}
                        handleGridFieldChange={handleGridFieldChange}
                        modifyValidatedAddressPayToRow={
                          modifyValidatedAddressPayToRow
                        }
                      ></PayToTable>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <footer className='footerStyle'>
            <div className="content-wrapper">
                <div className='float-left'>
                    <h6></h6>
                </div>
            </div>
        </footer> */}

        <FooterComponent />
      </div>

      {/* <footer style={{boxShadow: "0 2px 4px 0 rgb(0 0 0 / 15%)",background:"white",margin:"20px"}}>
    </footer> */}
    </>
  );
}
