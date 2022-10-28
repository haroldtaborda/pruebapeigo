import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OperacionComponent } from '../list/operacion.component';
import { OperacionDetailComponent } from '../detail/operacion-detail.component';
import { OperacionUpdateComponent } from '../update/operacion-update.component';
import { OperacionRoutingResolveService } from './operacion-routing-resolve.service';

const operacionRoute: Routes = [
  {
    path: '',
    component: OperacionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OperacionDetailComponent,
    resolve: {
      operacion: OperacionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OperacionUpdateComponent,
    resolve: {
      operacion: OperacionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OperacionUpdateComponent,
    resolve: {
      operacion: OperacionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(operacionRoute)],
  exports: [RouterModule],
})
export class OperacionRoutingModule {}
