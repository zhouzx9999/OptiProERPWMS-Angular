import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrintingLabelRoutingModule } from './printing-label-routing.module';
import { ItemLabelComponent } from './item-label/item-label.component';
import { BinLabelComponent } from './bin-label/bin-label.component';
import { InventoryEnquiryComponent } from './inventory-enquiry/inventory-enquiry.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TrnaslateLazyModule } from '../../translate-lazy.module';
import { SharedModule } from '../shared-module/shared-module.module';
import { FormsModule } from '@angular/forms';
//import { DisplayPdfComponent } from './display-pdf/display-pdf.component';
//import { PdfpipePipe } from './pdfpipe.pipe';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { GridModule } from '@progress/kendo-angular-grid';

@NgModule({
<<<<<<< HEAD
  declarations: [ItemLabelComponent, BinLabelComponent, InventoryEnquiryComponent],
=======

>>>>>>> f7173cc147b1f0c74ff30669408bed0a4a1acec5
  imports: [
    CommonModule,
    SharedModule,
    PerfectScrollbarModule,
    TrnaslateLazyModule,
    FormsModule,
    PrintingLabelRoutingModule,
    DialogsModule,
    GridModule
  ],
  declarations: [ItemLabelComponent, BinLabelComponent, InventoryEnquiryComponent, 
    DisplayPdfComponent, PdfpipePipe],
  entryComponents: [DisplayPdfComponent],
  exports:   [DisplayPdfComponent, PdfpipePipe]
})
export class PrintingLabelModule { }
