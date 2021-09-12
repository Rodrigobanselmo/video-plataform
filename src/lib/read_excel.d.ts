declare module 'read-excel-file' {
  declare const readXlsxFile: (file: File, schema: any) => Promise<any[], any>;

  export default readXlsxFile;
}

declare module 'write-excel-file' {
  declare const writeXlsxFile: (data: any, options: any) => Promise<void>;

  export default writeXlsxFile;
}
