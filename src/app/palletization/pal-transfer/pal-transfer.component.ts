import { Component, OnInit, ViewChild } from '@angular/core';
import { Pallet } from 'src/app/models/Inbound/Pallet';
import { Commonservice } from 'src/app/services/commonservice.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pal-transfer',
  templateUrl: './pal-transfer.component.html',
  styleUrls: ['./pal-transfer.component.scss']
})
export class PalTransferComponent implements OnInit {

  showLoader: boolean = false;
  showLookup: boolean = false;
  lookupFor: any = "";
  selectedPallets: any = Array<Pallet>();
  public serviceData: any;
  autoGeneratePalletEnable: boolean = false;
  showNewPallet: boolean = false;
  createdNewPallet: string = "";
  itemCode: string = "";
  itemsList: any;
  showHideGridToggle: boolean = false;
  showHideBtnTxt: string;
  toPalletNo: string = "";
  fromPalletNo: string = "";
  fromPalletLookup: string = "";
  palletData: any;
  finalPalletData: any[] = [];
  showConfirmDialog: boolean;
  rowindexForDelete: any;
  gridDataAfterDelete: any[];
  dialogMsg: string = ""
  yesButtonText: string = "";
  noButtonText: string = "";
  operationType: string = "";
  dialogFor: string = "";
  toBin: string;
  toWhse: string;
  newCreatedPalletNo: string;
  @ViewChild('fromPalletInput') fromPalletInput
  @ViewChild('toPalletInputs') toPalletInputs

  constructor(private commonservice: Commonservice,
    private router: Router, private toastr: ToastrService, private translate: TranslateService) {
    this.showHideBtnTxt = this.translate.instant("showGrid");
  }

  ngOnInit() {
    if (localStorage.getItem("AutoPalletIdGenerationChecked") == "True") {
      this.autoGeneratePalletEnable = true;
    }
  }

  ngAfterViewInit(): void{
    this.fromPalletInput.nativeElement.focus()
    setTimeout(()=>{
      this.showHideBtnTxt = this.translate.instant("showGrid");
    },500)
  }

  public getFromPalletList(from: string) {
    this.showLoader = true;
    this.commonservice.GetPalletsWithRowsPresent().subscribe(
      (data: any) => {
        this.showLoader = false;
        //console.log(data);
        if (data != null) {
          if (data.length > 0) {
          //  console.log(data);
            this.showLoader = false;
            this.serviceData = data;
            this.showLookup = true;
            this.lookupFor = "PalletList";
            this.fromPalletLookup = from;
            return;
          } else {
            this.showLookup = false;
            this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
          }
        }
      },
      error => {
        this.showLoader = false;
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
  }

  public getPalletList(from: string) {
    //This code will work for to pallet... fro FromPallet now we are calling seperate API.
    var code = "";
    if (from == "from_pallet") {
      code = this.toPalletNo;
    } 
    else if (from == "to_pallet") {
      code = this.fromPalletNo;
     // console.log("code: " + code);
    }

    this.showLoader = true;
    this.commonservice.getPalletsOfSameWarehouse(code).subscribe(
      (data: any) => {
        this.showLoader = false;
       // console.log(data);
        if (data != null) {
          if (data.length > 0) {
          //  console.log(data);
            this.showLoader = false;
            this.serviceData = data;
            this.showLookup = true;
            this.lookupFor = "PalletList";
            this.fromPalletLookup = from;
            return;
          } else {
            this.showLookup = false;
            this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
          }
        }
      },
      error => {
        this.showLoader = false;
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
  }

  onPalletScan() {
    // alert("scan click");
  }

  onPalletChangeBlur(from: string){
    if(this.isValidateCalled){
      return;
    }
    this.onPalletChange(from);
  }

  async onPalletChange(from: string): Promise<any> {

    if (from == "from_pallet") {
      if (this.fromPalletNo == '' || this.fromPalletNo == undefined) {
        this.palletData = [];
        // this.toPalletNo = '';
        return;
      }
    }
    if (from == "to_pallet") {
      if (this.toPalletNo == '' || this.toPalletNo == undefined) {
        this.palletData = [];
        return;
      }
    }


    var plt;
    if (from == "from_pallet") {
      plt = this.fromPalletNo;
    } else {
      plt = this.toPalletNo;
    }
    if (this.toPalletNo == this.fromPalletNo) {
      this.toastr.error('', this.translate.instant("Plt_PalletShouldNotSame"));
      this.toPalletNo = '';
      this.palletData = [];
      return;
    }

    this.showLoader = true;
    var result = false;
    await this.commonservice.isPalletValid(plt).then(
      (data: any) => {
        console.log("inside isPalletValid "+from);
        this.showLoader = false;
        if (data != null) {
          if (data.length > 0) {
            if (from == "from_pallet") {
              this.fromPalletNo = data[0].Code;
              this.palletData = [];
              this.toPalletNo = '';
            } else if (from == "to_pallet") {
              this.toPalletNo = data[0].Code;
            }
            //Reset grid data.
            if (this.fromPalletNo != '' && this.toPalletNo != '') {
              this.getPalletData();
            }
            result = true;
          } else {
            this.palletData = [];
            this.toastr.error('', this.translate.instant("InValidPalletNo"));
            if (from == "to_pallet") {
              this.toPalletNo = "";
              this.toPalletInputs.nativeElement.focus();
            } else if (from == "from_pallet") {
              this.fromPalletNo = "";
              this.fromPalletInput.nativeElement.focus();
            }
            result = false;
          }
        }
        else {
          this.palletData = [];
          this.toastr.error('', this.translate.instant("InValidPalletNo"));
          if (from == "to_pallet") {
            this.toPalletNo = "";
            this.toPalletInputs.nativeElement.focus();
          } else if (from == "from_pallet") {
            this.fromPalletNo = "";
            this.fromPalletInput.nativeElement.focus();
          }
          result = false;
        }
      },
      error => {
        this.showLoader = false;
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
        result = false;
      }
    );
    return result;
  }

  getLookupValue(lookupValue: any) {
    this.showLoader = false;
    if (this.fromPalletLookup == "from_pallet") {
      this.showLoader = false;
      // if (!this.containPallet(this.selectedPallets, lookupValue.Code)) {
        this.fromPalletNo = lookupValue.Code;
        this.toWhse = lookupValue.U_OPTM_WAREHOUSE_LOC;
        this.toBin = lookupValue.U_OPTM_BIN;
      // }
      this.palletData = [];
      this.toPalletNo = '';
      this.toPalletInputs.nativeElement.focus()
    } else if (this.fromPalletLookup == "to_pallet") {
      this.toPalletNo = lookupValue.Code;
      // this.toPalletInputs.nativeElement.focus()
    }

    if (this.fromPalletNo != '' && this.toPalletNo != '') {
      this.showHideGridToggle = false;
      this.showHideBtnTxt = this.translate.instant("showGrid");
      this.getPalletData();
    }
  }

  containPallet(list: any, targetPallet: string) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].Code == targetPallet) {
        return true;
      }
    }
    return false;
  }
  manageEyeIcon: boolean =true;
  async clickShowHideGrid() {
    await this.validateBeforeSubmit();
    this.isValidateCalled = false;

    this.showHideGridToggle = !this.showHideGridToggle;
    if (this.showHideGridToggle) {
      this.showHideBtnTxt = this.translate.instant("hideGrid");
       this.manageEyeIcon = false;
    } else {
      this.showHideBtnTxt = this.translate.instant("showGrid");
      this.manageEyeIcon = true;
    }
  }

  getPalletData() {
    // this.showLoader = true;
    this.commonservice.GetPalletData(this.fromPalletNo).subscribe(
      (data: any) => {
        this.showLoader = false;
       // console.log(data);
        if (data != null) {
          this.finalPalletData = [];
          this.palletData = data;
          for (let i = 0; i < this.palletData.length; i++) {
            var index = this.palletData[i].SRLBATCH.lastIndexOf(this.fromPalletNo);
            var finalBS = this.palletData[i].SRLBATCH.substring(0, index) + this.toPalletNo;
            var object = {
              ITEMID: this.palletData[i].ITEMID,
              SRLBATCH: this.palletData[i].SRLBATCH,
              QTY: this.palletData[i].QTY,
              SELECT: this.palletData[i].SELECT,
              FINALSRLBATCH: finalBS
            };
            this.finalPalletData.push(object);
          }
          this.palletData = this.finalPalletData;
        }
        else {
          this.toastr.error('', this.translate.instant("InValidPalletNo"));
          return;
        }
      },
      error => {
        this.showLoader = false;
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
  }

  back(fromwhereval: number) {
    this.router.navigate(['home/dashboard', { skipLocationChange: true }]);
  }

  public openConfirmForDelete(rowindex, gridData: any) {
    this.dialogFor = "deleteRow";
    this.dialogMsg = this.translate.instant("Inbound_DoYouWantToDelete");
    this.yesButtonText = this.translate.instant("yes");
    this.noButtonText = this.translate.instant("no");
    this.rowindexForDelete = rowindex;
    this.gridDataAfterDelete = gridData;
    this.showConfirmDialog = true;
  }

  async transfer() {
    var result = await this.validateBeforeSubmit();
    this.isValidateCalled = false;
    console.log("validate result: " + result);
    if (result != undefined && result == false) {
      return;
    }
  
    if (this.fromPalletNo == '' || this.fromPalletNo == undefined) {
      this.toastr.error('', this.translate.instant("Plt_SelectFromPallet"));
      return;
    }
    if (this.toPalletNo == '' || this.toPalletNo == undefined) {
      this.toastr.error('', this.translate.instant("Plt_SelectToPallet"));
      return;
    }
    if (this.toPalletNo == this.fromPalletNo) {
      this.toastr.error('', this.translate.instant("Plt_PalletShouldNotSame"));
      this.toPalletNo = '';
      this.palletData = [];
      return;
    }

    this.showLoader = true;
    this.commonservice.palletTransfer(this.fromPalletNo, this.toPalletNo).subscribe(
      (data: any) => {
        this.showLoader = false;
       // console.log(data);
        if (data != null && data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "" && data[0].Successmsg == "SUCCESSFULLY") {
            this.toastr.success('', this.translate.instant("Plt_Transfer_success"));
            this.resetPageOnSuccess();
          } else if (data[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          } else {
            this.toastr.error('', data[0].ErrorMsg);
          }
        } else {
          this.toastr.error('', this.translate.instant("Plt_TransferErrMsg"));
        }
      },
      error => {
        this.showLoader = false;
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
  }

  resetPageOnSuccess() {
    this.palletData = [];
    this.fromPalletNo = "";
    this.toPalletNo = "";
    this.toWhse = "";
    this.toBin = "";
  }

  onCheckChange() {
    this.newCreatedPalletNo = "";
    this.showInputDialog("NewPallet_PalletTransfer", this.translate.instant("Done"), this.translate.instant("Cancel"),
    this.translate.instant("Plt_CreateNewPallet"));
  }

  public createNewPallet(palletNo: string, binNo: string) {
    this.showLoader = true;
    this.commonservice.createNewPallet(palletNo, binNo).subscribe(
      (data: any) => {
        this.showLoader = false;
       // console.log(data);
        if (data != null) {
          if (data.length > 0) {
            this.newCreatedPalletNo = data;
            this.toPalletNo = this.newCreatedPalletNo;
            return;
          } else {
            this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
          }
        }
      },
      error => {
        this.showLoader = false;
        console.log("Error: ", error);
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
  }

  clearPalletItems(item) {
    this.showHideGridToggle = false;
    this.showHideBtnTxt = this.translate.instant("showGrid");

    //console.log(this.toPalletNo);
    this.palletData = [];
    this.finalPalletData = [];
    // this.fromPalletNo = '';
    this.toPalletNo = '';
  }

  onHiddenToPltScanClick(){
    var inputValue = (<HTMLInputElement>document.getElementById('PalXferToPalletNoInput')).value;
    if (inputValue.length > 0) {
      this.toPalletNo = inputValue;
    }
    this.onPalletChange('to_pallet');
  }
  onHiddenFromPltScanClick(){
    
    var inputValue = (<HTMLInputElement>document.getElementById('palXfer_fromPalletNoInput')).value;
    if (inputValue.length > 0) {
      this.fromPalletNo = inputValue;
    }
    this.onPalletChange('from_pallet');
  }

  inputDialogFor: any;
  titleMessage: any;
  showInputDialogFlag: boolean = false;
  showInputDialog(dialogFor: string, yesbtn: string, nobtn: string, msg: string) {
    this.inputDialogFor = dialogFor;
    this.yesButtonText = yesbtn;
    this.noButtonText = nobtn;
    this.showInputDialogFlag = true;
    this.titleMessage = msg;
  }

  getInputDialogValue($event) {
   // console.log("getInputDialogValue " + event)
    this.showInputDialogFlag = false;
    if ($event.Status == "yes") {
      switch ($event.From) {
        case ("NewPallet_PalletTransfer"):
          this.createNewPallet($event.PalletNo, $event.BinNo);
          break
      }
    }
  }

  isValidateCalled: boolean = false;
  async validateBeforeSubmit():Promise<any>{
    this.isValidateCalled = true;
    var currentFocus = document.activeElement.id;
    console.log("validateBeforeSubmit current focus: "+currentFocus);
    
    if(currentFocus != undefined){
      if(currentFocus == "palXfer_fromPalletNoInput"){
        return this.onPalletChange("from_pallet");
      }
      else if(currentFocus == "PalXferToPalletNoInput"){
        return this.onPalletChange("to_pallet");
      }
    }
  }
}
