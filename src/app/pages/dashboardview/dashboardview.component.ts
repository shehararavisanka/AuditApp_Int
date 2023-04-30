import { Component, HostListener, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { numbers } from '@material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { SocketService } from 'src/app/services/socket.service';
import { OrderhistoryComponent } from '../orderhistory/orderhistory.component';
export class FilteData {
  ItemCode: string = '';
  category: string = '';
  ItmCode: string = '';
  Location: string = '';
  lot: string = '';
  Lot: string = '';
  Exception: string = '';
  IsChecked: boolean = false;
  IsCheckedC: string = '';
}

export class dataset {
  data: any = [];
}

export class UserDteials {
  Rackno: string = '';
}


@Component({
  selector: 'app-dashboardview',
  templateUrl: './dashboardview.component.html',
  styleUrls: ['./dashboardview.component.scss']
})

export class DashboardviewComponent {

  dataset: any = [];
  userType: any = "Rack7";
  userIdx: any = "97CFA6D3-89FF-4395-9BD8-40198CC2A299";
  custsearch: any = "";
  filterdataset = new FilteData();
  isshow = 0;
  issearch = 0;
  constructor(public serv: CommonService, public servv: SocketService

  ) {
    var usertype = localStorage.getItem('groupno');
    this.userType = usertype;
    this.userIdx = localStorage.getItem('userIdx');
    console.log(this.userType)
    this.LoadDatafirsttime();
    this.LoaduserId();

    document.getElementById("email")?.click();

    //this.socket.emit('connection', "");

    //  console.log("come")

  }

  ngOnInit(): void {

    this.servv.connect();
    this.recieveStartGame();
    //this.recieveJoinedPlayers();
  }

  updateStock(row: any) {
    this.serv.updatestock(row).then((words) => {
      this.servv.startGame1(5);
    });

  }

  recieveStartGame() {
    this.servv.recieveStartGame().subscribe((words) => {
      this.LoadData();
    });
  }


  ret2: any;
  LoaduserId() {
    var det = new UserDteials();
    det.Rackno = this.userType
    this.serv.LoaduserId(det).then(ret => {
      //  console.log(ret);
      this.ret2 = ret;


    });
  }
  ret3: any;
  LoadDatafirsttime() {
    this.ret = new dataset();
    this.serv.getDatafromMainDropdown(this.filterdataset).then(ret => {
      // console.log(ret);
      this.ret3 = ret;
      //    console.log(this.ret3.data[1]);
      this.ret.data[1] = this.ret3.data[1];
      //   console.log(this.ret.data[1]);
      //  this.userIdx=this.ret2.data[0][0].Idx;
    });
  }
  //PMICOMGLTP
  ret1: any;
  ret: any;
  ret5:any;
  selectedrow: any;
  Isshowtable:number=0;


  secondtbl:any;
  QtyKGsum:any;
  RateperKG:any;
  onclickCate(subLst:any){

    
    if(this.filterdataset.category=='BLENDED TEA' || this.filterdataset.category=='WIP Tea' || this.filterdataset.category=='WIP PM'){

      this.serv.getDatafromSecond(subLst).then(ret => {
        this.ret5=ret;
        this.secondtbl=this.ret5.data[0];
        this.QtyKGsum=0;
        var rowsum=0;
        this.secondtbl.filter((ret:any)=>{

     
          rowsum=rowsum+(Number(ret.QtyKG)* Number(ret.RateperKG));
          this.QtyKGsum=this.QtyKGsum+ Number(ret.QtyKG); 
         

        })
        this.RateperKG=rowsum/this.QtyKGsum;

      });


        
      }else{
        document.getElementById("exampleModalCenter1")?.click();
      }
  }




  LoadData() {
    this.issearch = 1; 

    if(this.filterdataset.category=='TEA IMPORTED' || this.filterdataset.category=='TEA LOCAL'){
      this.Isshowtable=1;
    }
    else {
      this.Isshowtable=0;
    }

   
    


    console.log(this.userType)
    if (this.filterdataset.IsChecked == true && this.userType=='StockM') {
      this.filterdataset.IsCheckedC = '0';
    } else if (this.filterdataset.IsChecked == true) {
      this.filterdataset.IsCheckedC = '';
    }else   {
      this.filterdataset.IsCheckedC = '';
    }

    this.serv.getDatafromMain(this.filterdataset).then(ret => {
      //   console.log(ret);
      this.ret1 = ret;
      this.dataset = this.ret1.data[0];
      this.ret.data[2] = this.ret1.data[2];
      this.ret.data[3] = this.ret1.data[3];
      this.ret.data[4] = this.ret1.data[4];
      if (this.dataset.length == 0) {
        this.issearch = 0;
        this.isshow = 2;
      } else {
        this.issearch = 0;
        this.isshow = 1;
      }

    });

  }


  updateuserHistory(row: any) {

    row.orderQty = Number(row.orderQtyNew) - Number(row.orderQty); 
    row.rackno=this.rackNo;
    this.serv.updateuserHistory(row).then(ret=>{
      this.loadOrderHistory(this.rackNo);
      this.LoadData();
    });

  }
  clearFilter() {
    this.isshow = 0;
    this.filterdataset = new FilteData();
    this.LoadDatafirsttime();
    this.dataset = [];
  }
  clearFilter1() {
    this.isshow = 0;
    this.filterdataset.Location="";
    this.filterdataset.ItmCode="";
    this.filterdataset.lot="";
    this.filterdataset.Exception="";
    this.LoadDatafirsttime();
    this.LoadData(); 
    this.dataset = [];
  }
  disablebtn = 0;
  rackNo = "";

  @HostListener('document:keypress', ['$event'])
  keyEvent(event: KeyboardEvent) {

    if (event.keyCode === 13 && this.disablebtn != 1) {
      // console.log("asdsad asfd");
      this.saveItemQty();
      document.getElementById("exampleModalCenter")?.click();
      this.orderqty =0;
    } else if (event.keyCode === 13 && this.disablebtn == 1) {
      document.getElementById("exampleModalCenter")?.click();
    }
  }

  OnHand:any;
  Verified:any;
  openDialog(row: any, type: string) {
    this.disablebtn = 0;
    this.rackNo = type;
    this.orderqty =0;
    console.log(row)
    if(row.IsChecked==1){
      this.disablebtn = 1;
      this.selectedrow = row;
      this.loadOrderHistory(type);
      this.Varient = Number(this.selectedrow.varience);
      this.OnHand=row.onHandQty;
      this.Verified=row.verified;
    }
    else if (type == this.userType || this.userType == "Admin"   ) {
      this.selectedrow = row;
      this.selectedrow.rackno = type;
      this.loadOrderHistory(type);
      this.Varient = Number(this.selectedrow.varience);
      this.OnHand=row.onHandQty;
      this.Verified=row.verified;

    } else {
      this.disablebtn = 1;
      this.selectedrow = row;
      this.loadOrderHistory(type);
      this.Varient = Number(this.selectedrow.varience);
      this.OnHand=row.onHandQty;
      this.Verified=row.verified;
    }
  }


  ret4: any;

  loadOrderHistory(type: string) {
    this.selectedrow.userType = type;

    this.serv.loadItemQty(this.selectedrow).then(ret => {
      this.ret4 = ret;
      this.datasetOrder = this.ret4.data[0];

    });

  }

  cal(val: number) {

    if (val > 0) {
      return "Excess"
    } else if (val == 0) {
      return "Stock OK"
    } else {
      return "Low Qty"
    }


  }

  Varient: any = '';
  orderqty: any;
  datasetOrder: any;

  saveItemQty() {
    this.selectedrow.orderqty = this.orderqty;
    this.selectedrow.userIdx = this.userIdx;
    //this.selectedrow.rackno= this.userType

    if (this.orderqty > 0) {
      this.serv.saveItemQty(this.selectedrow).then(ret => {
        // console.log(ret);
        this.servv.startGame1(5);
        this.LoadDatafirsttime();
        this.LoadData();
        this.loadOrderHistory(this.userType);
        this.orderqty = 0;
      });

    }
  }


}
