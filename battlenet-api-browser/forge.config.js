const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    ignore: (filepath) => {
      const checks = [
        "/.angular",
        "/.vscode",
        "/out",
        "/public",
        "/src",
        "/.editorconfig",
        "/tsconfig"
      ];
      const whitelist = [
        'node_modules/electron-squirrel-startup',
        'node_modules/debug',
        'node_modules/ms',
      ]
      var ignored = false;

      checks.forEach((check)=>{
        if (filepath.startsWith(check))
          ignored = true;
      });

      whitelist.forEach((check)=>{
        if (filepath.includes(check))
          ignored = false;
      });

      return ignored;
    }
  },
  rebuildConfig: {
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
  /*hooks: {
    postPackage: async (forgeConfig, options) => {
      options.outputPaths.forEach((outpath)=>{
        console.info('Replacing archive in :', path.join(outpath, resources));
        copyFileSync('out/app.asar',path.join(outpath, resources));
      });
    }
  }*/
};


