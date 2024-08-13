import React, { useState, useEffect, useRef } from "react";
import useUpdateDecision from "../Components/CustomHooks/useUpdateDecision";
import useCallApi from "../Components/CustomHooks/useCallApi";
import TableComponent from "../util/TableComponent";
import DocumentVersionModal from "../Components/SelfServiceTiles/TileFormModals/DocumentVersionModal";

export default function DocumentVersion(docProps) {
  const [versionModalshow, setVersionModalShow] = useState(false);

  const { downloadFile } = useCallApi();

  useEffect(() => {
    handleModalShowHide(true);
  }, []);

  const handleModalShowHide = (flag) => {
    if (!flag) {
      docProps.setModalShow({ ...docProps.modalshow, Version: false });
    }
    setVersionModalShow(flag);
  };

  const showDocVersion = () => {
    let docData = [...docProps.docData];

    if (docData.length > 0) {
      let outerArry = [...docData];
      if (docProps.convertArrayToOuterArray !== undefined) {
        outerArry = docProps.convertArrayToOuterArray(outerArry);
      }
      let clickedIndex = docProps.clickedIndex;
      let docName = outerArry[clickedIndex].documentType;
      let version = "1.";
      let versionIndex = 1;
      if (docName !== undefined && docName !== null) {
        let docArr = sortArray(docData);
        docArr = docArr.filter((elem) => {
          if (elem.documentType === docName) {
            elem.version = version + versionIndex++;
            return elem;
          }
        });
        //printTable(docArr);
        // const columnNames =
        //   "Document Type~documentType,Document Name~documentName,Version~version";
        const columnNames =
          "Document Name~documentType,Uploaded FileName~documentName,Version~version";
        if (docArr.length > 0) {
          return (
            <>
              <TableComponent
                columnName={columnNames}
                rowValues={docArr}
                isDownload={true}
                downloadFile={downloadFile}
              />
            </>
          );
        }
      }
    }
  };

  const sortArray = (arr) => {
    const sortedAsc = arr.sort(
      (objA, objB) =>
        Number(objA.uploadedDateTime) - Number(objB.uploadedDateTime),
    );
    return sortedAsc;
  };

  return (
    <>
      {versionModalshow && (
        <DocumentVersionModal
          showDocVersion={showDocVersion}
          handleModalShowHide={handleModalShowHide}
          modalshow={versionModalshow}
        />
      )}
    </>
  );
}
