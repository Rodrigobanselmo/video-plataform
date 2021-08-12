declare module 'read-excel-file' {
  declare const readXlsxFile: (file: File, schema: any) => Promise<any[], any>;

  export default readXlsxFile;
}
