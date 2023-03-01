module.exports = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        authors: 'My Name',
        description: 'My Description',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        authors: 'My Name',
        description: 'My Description',
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        authors: 'My Name',
        description: 'My Description',
      },
    },
  ],
};
