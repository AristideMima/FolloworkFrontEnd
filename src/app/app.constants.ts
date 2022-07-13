// URL DEFINITION

export const URL_SERVER = 'http://127.0.0.1:9090/api';


// ==================== ROUTES DEFINITION =================

// 1- USER ROUTES
export const URL_GET_USER = URL_SERVER + '/users';
export const URL_ADD_USER = URL_SERVER + '/user/save';
export const URL_EDIT_USER = URL_SERVER + '/user/edit';
export const URL_DELETE_USER = URL_SERVER + '/user/delete';
export const URL_GET_USER_ROLE = URL_SERVER + '/usersByRole/';


// 2- ETUDES ROUTES
export const URL_ETUDE_SAVE = URL_SERVER + '/etude/save/';
export const URL_ETUDE_UPDATE = URL_SERVER + '/etude/update/';
export const URL_ANALYSIS_ETUDE_UPDATE = URL_SERVER + '/etude/analysis/update/';
export const URL_ETUDES_GET = URL_SERVER + '/etude/etudes';
export const URL_ETUDE_DELETE = URL_SERVER + '/etude/delete/';
export const URL_ETUDES_ANALYST_GET = URL_SERVER + '/etude/etudes/analyst/';
export const URL_ETUDES_MANAGER_GET = URL_SERVER + '/etude/etudes/manager/';
export const URL_ANALYSIS_ETUDE_UPDATE_MANAGER = URL_SERVER + '/etude/manager/update/';
export const URL_ETUDE_MONITOR_GET = URL_SERVER + '/etude/monitor/';
export const URL_ETUDE_STAT_ALL_GET = URL_SERVER + '/etude/stats/all';
export const URL_ETUDE_STAT_USER_GET = URL_SERVER + '/etude/stats/';

// 3- CREDIT ROUTES
export const URL_CREDIT_SAVE = URL_SERVER + '/credit/save/';
export const URL_CREDIT_UPDATE = URL_SERVER + '/credit/update/';
export const URL_ANALYSIS_CREDIT_UPDATE = URL_SERVER + '/credit/analysis/update/';
export const URL_CREDITS_GET = URL_SERVER + '/credit/credits';
export const URL_CREDIT_DELETE = URL_SERVER + '/credit/delete/';
export const URL_CREDITS_ANALYST_GET = URL_SERVER + '/credit/credits/analyst/';
export const URL_CREDITS_MANAGER_GET = URL_SERVER + '/credit/credits/manager/';
export const URL_ANALYSIS_CREDIT_UPDATE_MANAGER = URL_SERVER + '/credit/manager/update/';
export const URL_CREDIT_MONITOR_GET = URL_SERVER + '/credit/monitor/';
export const URL_CREDIT_STAT_ALL_GET = URL_SERVER + '/credit/stats/all';
export const URL_CREDIT_STAT_USER_GET = URL_SERVER + '/credit/stats/';


// 4- GLOBAL ROUTES
export const URL_ALL_NAMES_GET = URL_SERVER + '/etude/names';



// ======= ROLES DEFINITION ==============
export const ROLE_ADMIN = "ROLE_ADMIN";
export const ROLE_MANAGER = "ROLE_MANAGER";
export const ROLE_ANALYST = "ROLE_ANALYST";


//  ============= VARIABLES USED ============
export const UNITS = [
  "Direction Centrale de L'Exploitation (DCE)",
 " Direction Crédit et Marketing (DCM)",
  "Direction de l'Exploitation (DEX)",
  "Direction de la Fenêtre Islamique (DFI)",
  "Direction de la Recherche et des Investissements (DRI)",
  "Direction de Succursale d'Hippodrome (DSH)",
  "Direction de Succursale de Bafoussam (DSB)",
 " Direction de Succursale de Bonanjo (DSB)",
  "Direction de Succursale de Garoua (DSG)",
  "Direction des Affaires Juridiques (DAJ)",
  "Direction des Audits et Inspections (DAI)",
  "Direction des Moyens Généraux (DMG)",
  "Direction des Opérations Bancaires (DOB)",
  "Direction des Ressources Humaines (DRH)",
  "Direction des Risques (DR)",
  "Direction des Systèmes d'Informations (DSI)",
  "Direction du Contrôle Financier (DCF)",
  "Direction du Contrôle Permanent des Opérations (DCPO)",
  "Direction du Développement Commercial (DDC)",
  "Direction du Leasing et Financements Spécialisés (DLFS)",
  "Direction du Retail Banking (DRB)",
  "Direction Générale (DG)",
  "Direction Groupe Ressources (DGR)",
  "Direction Régionale de l'Ouest (DRO)",
  "Direction Régionale du Centre (DRC)",
  "Direction Régionale du Littoral (DRL)",
  "Direction Régionale du Nord (DRN)",
 "Direction Régionale du Sud-Ouest (DRSO)",
  "Direction Risques et Crédits (DRC)",
  "Services du Président (SP)",
  "Sous Direction Crédit et Engagements (SDCE)",
  "Sous Direction Crédit et Marketing (SDCM)",
];
export const PROVENANCE = ['INTERNE', 'EXTERNE'];
export const ETUDES_TYPE = ['ANALYSE', 'ETUDE SECTORIELLE', 'PROJET'];
export enum DOSSIER_STATUS {
  INIT_DEMAND = 'DEMANDE INITIATION',
  INIT_REJECT = 'REJET INITIATION',
  INIT_VALID = 'VALIDATION INITIATION',
  IN_PROGRESS = 'EN COURS D\'ANALYSE',
  INIT_SUSPENSION = 'DEMANDE SUSPENSION',
  VALID_SUSPENSION = 'VALIDATION SUSPENSION',
  REJECT_SUSPENSION = 'REJET SUSPENSION',
  UPDATE_ANALYSIS = 'MISE A JOUR ANALYSE',
  CLOSE_DEMAND = 'DEMANDE CLOTURE',
  CLOSE_REJECT = 'REJET CLOTURE',
  CLOSE_SUCCESS = 'CLOTURE AVEC SUCCESS',
  CLOSE_FAILED = 'CLOTURE AVEC SUCCESS',
}


// =================== REGEX PATTERNS ====================
export const pattern_username = '^[a-zA-Z]+_[a-zA-Z]+$';
export const pattern_amount = '^[0-9]+$';
export const origin = ['INTERNE', 'EXTERNE'];
