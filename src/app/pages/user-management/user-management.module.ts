import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbRouteTabsetModule,
  NbTabsetModule,
  NbTreeGridModule,
} from "@nebular/theme";
import {ThemeModule} from "../../@theme/theme.module";
import {TablesRoutingModule} from "../tables/tables-routing.module";
import {Ng2SmartTableModule} from "ng2-smart-table";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { AdminComponent } from './admin/admin.component';
import {FollowRoutingModule} from "./follow-routing.module";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzMessageModule} from "ng-zorro-antd/message";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {UserManagementComponent} from "./user-management.component";
import { EtudesComponent } from './etudes/etudes.component';
import { CreditsComponent } from './credits/credits.component';
import { EtudesSupportComponent } from './etudes-support/etudes-support.component';
import { CreditsSupportComponent } from './credits-support/credits-support.component';
import { SuiviEtudesComponent } from './suivi-etudes/suivi-etudes.component';
import { SuiviCreditsComponent } from './suivi-credits/suivi-credits.component';
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzCollapseModule} from "ng-zorro-antd/collapse";
import {NzListModule} from "ng-zorro-antd/list";
import { MonitorComponent } from './monitor/monitor.component';
import { UserDetailsComponent } from './user-details/user-details.component';



@NgModule({
  declarations: [
    UserManagementComponent,
    AdminComponent,
    EtudesComponent,
    CreditsComponent,
    EtudesSupportComponent,
    CreditsSupportComponent,
    SuiviEtudesComponent,
    SuiviCreditsComponent,
    MonitorComponent,
    UserDetailsComponent,
  ],
  imports: [
    FollowRoutingModule,
    CommonModule,
    FormsModule,
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    TablesRoutingModule,
    Ng2SmartTableModule,
    NbTabsetModule,
    NbRouteTabsetModule,
    NzGridModule,
    NzDividerModule,
    NzButtonModule,
    NzIconModule,
    NzMessageModule,
    NzTableModule,
    NzSpinModule,
    NzModalModule,
    NzInputModule,
    NzFormModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzToolTipModule,
    NzDatePickerModule,
    NzPopconfirmModule,
    NzDropDownModule,
    NzCollapseModule,
    NzListModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UserManagementModule { }
