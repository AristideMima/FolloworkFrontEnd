import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] =
  [
  {
    title: 'TABLEAU DE BORD',
    group: true,
  },
  {
    title: 'Tableau de bord',
    icon: 'home-outline',
    link: 'dashboard',
    home: true,
  },
  {
    title: 'ADMINISTRATION',
    group: true,
  },
  {
    title: 'Gestion utilisateurs',
    icon: 'people-outline',
    link: 'followWork/admin',
    // home: true,
  },
  {
    title: 'ETUDES',
    group: true,
  },
  {
    title: 'Suivi - Etudes',
    icon: 'arrowhead-right',
    link: 'followWork/followEtudes',
    // home: true,
  },
  {
    title: 'Etudes / Projets',
    icon: 'folder-outline',
    children: [
      {
        title: 'Mes études / Projets',
        icon: 'folder-outline',
        link: 'followWork/allEtudes',
      },
      {
        title: 'Etudes / Projets - supports',
        icon: 'folder-outline',
        link: 'followWork/supportEtudes',
      },
    ],
  },
  {
    title: 'DOSSIERS DE CREDITS',
    group: true,
  },
  {
    title: 'Suivi - Crédits',
    icon: 'arrowhead-right',
    link: 'followWork/followCredits',
    // home: true,
  },
  {
    title: 'Dossiers de Crédit',
    icon: 'folder-outline',
    children: [
      {
        title: 'Mes dossiers',
        icon: 'folder-outline',
        link: 'followWork/allCredit',
      },
      {
        title: 'Mes dossiers - Support',
        icon: 'folder-outline',
        link: 'followWork/supportCredit',
      },
    ],
  },
];
