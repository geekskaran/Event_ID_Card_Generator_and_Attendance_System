 
  // excelExport.js
  import * as XLSX from 'xlsx';
  
  export const exportToExcel = (data, filename) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };
  
  export const formatDataForExport = (records, type) => {
    return records.map(record => ({
      ID: record.id,
      Name: record.name,
      Type: type,
      Timestamp: new Date(record.timestamp).toLocaleString(),
      ...record.additionalData
    }));
  };