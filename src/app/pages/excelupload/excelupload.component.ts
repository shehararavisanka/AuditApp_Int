import { Component, ViewChild } from '@angular/core';

import * as XLSX from 'xlsx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as FileSaver from 'file-saver';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-excelupload',
  templateUrl: './excelupload.component.html',
  styleUrls: ['./excelupload.component.scss']
})
export class ExceluploadComponent {

  @ViewChild('fileInput') fileInput: any;

  constructor(public http: HttpClient, public serv: CommonService) {

  }
  arrayBuffer: any;
  file: any;

  dataset: any;
  dataset1: any;
  issearch = 0;
  upload1() {
    let fileReader = new FileReader();

    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      //  console.log('running')
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });


      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      this.dataset = (XLSX.utils.sheet_to_json(worksheet, { raw: true }));
      console.log(this.dataset)

      var first_sheet_name1 = workbook.SheetNames[1];
      var worksheet1 = workbook.Sheets[first_sheet_name1];
      this.dataset1 = (XLSX.utils.sheet_to_json(worksheet1, { raw: true }));
      console.log(this.dataset1)

    }
    fileReader.readAsArrayBuffer(this.file);
  }
  ret: any = "";
  ret1: any = "";
  
  savetodatabase() {
    this.issearch = 1;
    //return this.http.post('http://localhost:4100/api/Excelupload/create', this.dataset).toPromise();
    this.serv.savetodatabase(this.dataset).then(ret => {
      this.ret = ret;
       

      this.serv.savetodatabasesecond(this.dataset1).then(ret => {
        this.ret1 = ret;
        this.issearch = 0;

      });

    });




  }

  upload() {
    this.file = this.fileInput.nativeElement.files[0];
    // console.log( this.file)
    this.upload1();
  }
  incomingfile(event: any) {
    this.file = event.target.files[0];
  }



}
