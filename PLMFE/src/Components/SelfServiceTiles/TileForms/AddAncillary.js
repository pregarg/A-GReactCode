import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

export default function AddAncillary() {
  const navigate = useNavigate();
  const navigateHome = () => {
    console.log("Inside navigate Home");
    navigate("/Home", { replace: true });
  };
  const [changeState, setChangeState] = useState({
    firstName: "",
    lastName: "",
    managerEmail: "",
    managerPhone: "",
    orgName: "",
    Address: "",
    Address2: "",
    City: "",
    State: "",
    ZipCode: "",
    startDate: new Date(),
    managerFax: "",
  });

  const handleChange = (evt) => {
    const value = evt.target.value;
    console.log("Inside handleChange ", evt);
    setChangeState({
      ...changeState,
      [evt.target.name]: value,
    });
  };

  const handleDateChange = (date) => {
    setChangeState({
      ...changeState,
      startDate: date,
    });
  };

  return (
    <>
      <div className="AddAncillary">
        <div className="container" style={{ overflow: "auto", height: "auto" }}>
          <div className="accordion" id="accordionPanelsStayOpenExample">
            <div className="accordion-item">
              <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseOne"
                  aria-expanded="true"
                  aria-controls="panelsStayOpen-collapseOne"
                >
                  Administrative
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseOne"
                className="accordion-collapse collapse show"
                aria-labelledby="panelsStayOpen-headingOne"
              >
                <div className="accordion-body">
                  <div className="row g-2">
                    <div className="col-md">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="floatingInputGrid"
                          placeholder="name@example.com"
                          name="firstName"
                          onChange={(event) => handleChange(event)}
                          value={changeState.firstName}
                        />
                        <label htmlFor="floatingInputGrid">
                          Office Manager First Name
                        </label>
                      </div>
                    </div>
                    <div className="col-md mx-2">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="floatingInputGrid"
                          placeholder="name@example.com"
                          name="lastName"
                          onChange={(event) => handleChange(event)}
                          value={changeState.lastName}
                        />
                        <label htmlFor="floatingInputGrid">
                          Office Manager Last Name
                        </label>
                      </div>
                    </div>

                    <div className="col-md mx-2">
                      <div className="form-floating">
                        <input
                          type="email"
                          className="form-control"
                          id="floatingInputGrid"
                          placeholder="name@example.com"
                          name="managerEmail"
                          onChange={(event) => handleChange(event)}
                          value={changeState.managerEmail}
                        />
                        <label htmlFor="floatingInputGrid">
                          Office Manager Email
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="row g-2 my-2">
                    <div className="col-md">
                      <div className="form-floating">
                        <input
                          type="number"
                          className="form-control"
                          id="floatingInputGrid"
                          placeholder="name@example.com"
                          name="managerPhone"
                          onChange={(event) => handleChange(event)}
                          value={changeState.managerPhone}
                        />
                        <label htmlFor="floatingInputGrid">
                          Office Manager Phone
                        </label>
                      </div>
                    </div>
                    <div className="col-md mx-2">
                      <div className="form-floating">
                        <input
                          type="number"
                          className="form-control"
                          id="floatingInputGrid"
                          placeholder="name@example.com"
                          name="managerFax"
                          onChange={(event) => handleChange(event)}
                          value={changeState.managerFax}
                        />
                        <label htmlFor="floatingInputGrid">
                          Office Manager Fax
                        </label>
                      </div>
                    </div>

                    <div className="col-md mx-2">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="floatingInputGrid"
                          placeholder="name@example.com"
                          name="orgName"
                          onChange={(event) => handleChange(event)}
                          value={changeState.orgName}
                        />
                        <label htmlFor="floatingInputGrid">
                          Legal Entity Name
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseTwo"
                  aria-expanded="false"
                  aria-controls="panelsStayOpen-collapseTwo"
                >
                  Please Provide a Provider Address of Notice
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseTwo"
                className="accordion-collapse collapse show"
                aria-labelledby="panelsStayOpen-headingTwo"
              >
                <div className="accordion-body">
                  <div className="row g-2">
                    <div className="col-md">
                      <div className="form-floating">
                        <input
                          className="form-control"
                          id="floatingInputGrid"
                          placeholder="name@example.com"
                          name="Address"
                          onChange={(event) => handleChange(event)}
                          value={changeState.Address}
                        />
                        <label htmlFor="floatingInputGrid">Address</label>
                      </div>
                    </div>
                    <div className="col-md mx-2">
                      <div className="form-floating">
                        <input
                          className="form-control"
                          id="floatingInputGrid"
                          placeholder="name@example.com"
                          name="Address2"
                          onChange={(event) => handleChange(event)}
                          value={changeState.Address2}
                        />
                        <label htmlFor="floatingInputGrid">Address 2</label>
                      </div>
                    </div>

                    <div className="col-md mx-2">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="floatingInputGrid"
                          placeholder="name@example.com"
                          name="City"
                          onChange={(event) => handleChange(event)}
                          value={changeState.City}
                        />
                        <label htmlFor="floatingInputGrid">City</label>
                      </div>
                    </div>
                  </div>

                  {/* <div className="container"> */}
                  <div className="row g-2 my-2">
                    <div className="col-md">
                      <div className="form-floating">
                        <select
                          className="form-select"
                          id="floatingSelect"
                          aria-label="Floating label select example"
                          name="State"
                          onChange={(event) => handleChange(event)}
                          value={changeState.State}
                        >
                          <option selected>Select</option>
                          <option value="1">AL</option>
                          <option value="2">FL</option>
                          <option value="3">AU</option>
                          <option value="3">ZL</option>
                        </select>
                        <label htmlFor="floatingSelect">State</label>
                      </div>
                    </div>
                    <div className="col col-md-4 mx-2">
                      <div className="form-floating">
                        <input
                          type="number"
                          className="form-control"
                          id="floatingInputGrid"
                          placeholder="name@example.com"
                          name="ZipCode"
                          onChange={(event) => handleChange(event)}
                          value={changeState.ZipCode}
                        />
                        <label htmlFor="floatingInputGrid">ZipCode</label>
                      </div>
                    </div>
                    <div className="col col-md-4 mx-2">
                      <label htmlFor="datePicker">Date</label>
                      <div className="form-floating">
                        <ReactDatePicker
                          selected={changeState.startDate}
                          onChange={(event) => handleDateChange(event)}
                          name="startDate"
                          dateFormat="MM/dd/yyyy"
                          id="datePicker"
                        />
                      </div>
                    </div>
                  </div>
                  {/* </div> */}
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="panelsStayOpen-headingThree">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseThree"
                  aria-expanded="false"
                  aria-controls="panelsStayOpen-collapseThree"
                >
                  Select a Product(s) & State(s)
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseThree"
                className="accordion-collapse collapse show"
                aria-labelledby="panelsStayOpen-headingThree"
              >
                <div className="accordion-body">
                  <div className="row g-2">
                    <div className="col-md mx-2">
                      <div className="form-floating">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="medicaidSwitch"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="medicaidSwitch"
                          >
                            Medicaid
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="col-md mx-2">
                      <div className="form-floating">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="medicareSwitch"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="medicareSwitch"
                          >
                            Medicare
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="col-md mx-2">
                      <div className="form-floating">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="exchangeSwitch"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="exchangeSwitch"
                          >
                            Exchange
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="col-md mx-2">
                      <div className="form-floating">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="commercialSwitch"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="commercialSwitch"
                          >
                            Commercial
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="col-md mx-2">
                      <div className="form-floating">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="behavioralSwitch"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="behavioralSwitch"
                          >
                            Behavioral Health
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer
        style={{
          textAlign: "left",
          boxShadow: "0 2px 4px 0 rgb(0 0 0 / 15%)",
          background: "white",
        }}
      >
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={(event) => navigateHome(event)}
        >
          Go To Home
        </button>
      </footer>
    </>
  );
}
