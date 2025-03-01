import * as fs from 'fs/promises';

export default async function clean() {
    /* Remove ./out-package folder */
    console.log('⚙️ Cleaning out-package folder');
    await fs.rm('../../out-package', { recursive: true }).catch(() => { });
}
