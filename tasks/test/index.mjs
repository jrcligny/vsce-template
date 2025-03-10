import { task, series, } from 'gulp';

import clean from './clean.mjs';
import runE2ETests from './run-e2e-tests.mjs';
import runSpecTests from './run-spec-tests.mjs';

export { clean, };

task('run-spec-tests', async function () {
    await runSpecTests();
});
task('run-spec-tests-with-json-reporter', async function () {
    await runSpecTests({ reporter: 'json', });
});

task('run-e2e-tests', async function () {
    await runE2ETests();
});
task('run-e2e-tests-with-json-reporter', async function () {
    await runE2ETests({ reporter: 'json', });
});

export const run = series(
    'run-spec-tests',
    'run-e2e-tests',
);

export const runCI = series(
    'run-spec-tests-with-json-reporter',
    'run-e2e-tests-with-json-reporter',
);
