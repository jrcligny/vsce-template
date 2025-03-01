import esbuild from 'esbuild';

export default async function bundleApp(isProduction = false, watching = false) {
    const ctx = await esbuild.context({
        entryPoints: ['../../src/extension.ts'],
        bundle: true,
        format: 'cjs',
        minify: isProduction,
        sourcemap: !isProduction,
        sourcesContent: false,
        platform: 'node',
        outfile: '../../out-package/app/extension.js',
        external: [
            /* exclude the 'vscode' module from the bundle (since it's provided by the VS Code runtime). */
            'vscode'
        ],
        logLevel: 'warning',
        plugins: []
    });
    if (watching) {
        await ctx.watch();
    }
    else {
        await ctx.rebuild();
        await ctx.dispose();
    }
}
