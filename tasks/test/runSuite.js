const path = require('path');
const fs = require('fs');
const Mocha = require('mocha');
const { glob } = require('glob');

exports.run = run;
async function run() {

    if (!process.env.CONFIG_FILE) {
        throw new Error('No path to test configuration file provided.');
    }

    /**
     * Load content of JSON config file.
     */
    const config = await fs.promises.readFile(process.env.CONFIG_FILE).then(data => JSON.parse(data.toString()));

    const suiteName = path.basename(path.dirname(process.env.CONFIG_FILE));

    if (process.env.REPORTER === 'xunit') {
        console.log(`🧾 Generating output in xunit file: .vscode-test/reports/e2e-tests-${suiteName}.xml`);
        config.mocha.reporter = 'xunit';
        config.mocha.reporterOptions = {
            output: path.resolve(__dirname, `../../.vscode-test/reports/e2e-tests-${suiteName}.xml`),
        };
    }

    /**
     * Create a new mocha test runner.
     */
    const mocha = new Mocha(config.mocha);

    return new Promise((c, e) => {
        glob(config.files, { cwd: path.resolve(__dirname, '../../'), absolute: true })
            .then(files => {
                // Add files to the test suite
                files.forEach(filename => mocha.addFile(filename));

                try {
                    // Run the mocha test
                    mocha.run(failures => {
                        if (failures > 0) {
                            e(`${failures} tests failed.\r\n`);
                        } else {
                            c();
                            // Add a new line after the test suite to separate output from vscode output
                            console.log('\r\n');
                        }
                    });
                } catch (err) {
                    e(err);
                }
            })
            .catch(err => {
                return e(err);
            });
    });
}
