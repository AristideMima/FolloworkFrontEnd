import {Injectable, OnInit} from '@angular/core';
import {NbAuthJWTToken, NbAuthService} from '@nebular/auth';
import {Observable, of} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  URL_ETUDE_SAVE,
  URL_ETUDES_ANALYST_GET,
  URL_ETUDE_DELETE,
  URL_ETUDES_GET,
  URL_ETUDES_MANAGER_GET,
  URL_GET_USER,
  URL_GET_USER_ROLE,
  URL_ETUDE_UPDATE,
  URL_ANALYSIS_ETUDE_UPDATE,
  URL_ETUDE_MONITOR_GET,
  URL_ANALYSIS_ETUDE_UPDATE_MANAGER,
  ROLE_MANAGER,
  ROLE_ANALYST,
  UNITS,
  ETUDES_TYPE,
  PROVENANCE,
  URL_CREDIT_SAVE,
  URL_CREDIT_UPDATE,
  URL_ANALYSIS_CREDIT_UPDATE,
  URL_ANALYSIS_CREDIT_UPDATE_MANAGER,
  URL_CREDITS_GET,
  URL_CREDIT_MONITOR_GET,
  URL_CREDIT_DELETE,
  URL_CREDITS_ANALYST_GET,
  URL_CREDITS_MANAGER_GET,
  pattern_amount,
  DOSSIER_STATUS,
  URL_ALL_NAMES_GET, URL_CREDIT_STAT_ALL_GET, URL_ETUDE_STAT_ALL_GET, URL_CREDIT_STAT_USER_GET,
} from "../app.constants";
import {catchError, tap} from "rxjs/operators";
import {analyzeNgModules} from "@angular/compiler";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Injectable({
  providedIn: 'root',
})
export class UserService {
  token = null;
  roles = [];
  authorizationHeader = null;
  username = null;
  allNames = [];
  // Manager actions
  valid_init = ['INIT_DEMAND', 'INIT_REJECT'];
  valid_suspension = ['INIT_SUSPENSION', 'REJECT_SUSPENSION', 'VALID_SUSPENSION'];
  invalid_init = ['INIT_VALID', 'IN_PROGRESS'];
  valid_close = ['CLOSE_DEMAND', 'CLOSE_REJECT'];
  invalid_close = ['CLOSE_SUCCESS', 'CLOSE_FAILED'];
  listOfOptionAnalyst: Array<{ label: string; value: string }> = [];
  listOfOptionManager: Array<{ label: string; value: string }> = [];
  listOfOptionType: Array<{ label: string; value: string }> = [];
  listOfOptionProvenance: Array<{ label: string; value: string }> = [];
  listOfOptionOrigin: Array<{ label: string; value: string }> = [];
  dossier_enum = DOSSIER_STATUS;
  allValuesValid = ['valid_init', 'cancel_init', 'close_success', 'close_failed', 'cancel_close', 'cancel_suspend', 'valid_suspend'];
  dict_values = {
    'valid_init': 'VALIDATION INITIATION',
    'cancel_init': 'REJET INITIATION',
    'close_success': 'CLOTURER AVEC SUCCESS',
    'close_failed': 'CLOTURER AVEC ECHEC',
    'cancel_close': 'REJET DE CLOTURE',
    'cancel_suspend': 'REJET DE SUSPENSION',
    'valid_suspend': 'VALIDATION DE SUSPENSION',
  };

  hiddenMenu (permissions: any): boolean {
    const intersection = this.roles.filter( e => permissions.includes(e)).length;
    return intersection === 0;
  }

  constructor(private authService: NbAuthService, private http: HttpClient, private msg: NzMessageService) {

    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
           this.username = token.getPayload()['sub'];
           this.roles = token.getPayload()['roles'];
          const tokenBearer = 'Bearer ' + token.getValue();
           this.authorizationHeader = {
            headers: new HttpHeaders()
              .set('Authorization',  `${tokenBearer}`),
          };

           // Load roles
          this.loadUserByRole(ROLE_MANAGER).subscribe( data_manager => {
            this.listOfOptionManager = this.populateList(this.listOfOptionManager, data_manager);

          });
          this.loadUserByRole(ROLE_ANALYST).subscribe( data_analyst => {
            this.listOfOptionAnalyst = this.populateList(this.listOfOptionAnalyst, data_analyst);
          });

          // Load all names
          this.getAllNames().subscribe( datas => {
            this.allNames = datas;
          });
          this.listOfOptionOrigin = this.populateListArray(this.listOfOptionOrigin, UNITS, true);
          this.listOfOptionType = this.populateListArray(this.listOfOptionType, ETUDES_TYPE);
          this.listOfOptionProvenance = this.populateListArray(this.listOfOptionProvenance, PROVENANCE);

        } else {
          console.log('token: no token');
        }
      });
  }


  setColumnData( data: any, credit= true): any {

    const listOfColumns = [
      {
        name: "CODE",
        width: "200px",
        right: false,
      },
      {
        name: "NOM",
        sortFn: (a: any, b: any) => a[0].name.localeCompare(b[0].name),
        sortDirections: ['ascend', 'descend', null],
        width: "150px",
        right: false,
      },
      {
        name: "ANALYSTE",
        sortOrder:  null,
        sortFn: (a: any, b: any) => a[0].userAnalyst.username.localeCompare(b[0].userAnalyst.username),
        listOfFilter: [...new Set(data.map( elt => {
          const value = elt[0].userAnalyst.username;
          return value;
        }))].map( val => {
          return {text: val, value: val};
        }),
        filterFn: (list: any, item: any) => {
          return list === item[0].userAnalyst.username;
        },
        filterMultiple: false,
        sortDirections: ['ascend', 'descend', null],
        width: "150px",
        right: false,
      },
      {
        name: credit ? "SECTEUR" : "DOMAINE",
        sortOrder:  null,
        sortFn: (a: any, b: any) => a[0].domain.localeCompare(b[0].domain),
        listOfFilter: [...new Set(data.map( elt => {
          const value = elt[0].domain;
          return value;
        }))].map( val => {
          return {text: val, value: val};
        }),
        filterFn: (list: any, item: any) => {
          return list === item[0].domain;
        },
        filterMultiple: false,
        sortDirections: ['ascend', 'descend', null],
        width: "150px",
        right: false,
      },
      !credit ? {
          name: "TYPE",
          sortOrder:  null,
          sortFn: (a: any, b: any) => a[0].type.localeCompare(b[0].type),
          listOfFilter: [...new Set(data.map( elt => {
            const value = elt[0].type;
            return value;
          }))].map( val => {
            return {text: val, value: val};
          }),
          filterFn: (list: any, item: any) => {
            return list === item[0].type;
          },
          filterMultiple: false,
          sortDirections: ['ascend', 'descend', null],
          width: "150px",
          right: false,
        } : {},
      {
        name: "DEMANDEUR",
        sortOrder:  null,
        sortFn: (a: any, b: any) => a[0].origin.localeCompare(b[0].origin),
        listOfFilter: [...new Set(data.map( elt => {
          const value = elt[0].origin;
          return value;
        }))].map( val => {
          return {text: this.formatDirection(val), value: val};
        }),
        filterFn: (list: any, item: any) => {
          return list === item[0].origin;
        },
        filterMultiple: false,
        sortDirections: ['ascend', 'descend', null],
        width: "150px",
        right: false,
      },
      {
        name: "SUPERIEUR",
        sortOrder:  null,
        sortFn: (a: any, b: any) => a[0].userManager.username.localeCompare(b[0].userManager.username),
        listOfFilter: [...new Set(data.map( elt => {
          const value = elt[0].userManager.username;
          return value;
        }))].map( val => {
          return {text: val, value: val};
        }),
        filterFn: (list: any, item: any) => {
          return list === item[0].userManager.username;
        },
        filterMultiple: false,
        sortDirections: ['ascend', 'descend', null],
        width: "150px",
        right: false,
      },
      {
        name: "SUPPORT",
        width: "150px",
        right: false,
      },
      {
        name: "STATUT",
        sortOrder:  null,
        sortFn: (a: any, b: any) => a[1].status.localeCompare(b[0].status),
        listOfFilter: [...new Set(data.map( elt => {
          const value = elt[1].status;
          return value;
        }))].map( val => {
          // @ts-ignore
          return {text: this.dossier_enum[val], value: val};
        }),
        filterFn: (list: any, item: any) => {
          return list === item[1].status;
        },
        filterMultiple: false,
        sortDirections: [],
        width: "150px",
        right: true,
      },
      {
        name: "ACTION",
        width: "150px",
        right: true,
      },
    ];
    return listOfColumns.filter( elt => Object.keys(elt).length !== 0);
  }
  getAllNames(): Observable<any> {
    return this.http.get<any>(URL_ALL_NAMES_GET ,  this.authorizationHeader)
      .pipe(tap(),
        catchError(
          this.handleError<any>( 'Depot', "Erreur chargement des dossiers", String),
        ));
  }

  computeNumberMonths (startM: any, end: any): any {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays: any = Math.round((startM.getTime() - end.getTime()) / oneDay);
    return diffDays;
  }
  getReadableDate (date: any): any {
    if (date == null) return null;
    return date.toISOString().replace('-', '/').split('T')[0].replace('-', '/');
  }

  populateList(listOfOption: Array<any>, data: any): Array<any> {
    data.forEach(value => {
      listOfOption.push({
        label: value.firstName + " " + value.lastName,
        value: value.username,
      });
    });
    return listOfOption;
  }

  populateListArray(listOfOption: Array<any>, data: any, unit= false): Array<any> {
    data.forEach(value => {
      listOfOption.push({
        label: !unit ? value : (value.split("(")[1]).replace(")", ""),
        value: value,
      });
    });

    return listOfOption;
  }

  saveDossier(datas: any, credit = false ): Observable<any> {
    const url = credit ? URL_CREDIT_SAVE : URL_ETUDE_SAVE;

    return this.http.post<any>(url + this.username , datas,  this.authorizationHeader)
      .pipe(tap(
        val => this.msg.success("Nouveau dossier ajouté"),
        ),
        catchError(
          this.handleError<any>( 'Depot', "Erreur sauvegarde du dossier", String),
        ));
  }

  updateDossier(datas: any, credit = false): Observable<any> {

    const url = credit ? URL_CREDIT_UPDATE : URL_ETUDE_UPDATE;

    return this.http.post<any>(url + this.username , datas,  this.authorizationHeader)
      .pipe(tap(
        val => this.msg.success("Dossier mis à jour avec succès"),
        ),
        catchError(
          this.handleError<any>( 'Depot', "Erreur mise à jour du dossier", String),
        ));
  }
  updateAnalysis(datas: any, action: string, credit = false): Observable<any> {
    const url = credit ? URL_ANALYSIS_CREDIT_UPDATE : URL_ANALYSIS_ETUDE_UPDATE;
    return this.http.post<any>(url + this.username + "/" + action , datas,  this.authorizationHeader)
      .pipe(tap(
        val => this.msg.success("Analyse mise à jour avec succès"),
        ),
        catchError(
          this.handleError<any>( 'Depot', "Erreur mise à jour de l'analyse", String),
        ));
  }
  updateManager(datas: any, action: string, credit = false): Observable<any> {
    const url = credit ? URL_ANALYSIS_CREDIT_UPDATE_MANAGER : URL_ANALYSIS_ETUDE_UPDATE_MANAGER;
    return this.http.post<any>(url +
      this.username + "/" + action , datas,  this.authorizationHeader)
      .pipe(tap(
        val => this.msg.success("Statut mis à jour"),
        ),
        catchError(
          this.handleError<any>( 'Depot', "Erreur mise à jour du statut", String),
        ));
  }

  getStatusAction(value: string, action: string): boolean {
    if (action === 'valid_init') {
      if (this.valid_init.includes(value)) return true;
    } else if (action === 'cancel_init') {
      if (this.invalid_init.includes(value)) return true;
    } else if (action === 'close_success' || action === 'close_failed') {
      if (this.valid_close.includes(value)) return true;
    } else if (action === 'cancel_close') {
      if (this.invalid_close.includes(value)) return true;
    }  else if (action === 'suspend') {
      if (value === "INIT_SUSPENSION") return true;
    }
    return false;
  }

  getAllDossiers(credit = false): Observable<any> {
    const url = credit ? URL_CREDITS_GET : URL_ETUDES_GET;
    return this.http.get<any>(url ,  this.authorizationHeader)
      .pipe(tap(
        val => this.msg.success("Dossiers chargés"),
        ),
        catchError(
          this.handleError<any>( 'Depot', "Erreur chargement des dossiers", String),
        ));
  }
  getMonitor(genericCode: string, credit = false): Observable<any> {
    const url = credit ? URL_CREDIT_MONITOR_GET : URL_ETUDE_MONITOR_GET;
    return this.http.get<any>(url + genericCode, this.authorizationHeader)
      .pipe(tap(
        val => this.msg.success("Historique suivi chargé"),
        ),
        catchError(
          this.handleError<any>( 'Depot', "Erreur chargement de l'historique", String),
        ));
  }

  formatDate(date: any): string {
    if (date === null) return "/";
    const splitDate = date.split('T');
    const dateString = splitDate[0];
    return dateString;
  }

  formatDirection(unit: any): string {
    const values = unit.split("(");
    if (values.length < 2) return unit;
    const formatedUnit = values[1].replace(")", "");

    return formatedUnit;
  }

  deleteDossier(genericCode: string, credit = false): Observable<any> {
    const url = credit ? URL_CREDIT_DELETE : URL_ETUDE_DELETE;
    return this.http.delete<any>(url + genericCode + "/" + this.username ,  this.authorizationHeader)
      .pipe(tap(
        val => this.msg.success("Dossier supprimé"),
        ),
        catchError(
          this.handleError<any>( 'Depot', "Erreur supression du dossier", String),
        ));
  }

  getUserDossier(analyst = true, credit = false, newName = "nox"): Observable<any> {
    let url = credit ? analyst ? URL_CREDITS_ANALYST_GET : URL_CREDITS_MANAGER_GET :
      analyst ? URL_ETUDES_ANALYST_GET : URL_ETUDES_MANAGER_GET ;
    url += newName === "nox" ? this.username : newName;
    return this.http.get<any>(url ,  this.authorizationHeader)
      .pipe(tap(
        ),
        catchError(
          this.handleError<any>( 'Depot', "Erreur chargement des dossiers", String),
        ));
  }

  loadUserByRole(role_name: String): Observable<any> {
    return this.http.get<any>(URL_GET_USER_ROLE + role_name, this.authorizationHeader)
      .pipe(tap(
        ),
        catchError(
          this.handleError<any>( 'Depot', "Erreur chargement utilisateurs", String),
        ));
  }

  private handleError<T>(operation = 'operation', message: String, result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      this.msg.error("" + message);

      return of(result as T);
    };
  }

  getAllStat(credit = false): Observable<any> {
    const url = credit ? URL_CREDIT_STAT_ALL_GET : URL_ETUDE_STAT_ALL_GET;

    return this.http.get(url, this.authorizationHeader)
      .pipe(tap(
        // val => this.msg.success("Statistiques chargées"),
        ),
        catchError(
          this.handleError<any>( 'Depot', "Erreur chargement des statistiques", String),
        ));
  }

  getAllStatUser(credit = false, passUsername: string): Observable<any> {
    const url = credit ? URL_CREDIT_STAT_USER_GET : URL_CREDIT_STAT_USER_GET;

    return this.http.get(url + passUsername, this.authorizationHeader)
      .pipe(tap(
        // val => this.msg.success("Statistiques chargées"),
        ),
        catchError(
          this.handleError<any>( 'Depot', "Erreur chargement des statistiques", String),
        ));
  }
}
