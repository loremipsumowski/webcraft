module.exports = {
	$schema: 'https://typedoc.org/schema.json',
	plugin: ['typedoc-plugin-missing-exports', 'typedoc-plugin-replace-text'],
	theme: 'default',
	entryPoints: ['src/index.ts'],
	out: './dist/docs',
	excludeExternals: true,
	excludeProtected: true,
	excludePrivate: true,
	disableSources: true,
	hideGenerator: true,
	sidebarLinks: {
		Example: 'http://example.com',
	},
	navigationLinks: {
		Example: 'http://example.com',
	},
};
