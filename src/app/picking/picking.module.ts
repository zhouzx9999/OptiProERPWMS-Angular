import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridModule } from '@progress/kendo-angular-grid';
import { SharedModule } from '../shared-module/shared-module.module';
import { FormsModule } from '@angular/forms';
import { TrnaslateLazyModule } from '../../translate-lazy.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { PickingComponent } from './picking.component';
import { PickingRoutingModule } from './picking-routing.module';
import { PickingListComponent } from './picking-list/picking-list.component';
import { PickingItemListComponent } from './picking-item-list/picking-item-list.component';
import { PickingItemDetailsComponent } from './picking-item-details/picking-item-details.component';
import { DialogsModule } from '../../../node_modules/@progress/kendo-angular-dialog';

@NgModule({
  declarations: [ 
    PickingComponent,
    PickingListComponent,
    PickingItemListComponent,
    PickingItemDetailsComponent],
  imports: [
    CommonModule,
    GridModule,
    DialogsModule,
    SharedModule,    
    TrnaslateLazyModule,
    PerfectScrollbarModule, 
    FormsModule,
    PickingRoutingModule,
    DropDownsModule,
    DateInputsModule
  ],
  providers: [],
  exports: []
})
export class PickingModule { }
