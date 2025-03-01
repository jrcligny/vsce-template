import * as path from 'path';
import * as fs from 'fs/promises';
import { runTests, TestRunFailedError, } from '@vscode/test-electron';
import { glob, } from 'glob';

async function _runE2ETests(options = null) {
    /**
     * List of test configuration files.
     * Must be named `test.config.json`.
     */
    const configFiles = glob.sync('*/test.config.json', { cwd: '../../test', absolute: true });
    if (configFiles.length === 0) {
        throw new Error('No test.config.json found.');
    }

    /**
     * Absolute path to the extension root.
     * Must include a `package.json` Extension Manifest.
     */
    const extensionDevelopmentPath = path.resolve('../../out-package');

    /**
     * Absolute path to the extension tests runner.
     * Can be either a file path or a directory path that contains an `index.js`.
     * Must export a `run` function of the following signature:
     */
    const extensionTestsPath = path.resolve(`./runSuite.js`);

    /**
     * Path where the downloaded VS Code instance is stored.
     * Defaults to `.vscode-test` within your working directory folder.
     */
    const cachePath = path.resolve(`../../.vscode-test`);

    /* Retrieve vscode version from package.json  */
    console.log('📖 Reading package.json to get vscode version');
    const packageJson = JSON.parse(await fs.readFile('../../package.json', 'utf-8'));
    const { devDependencies, } = packageJson;

    if (!devDependencies['@types/vscode']) {
        throw new Error('No vscode version found in package.json (looking for `devDependencies.@types/vscode`)');
    }
    /**
     * The VS Code version to download.
     * Defaults to `stable`, which is latest stable version.
     *
     * *If a local copy exists at `<cachePath>/vscode-<VERSION>`, skip download.*
     */
    const downloadVersion = devDependencies['@types/vscode'].replace('^', '');

    /**
     * Path where the user-data directory is stored.
     * Defaults to `.vscode-test/user-data` within your working directory folder.
     */
    const userDataPath = path.resolve(`../../.vscode-test/user-data`);

    /**
     * Path where the extensions are stored.
     * Defaults to `.vscode-test/extensions` within your working directory folder.
     */
    const extensionDirPath = path.resolve(`../../.vscode-test/extensions`);

    for await (const configFile of configFiles) {

        console.log(`⚙️ Running test suite: '${configFile}'`);

        /**
         * Load content of JSON config file.
         */
        const config = await fs.readFile(configFile).then(data => JSON.parse(data.toString()));

        /**
         * Set env variables for the test suite.
         */
        const extensionTestsEnv = {
            "CONFIG_FILE": configFile,
        };
        if (options && options.reporter) {
            extensionTestsEnv.REPORTER = options.reporter;
        }

        /**
         * List of launch arguments passed to VS Code executable.
         * See `code --help` for possible arguments.
         */
        const launchArgs = [];
        if (config.vscode.workspace) {
            console.log(`📂 Workspace: '${config.vscode.workspace}'`);
            /**
             * Absolute path to the workspace file.
             * Must be the first argument if provided.
             */
            launchArgs.push(path.resolve(extensionDevelopmentPath, config.vscode.workspace));
        }
        if (config.vscode.disableExtensions) {
            console.log(`🚫 Disabling all extensions except the one being tested.`);
            /**
             * Disable all extensions except the one being tested.
             */
            launchArgs.push('--disable-extensions');
        }
        launchArgs.push(`--user-data-dir=${userDataPath}`);
        launchArgs.push(`--extensions-dir=${extensionDirPath}`);

        await runTests({
            cachePath,
            version: downloadVersion,
            extensionDevelopmentPath,
            extensionTestsPath,
            extensionTestsEnv,
            launchArgs,
        });
    }
}

export default async function runE2ETests(options) {
    return _runE2ETests(options).catch((e) => {
        if (!(e instanceof TestRunFailedError)) {
            console.error(e);
        }
        process.exit(1);
    });
}
