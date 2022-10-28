import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OperacionComponent } from './list/operacion.component';
import { OperacionDetailComponent } from './detail/operacion-detail.component';
import { OperacionUpdateComponent } from './update/operacion-update.component';
import { OperacionDeleteDialogComponent } from './delete/operacion-delete-dialog.component';
import { OperacionRoutingModule } from './route/operacion-routing.module';

@NgModule({
  imports: [SharedModule, OperacionRoutingModule],
  declarations: [OperacionComponent, OperacionDetailComponent, OperacionUpdateComponent, OperacionDeleteDialogComponent],
  entryComponents: [OperacionDeleteDialogComponent],
})
export class OperacionModule {}
