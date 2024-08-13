import * as XLSX from "xlsx";

const expectedHeaders = [
  "PROVIDER TYPE",
  "FIRST NAME",
  "MIDDLE",
  "LAST",
  "GENDER",
  "SUFFIX",
  "DELEGATED",
  "DIRECTORY",
  "CAQHID",
  "NPI",
  "DOB",
  "MEDICAREID",
  "ACCEPTING NEW",
  "EMAILID",
  "LEGAL ENTITY NAME",
  "CONTRACT ID",
  "DBA NAME",
  "LICENSE_NUMBER",
  "LICENSE_STATE",
  "LICENSE TYPE",
  "LICENSE EXPIRATION DATE",
  "SPECIALITY",
  "TAXONOMY",
  "PCP",
  "MEDICAL GROUP NAME",
  "LANGUAGE SPOKEN",
  "LOCATION_ADDRESS_1",
  "LOCATION_ADDRESS_2",
  "LOCATION_CITY",
  "LOCATION_COUNTY",
  "LOCATION_STATE",
  "LOCATION_ZIP CODE",
  "OFFICE PHONE",
  "OFFICE FAX",
  "PUBLIC TRANSPORTATION",
  "HANDICAP ACCESS",
  "TTY HEARING",
  "TTY PHONE",
  "TELE MEDICINE",
  "TAXID",
  "PAYTONAME",
  "PAYTO_ADDRESS_1",
  "PAYTO_ADDRESS_2",
  "PAYTO_CITY",
  "PAYTO_COUNTY",
  "PAYTO_STATE",
  "PAYTO_ZIP CODE",
  "PAYTONPI",
];

const delegateColumns = ["PROVIDER TYPE", "DELEGATED", "NPI", "CONTRACT ID"];
const nonDelegateColumns = ["PROVIDER TYPE", "DELEGATED", "NPI", "CAQHID"];

const readFile = (file, rosterType, callback) => {
  let currentStep = 0;
  const missingFields = new Set();

  const handleStep = (message, isValid, missingFields) => {
    if (!isValid) {
      callback(message, false, currentStep, missingFields);
    } else {
      callback(message, true, currentStep, missingFields);
    }
  };

  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const numColumns = rows[0].length;

      if (numColumns !== expectedHeaders.length) {
        currentStep = 1;
        handleStep(`Number of columns are not matching.`, false);
        return;
      }

      const actualHeaders = rows[0].map((header) => header.toUpperCase());
      const columnMismatch = expectedHeaders.some(
        (header, index) => header !== actualHeaders[index],
      );
      if (columnMismatch) {
        currentStep = 2;
        handleStep(
          `Column names in the Excel file do not match the expected column names.`,
          false,
        );
        return;
      }

      const rowData = rows.slice(1).filter((row) => row.some((cell) => cell));

      const expectedColumns =
        rosterType === "delegated" ? delegateColumns : nonDelegateColumns;

      const columnIndices = expectedColumns.map((col) =>
        actualHeaders.indexOf(col.toUpperCase()),
      );

      const extractedValues = rowData.map((row) =>
        columnIndices.map((index) => row[index]),
      );

      let hasEmptyValue = false;
      let hasInvalidDelegation = false;

      extractedValues.forEach((row) => {
        row.forEach((value, index) => {
          if (value === undefined || value === "") {
            hasEmptyValue = true;
            missingFields.add(expectedColumns[index]);
          }
          if (
            expectedColumns[index].toUpperCase() === "DELEGATED" &&
            ((rosterType === "delegated" && value !== "Y") ||
              (rosterType === "nondelegated" && value !== "N"))
          ) {
            hasInvalidDelegation = true;
          }
        });
      });
      console.log("extracted value", extractedValues);
      if (hasInvalidDelegation) {
        currentStep = 3;
        const message =
          rosterType === "delegated"
            ? "Some fields are not delegated."
            : "Some fields are delegated.";
        handleStep(message, false, []);
      } else if (hasEmptyValue) {
        currentStep = 3;
        const message = `Some of the Required Fields are blank in the uploaded file.
        \n\n Columns with missing fields: ${[...missingFields].join(", ")}`;
        handleStep(message, false, currentStep, [...missingFields]);
      } else {
        currentStep = 4;
        handleStep(null, true, []);
      }
    } catch (error) {
      handleStep("Error reading the file.", null, []);
    }
  };

  reader.onerror = () => {
    handleStep("Error reading the file.", null, []);
  };

  reader.readAsArrayBuffer(file);
};

export default readFile;
