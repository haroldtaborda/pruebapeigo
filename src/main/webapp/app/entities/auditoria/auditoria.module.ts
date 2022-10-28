import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AuditoriaComponent } from './list/auditoria.component';
import { AuditoriaDetailComponent } from './detail/auditoria-detail.component';
import { AuditoriaUpdateComponent } from './update/auditoria-update.component';
import { AuditoriaDeleteDialogComponent } from './delete/auditoria-delete-dialog.component';
import { AuditoriaRoutingModule } from './route/auditoria-routing.module';

@NgModule({
  imports: [SharedModule, AuditoriaRoutingModule],
  declarations: [AuditoriaComponent, AuditoriaDetailComponent, AuditoriaUpdateComponent, AuditoriaDeleteDialogComponent],
  entryComponents: [AuditoriaDeleteDialogComponent],
})
export class AuditoriaModule {}
