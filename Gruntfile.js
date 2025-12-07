module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt);

	/**
	 * ✅ Files & folders to INCLUDE in the package
	 * ❌ Explicit exclusions added at the bottom
	 */
	const copyFiles = [
    // ✅ Core plugin files
    'wp-drive-maintenance-toolkit.php',
    'uninstall.php',

    // ✅ PHP source code
    'src/**',
    'app/**',
    'core/**',

    // ✅ React build + vendor runtime
    'build/**',
    'vendor/**',

    // ✅ Tests
    'tests/**',
    'phpunit.xml.dist',

    // ✅ Translations
    'languages/**',

    // ✅ Docs
    'readme.txt',
    'README.md',   // 👈 Added
    'LICENSE',

    // ✅ Dependency manifests
    'composer.json',
    'composer.lock',
    'package.json',
    'package-lock.json',

    // ✅ Build tools reviewers should see
    'webpack.config.js',
    'php-scoper/**',

    // ❌ Exclusions
    '!node_modules/**',
    '!.git/**',
    '!.github/**',
    '!.idea/**',
    '!.vscode/**',
    '!.DS_Store',
    '!Gruntfile.js',
    '!gulpfile.js',
    '!phpcs.ruleset.xml',
    '!changelog.txt'
];


	const changelog = grunt.file.exists('.changelog')
		? grunt.file.read('.changelog')
		: '';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// 🧹 Clean tasks
		clean: {
			temp: {
				src: ['**/*.tmp', '**/.afpDeleted*', '**/.DS_Store'],
				dot: true,
				filter: 'isFile',
			},
			assets: ['assets/css/**', 'assets/js/**'],
			folder_v2: ['build/**'],
		},

		// 🌍 Text domain check (kept from your original)
		checktextdomain: {
			options: {
				text_domain: 'hafee-utility-plugin',
				keywords: [
					'__:1,2d', '_e:1,2d', '_x:1,2c,3d',
					'esc_html__:1,2d', 'esc_html_e:1,2d', 'esc_html_x:1,2c,3d',
					'esc_attr__:1,2d', 'esc_attr_e:1,2d', 'esc_attr_x:1,2c,3d',
					'_ex:1,2c,3d', '_n:1,2,4d', '_nx:1,2,4c,5d',
					'_n_noop:1,2,3d', '_nx_noop:1,2,3c,4d',
				],
			},
			files: {
				src: ['core/**/*.php', 'app/**/*.php', 'src/**/*.php', '!core/external/**'],
				expand: true,
			},
		},

		// 📦 Copy only selected files into build folder
		copy: {
			pro: {
				src: copyFiles,
				dest: 'build/<%= pkg.name %>/',
			},
		},

		// 🗜️ Compress into ZIP
		compress: {
			pro: {
				options: {
					mode: 'zip',
					archive: './build/<%= pkg.name %>-<%= pkg.version %>.zip',
				},
				expand: true,
				cwd: 'build/<%= pkg.name %>/',
				src: ['**/*'],
				dest: '<%= pkg.name %>/',
			},
		},
	});

	grunt.loadNpmTasks('grunt-search');

	// Custom tasks
	grunt.registerTask('version-compare', ['search']);
	grunt.registerTask('finish', function () {
		const json = grunt.file.readJSON('package.json');
		const file = './build/' + json.name + '-' + json.version + '.zip';
		grunt.log.writeln('Process finished.');
		grunt.log.writeln('Built archive: ' + file);
	});

	// Main tasks
	grunt.registerTask('build', [
		'checktextdomain',
		'copy:pro',
		'compress:pro',
		'finish',
	]);

	grunt.registerTask('preBuildClean', [
		'clean:temp',
		'clean:assets',
		'clean:folder_v2',
	]);
};
