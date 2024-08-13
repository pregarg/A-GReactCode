import axios from "../../api/axios";
import { useAxios } from "../../api/axios.hook";
import useUpdateDecision from "./useUpdateDecision";

export default function useCallApi() {
  const { fileUpDownAxios } = useAxios();

  const { printConsole } = useUpdateDecision();

  const getLinkingData = async (token, type, userName, cname) => {
    let respData = [];
    let getApiJson = {};
    getApiJson["option"] = "GETLINKINGDATA";
    getApiJson["Type"] = type;
    getApiJson["UserName"] = userName;
    getApiJson["CName"] = cname;
    //getApiJson['whereClause'] = {'PLM_USER_ID':'=~'+userName};
    console.log("getProvContLinkData api input: ", getApiJson);
    let res = await executeApi(token, getApiJson);
    console.log(
      "Inside useCallApi getLinkingData Data after promise resolve ",
      res,
    );
    if (res !== undefined) {
      if (res.data.CallProcedure_Output.Status === 0) {
        respData = [...res.data.CallProcedure_Output.data];
        //respData = JSON.parse(respData)
        console.log(
          "Get data Response for getProvContLinkData 2: ",
          respData[0],
        );
      }
    }
    return respData;
  };

  const executeApi = async (token, getApiJson) => {
    let respData = await axios.post("/generic/callProcedure", getApiJson, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(
      "Inside useCallApi executeApi Data before promise resolve ",
      respData,
    );
    return await respData;
  };

  const downloadFile = (index, documentData) => {
    printConsole("Inside useCallApi hook downloadFile index: ", index);
    printConsole("Inside useCallApi hook downloadFile: ", documentData);
    const caseId =
      documentData[index]?.caseNumber === undefined ||
      documentData[index]?.caseNumber === null
        ? 0
        : Number(documentData[index]?.caseNumber);
    printConsole("Inside useCallApi hook downloadFile caseNumber: ", caseId);
    const documentType =
      documentData[index]?.documentType === undefined
        ? ""
        : documentData[index]?.documentType;
    const documentName = documentData[index]?.documentName;
    const fileData = new FormData();
    let downloadFilePath = "";
    if (documentData[index]?.docUploadPath !== undefined) {
      downloadFilePath = documentData[index]?.docUploadPath;
      //downloadFilePath = downloadFilePath.replaceAll('/','\\');
      fileData.append("downloadFilePath", downloadFilePath);
      //printConsole("Download file path: "+downloadFilePath);
    }
    fileData.append("caseNumber", caseId);
    fileData.append("docType", documentType);
    fileData.append("docName", documentName);
    // fileUpDownAxios.get("/downloadFile/"+caseId+'/'+documentType+'/'+documentName,fileData,{responseType: 'blob'}).then((response) => {
    fileUpDownAxios
      .post("/downloadFile", fileData, { responseType: "blob" })
      .then((response) => {
        printConsole("Download api response: ", response);
        // const filename =  response.headers.get('Content_Disposition').split('filename=')[1];
        //const docName = documentData[index].documentName;
        let docName = "";
        let appendName = "";
        //console.log("downloadFilePath: ",downloadFilePath);
        if (downloadFilePath !== "") {
          docName = downloadFilePath.substring(
            downloadFilePath.lastIndexOf("/") + 1,
          );
        } else {
          docName = documentData[index].documentName;
        }

        if (documentType === "") {
          appendName = docName.substring(0, docName.lastIndexOf("."));
        } else {
          appendName = documentType;
        }
        //console.log("docName: ",docName);
        const filename =
          appendName +
          "_" +
          caseId +
          docName.substring(docName.lastIndexOf("."), docName.length);
        console.log("File Name: ", filename);
        let url = window.URL.createObjectURL(new Blob([response.data]));
        //console.log("Url: ",url);
        let a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
      })
      .catch((err) => {
        printConsole("Caught in download file: ", err);
        //alert("Failed to download File");
        alert("Please upload file first before downloading.");
      });
  };
  return { getLinkingData, downloadFile };
}
