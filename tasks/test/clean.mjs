import * as fs from 'fs/promises';

export default async function clean() {
    /* Remove ./out-test folder */
    console.log('⚙️ Cleaning out-test folder');
    await fs.rm('../../out-test', { recursive: true }).catch(() => { });
}
