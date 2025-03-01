import * as fs from 'fs/promises';

export default async function createPackageJSON() {
    /* Retrieve version and dependencies from package.json  */
    console.log('📖 Reading package.json to get version, license and dependencies');
    const packageJson = JSON.parse(await fs.readFile('../../package.json', 'utf-8'));
    const { version, license, dependencies } = packageJson;

    /* Update out-package/package.json */
    console.log('⚙️ Updating out-package/package.json');
    let extensionPackageJson = JSON.parse(await fs.readFile('../../out-package/package.json', 'utf-8'));
    extensionPackageJson = {
        version,
        license,
        ...extensionPackageJson,
        main: 'app/extension.js',
        dependencies,
    };
    await fs.writeFile('../../out-package/package.json', JSON.stringify(extensionPackageJson, null, 2));
}
