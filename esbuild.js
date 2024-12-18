import * as esbuild from 'esbuild';
import fs from 'node:fs';

const isProd = !process.argv.includes('--dev');

if (fs.existsSync('build')) {
	fs.readdirSync('build').forEach(file => {
		fs.rmSync(file, { recursive: true, force: true });
	});
} else {
	fs.mkdirSync('build', { recursive: true });
}

fs.copyFileSync('./src/index.html', './build/index.html');

const config = {
	entryPoints: ['src/index.ts'],
	loader: {
		'.html': 'text',
	},
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
	await ctx.serve({
		servedir: 'build',
	});
	await ctx.watch();
}
