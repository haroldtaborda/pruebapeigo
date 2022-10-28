import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CuentaComponent } from './list/cuenta.component';
import { CuentaDetailComponent } from './detail/cuenta-detail.component';
import { CuentaUpdateComponent } from './update/cuenta-update.component';
import { CuentaDeleteDialogComponent } from './delete/cuenta-delete-dialog.component';
import { CuentaRoutingModule } from './route/cuenta-routing.module';
import { CargarCuentaDialogComponent } from './cargo-cuenta/cargo-cuenta-dialog.component';
import { MermarCuentaDialogComponent } from './mermo-cuenta/mermo-cuenta-dialog.component';

@NgModule({
  imports: [SharedModule, CuentaRoutingModule],
  declarations: [CuentaComponent, CuentaDetailComponent, CuentaUpdateComponent, CuentaDeleteDialogComponent, CargarCuentaDialogComponent, MermarCuentaDialogComponent],
  entryComponents: [CuentaDeleteDialogComponent, CargarCuentaDialogComponent, MermarCuentaDialogComponent],
})
export class CuentaModule {}
