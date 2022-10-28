import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CuentaComponent } from '../list/cuenta.component';
import { CuentaDetailComponent } from '../detail/cuenta-detail.component';
import { CuentaUpdateComponent } from '../update/cuenta-update.component';
import { CuentaRoutingResolveService } from './cuenta-routing-resolve.service';

const cuentaRoute: Routes = [
  {
    path: '',
    component: CuentaComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CuentaDetailComponent,
    resolve: {
      cuenta: CuentaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CuentaUpdateComponent,
    resolve: {
      cuenta: CuentaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CuentaUpdateComponent,
    resolve: {
      cuenta: CuentaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(cuentaRoute)],
  exports: [RouterModule],
})
export class CuentaRoutingModule {}
