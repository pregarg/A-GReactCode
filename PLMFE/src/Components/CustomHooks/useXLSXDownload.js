import * as XLSX from 'xlsx';

export default function useXLSXDownload() {
  function downloadHandler(data, title) {
    var workbook = XLSX.utils.book_new();
    var worksheet = XLSX.utils.json_to_sheet(data);
    var currentdate = new Date();

    var dateString = (currentdate.getMonth() + 1) + "-" + currentdate.getDate() + "-" + currentdate.getFullYear() + " " + currentdate.getHours() + "-" + currentdate.getMinutes() + "-" + currentdate.getSeconds();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    var excelData = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    var data = new Blob([excelData], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    var url = URL.createObjectURL(data);
    var link = document.createElement("a");
    link.href = url;
    link.download = title + " " + dateString + ".xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return [downloadHandler];
}
