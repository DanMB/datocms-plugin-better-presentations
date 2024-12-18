import * as esbuild from 'esbuild';

const isProd = !process.argv.includes('--dev');

const config = {
	entryPoints: ['src/index.ts'],
	bundle: true,
	outdir: 'build',
	logLevel: 'info',
	minify: isProd,
	sourcemap: true,
	external: ['esbuild'],
};

if (isProd) {
	console.log(`Building in ${isProd ? 'production' : 'development'} environment...`);
	await esbuild.build(config);
	console.log('Build done!');
} else {
	console.log(`Building in ${isProd ? 'production' : 'development'} environment...`);
	let ctx = await esbuild.context(config);

	await ctx.serve();
	await ctx.watch();
}
