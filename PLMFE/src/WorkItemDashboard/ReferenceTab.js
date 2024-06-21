import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import RefereceTable from "../Components/SelfServiceTiles/TileFormsTables/ReferenceTable";
import useGetDBTables from "../Components/CustomHooks/useGetDBTables";
import { useLocation } from "react-router-dom";

export default function ReferenceTab(tabInput) {
  const [referenceTableRowsData, setReferenceTableRowsData] = useState([]);

  //Added by Nidhi Gupta on 05/30/2023
  const reference = useSelector((store) => store.masterReference);
  //Till Here

  useEffect(() => {
    //Commented by Nidhi Gupta on 5/30/2023 in order to fetch master through Redux using generic get
    setReferenceTableRowsData(reference[0]);
  }, []);

  return (
    <>
      <div className="DecisionTab">
        <div className="Container">
          <div
            className="accordion AddProviderLabel"
            id="accordionPanelsStayOpenExample"
          >
            <div className="accordion-item">
              <h2
                className="accordion-header"
                id="panelsStayOpen-headingContract"
              >
                <button
                  className="accordion-button accordionButtonStyle"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseContract"
                  aria-expanded="true"
                  aria-controls="panelsStayOpen-collapseContract"
                >
                  Reference
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseContract"
                className="accordion-collapse collapse show"
                aria-labelledby="panelsStayOpen-headingContract"
              >
                <div className="accordion-body">
                  <div className="row my-2">
                    <div className="col-xs-6 col-md-12">
                      <RefereceTable
                        referenceTableRowsData={referenceTableRowsData}
                      ></RefereceTable>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
