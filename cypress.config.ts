import { defineConfig } from 'cypress';
import fs from 'fs';
import path from 'path';
import { addMatchImageSnapshotPlugin } from 'cypress-image-snapshot/plugin';
import coverage from '@cypress/code-coverage/task';
import eyesPlugin from '@applitools/eyes-cypress';
export default eyesPlugin(
  defineConfig({
    projectId: 'n2sma2',
    viewportWidth: 1440,
    viewportHeight: 1024,
    e2e: {
      specPattern: 'cypress/integration/**/*.{js,ts}',
      setupNodeEvents(on, config) {
        coverage(on, config);
        on('before:browser:launch', (browser, launchOptions) => {
          if (browser.name === 'chrome' && browser.isHeadless) {
            launchOptions.args.push('--window-size=1440,1024', '--force-device-scale-factor=1');
          }
          return launchOptions;
        });
        on('task', {
          recordRenderTime({ fileName, testName, timeTaken }) {
            const resultsPath = path.join('cypress', 'runtimes');
            if (!fs.existsSync(resultsPath)) {
              fs.mkdirSync(resultsPath, { recursive: true });
            }
            fs.appendFileSync(
              path.join(resultsPath, `${fileName}.csv`),
              `${testName},${timeTaken}\n`
            );
            return true;
          },
        });
        addMatchImageSnapshotPlugin(on, config);
        // copy any needed variables from process.env to config.env
        config.env.useAppli = process.env.USE_APPLI ? true : false;

        // do not forget to return the changed config object!
        return config;
      },
    },
    video: false,
  })
);
