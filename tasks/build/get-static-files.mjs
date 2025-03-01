import * as fs from 'fs/promises';

export default async function getStaticFiles() {
    /* Copy content of ./static folder to ./out-package */
    console.log('⚙️ Copying static files to out-package');
    await fs.cp('../../static', '../../out-package', { recursive: true });
    /* Extension should use the same license and changelog as the main project - to ease maintenance */
    console.log('⚙️ Copying CHANGELOG.md to out-package');
    await fs.cp('../../CHANGELOG.md', '../../out-package/CHANGELOG.md');
    console.log('⚙️ Copying LICENSE.md to out-package');
    await fs.cp('../../LICENSE.md', '../../out-package/LICENSE.md');
}