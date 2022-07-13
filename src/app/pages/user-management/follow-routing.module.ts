import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {UserManagementComponent} from "./user-management.component";
import {AdminComponent} from "./admin/admin.component";
import {EtudesComponent} from "./etudes/etudes.component";
import {EtudesSupportComponent} from "./etudes-support/etudes-support.component";
import {CreditsComponent} from "./credits/credits.component";
import {CreditsSupportComponent} from "./credits-support/credits-support.component";
import {SuiviCreditsComponent} from "./suivi-credits/suivi-credits.component";
import {SuiviEtudesComponent} from "./suivi-etudes/suivi-etudes.component";
import {MonitorComponent} from "./monitor/monitor.component";
// import {AuthGuard} from "../../../../folloWorkFront/src/app/auth-guard.service";
import { AuthGuard } from "../../auth-guard.service";
import {ROLE_ADMIN, ROLE_ANALYST, ROLE_MANAGER} from "../../app.constants";
import {DetailsDossiersComponent} from "../e-commerce/details-dossiers/details-dossiers.component";



const routes: Routes = [{
  path: '',
  component: UserManagementComponent,
  children: [
    {
      path: 'admin',
      component: AdminComponent,
    },
    {
      path: 'allEtudes',
      component: EtudesComponent,
      canActivate: [AuthGuard],
      data: { roles: [ROLE_ANALYST]},
    },
    {
      path: 'allEtudesHistoric/:code/:name/:type',
      component: MonitorComponent,
    },
    {
      path: 'supportEtudes',
      component: EtudesSupportComponent,
      canActivate: [AuthGuard],
      data: { roles: [ROLE_ANALYST]},
    },
    {
      path: 'allCredit',
      component: CreditsComponent,
      canActivate: [AuthGuard],
      data: { roles: [ROLE_ANALYST]},
    },
    {
      path: 'supportCredit',
      component: CreditsSupportComponent,
    },
    {
      path: 'followCredits',
      component: SuiviCreditsComponent,
      canActivate: [AuthGuard],
      data: { roles: [ROLE_MANAGER]},
    },
    {
      path: 'followEtudes',
      component: SuiviEtudesComponent,
      canActivate: [AuthGuard],
      data: { roles: [ROLE_MANAGER]},
    },
    {
      path: 'userDetails/:username/:firstName/:lastName',
      component: DetailsDossiersComponent,
      canActivate: [AuthGuard],
      data: { roles: [ROLE_MANAGER, ROLE_ANALYST, ROLE_ADMIN]},
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [AuthGuard],
  exports: [RouterModule],
})

export class FollowRoutingModule {
}
