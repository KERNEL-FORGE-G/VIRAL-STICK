/**
 * Données de l'équipe Viral Stick
 * Source unique de vérité pour les informations des membres
 */

export const TEAM_MEMBERS = [
  {
    id: 'ravel',
    name: 'NGHOMSI FEUKOUO RAVEL',
    role: 'Leader du projet',
    github: 'Archlord12345',
    companion: 'arch',
    position: 'leader'
  },
  {
    id: 'elisee',
    name: 'NGABISSI NGOUNOU Elisée',
    role: 'Backend dev 2',
    github: 'Elisee-25',
    companion: 'data',
    position: 'backend'
  },
  {
    id: 'jemina',
    name: 'JAM AFANE JEMINA',
    role: 'Dev Audio/image',
    github: 'Graziella865',
    companion: 'art',
    position: 'media'
  },
  {
    id: 'ange',
    name: 'Demanou kenfack Ange Trecy',
    role: 'Dev 1 mobile',
    github: 'AngeTrecy',
    companion: 'secu',
    position: 'mobile'
  },
  {
    id: 'aridtide',
    name: 'NGUEMA ARIDTIDE',
    role: 'Testeur et rapport',
    github: 'ngurmaaristide',
    companion: 'ubu',
    position: 'qa'
  },
  {
    id: 'ivan',
    name: 'Nguiffo pierre Ivan',
    role: 'Testeur et rapport',
    github: 'nguiffoloic',
    companion: 'bio',
    position: 'qa'
  },
  {
    id: 'salwe',
    name: 'SALWE MARSALA',
    role: 'Backend dev 1',
    github: 'salwe-marsala',
    companion: 'para',
    position: 'backend'
  },
  {
    id: 'hassane',
    name: 'HASSANE YOUSSOUF OUMAR',
    role: 'Backend Dev 2',
    github: 'Hawadja',
    companion: 'data',
    position: 'backend'
  }
];

export const TEAM_BY_POSITION = {
  leader: TEAM_MEMBERS.filter(m => m.position === 'leader'),
  backend: TEAM_MEMBERS.filter(m => m.position === 'backend'),
  mobile: TEAM_MEMBERS.filter(m => m.position === 'mobile'),
  media: TEAM_MEMBERS.filter(m => m.position === 'media'),
  qa: TEAM_MEMBERS.filter(m => m.position === 'qa')
};

export default TEAM_MEMBERS;
