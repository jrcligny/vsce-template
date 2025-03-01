import * as path from 'path';
import vsce from '@vscode/vsce';

export default async function createVSIX() {
    await vsce.createVSIX({
        cwd: path.resolve(process.cwd(), '../../out-package'),
    });
}
