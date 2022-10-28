import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AuditoriaComponent } from '../list/auditoria.component';
import { AuditoriaDetailComponent } from '../detail/auditoria-detail.component';
import { AuditoriaUpdateComponent } from '../update/auditoria-update.component';
import { AuditoriaRoutingResolveService } from './auditoria-routing-resolve.service';

const auditoriaRoute: Routes = [
  {
    path: '',
    component: AuditoriaComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AuditoriaDetailComponent,
    resolve: {
      auditoria: AuditoriaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AuditoriaUpdateComponent,
    resolve: {
      auditoria: AuditoriaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AuditoriaUpdateComponent,
    resolve: {
      auditoria: AuditoriaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(auditoriaRoute)],
  exports: [RouterModule],
})
export class AuditoriaRoutingModule {}
