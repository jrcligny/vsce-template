import Mocha from 'mocha';
import * as path from 'path';
import * as fs from 'fs/promises';
import { glob, } from 'glob';

export default async function runSpecTests(options = null) {
    /**
     * Load content of JSON config file.
     */
    const config = await fs.readFile('../../src/spec.config.json').then(data => JSON.parse(data.toString()));

    if (options && options.reporter === 'json') {
        console.log('🧾 Generating output in json file: out-test/reports/spec-tests.json');
        config.reporter = 'json';
        config.reporterOptions = {
            output: path.resolve('../../out-test/reports/spec-tests.json'),
        };
    }

    /**
     * Create a new mocha test runner.
     */
    const mocha = new Mocha(config);

    return new Promise((c, e) => {
        glob([config.spec], { cwd: path.resolve('../../'), absolute: true })
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
                        }
                    });
                } catch (err) {
                    e(err);
                }
            })
            .catch(err => {
                return e(err);
            });
    }).catch((e) => {
        console.error(e);
        process.exit(1);
    });
}
