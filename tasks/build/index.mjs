import { task, series, } from 'gulp';

import clean from './clean.mjs';
import getStaticFiles from './get-static-files.mjs';
import createPackageJSON from './create-package-json.mjs';
import bundleApp from './bundle-app.mjs';
import createVSIX from './create-vsix.mjs';

task('get-static-files', getStaticFiles);
task('create-package-json', createPackageJSON);

task('bundle-dev-app', async function bundle() {
    await bundleApp(false);
});
task('bundle-prod-app', async function bundle() {
    await bundleApp(true);
});

task('create-vsix', createVSIX);

export const compile = series(
    clean,
    'get-static-files',
    'create-package-json',
    'bundle-dev-app',
);

export const pack = series(
    clean,
    'get-static-files',
    'create-package-json',
    'bundle-prod-app',
    'create-vsix',
);
