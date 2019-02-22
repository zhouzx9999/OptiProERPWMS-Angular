import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhsTransferComponent } from './whs-transfer/whs-transfer.component';
import { BinTransferComponent } from './bin-transfer/bin-transfer.component';
import { TrnaslateLazyModule } from 'src/translate-lazy.module';
import { LookupComponent } from 'src/app/common/lookup/lookup.component';

@NgModule({
  declarations: [WhsTransferComponent, BinTransferComponent, LookupComponent],
  imports: [
    CommonModule,
    TrnaslateLazyModule
    
  ]
})
export class InventoryTransferModule { }
