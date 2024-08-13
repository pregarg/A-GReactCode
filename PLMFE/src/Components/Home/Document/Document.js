import React from "react";
import documentTableImage from "../../../Images/documentTableImage.png";

export default function Document() {
  return (
    <div className="Document">
      <div className="container">
        <div className="row">
          <div className="col-xs-6">
            <br />
            <table
              className="table table-striped table-bordered dashboardTableBorder"
              style={{ textAlign: "center" }}
            >
              <thead>
                <tr className="dashboardTableHeader">
                  <th scope="col">Type</th>
                  <th scope="col">View</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Welcome Letter</td>
                  <td>
                    <img
                      id="welcomeContentImage"
                      src={documentTableImage}
                      className="img-fluid"
                      alt="..."
                      style={{ height: "30px", background: "inherit" }}
                    ></img>
                  </td>
                </tr>
                <tr>
                  <td>Contract</td>
                  <td>
                    <img
                      id="contractImage"
                      src={documentTableImage}
                      className="img-fluid"
                      alt="..."
                      style={{ height: "30px", background: "inherit" }}
                    ></img>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
