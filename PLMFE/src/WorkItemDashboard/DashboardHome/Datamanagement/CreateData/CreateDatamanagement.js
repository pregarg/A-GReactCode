import FieldSection from "./FieldSection";
import TableSection from "./TableSection";

export default function CreateDatamanagement() {
  return (
    <div className="accordion mt-2">
      <h2 className="accordion-header" id="panelsStayOpen-headingOne">
        <button
          className="accordion-button accordionButtonStyle"
          type="button"
          aria-expanded="true"
          aria-controls="panelsStayOpen-collapseOne"
        >
          Create / Delete Table
        </button>
      </h2>
      <div
        id="panelsStayOpen-collapseOne"
        className="accordion-collapse collapse show"
        aria-labelledby="panelsStayOpen-headingOne"
      >
        <div className="accordion-body">
          <div
            className="row pt-2"
            style={{ backgroundColor: "white", minHeight: "600px" }}
          >
            <div className="col-xs-6 col-md-12">
              <div className="row">
                <div className="col-3">
                  <TableSection />
                </div>

                <div className="offset-1 col-8">
                  <FieldSection />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
