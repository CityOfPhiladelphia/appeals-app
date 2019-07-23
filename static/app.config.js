const app_config = {
  types: {
    // RB_ZBA: {
    //   id: 'RB_ZBA',
    //   text: 'ZBA',
    //   description: 'Zoning Board of Appeals',
    // },
    RB_BBS: {
      id: 'RB_BBS',
      text: 'BBS',
      description: 'Board of Building Standards',
    },
    // LIRB and BLIR are two names for the same thing. 
    RB_LIRB: {
      id: 'RB_LIRB',
      text: 'BLIR',
      description: 'Board of Licenses and Inspections Review',
    },
  },
};

// Set the app config globaly
window.appealsAppConfig = app_config;
