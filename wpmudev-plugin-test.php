<?php

/**
 * Plugin Name:       WPMU DEV Plugin Test - Forminator Developer Position
 * Description:       A plugin focused on testing coding skills.
 * Requires at least: 6.1
 * Requires PHP:      7.4
 * Version:           0.1.0
 * Author:            Muhammad Hafee Imran
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       wpmudev-plugin-test
 *
 * @package           create-block
 */

if (! defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

// Support for site-level autoloading.
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
	require_once __DIR__ . '/vendor/autoload.php';
}


// Plugin version.
if (! defined('WPMUDEV_PLUGINTEST_VERSION')) {
	define('WPMUDEV_PLUGINTEST_VERSION', '1.0.0');
}

// Define WPMUDEV_PLUGINTEST_PLUGIN_FILE.
if (! defined('WPMUDEV_PLUGINTEST_PLUGIN_FILE')) {
	define('WPMUDEV_PLUGINTEST_PLUGIN_FILE', __FILE__);
}

if (! class_exists('ActionScheduler')) {
	require_once __DIR__ . '/vendor/action-scheduler-trunk/action-scheduler.php';
}


// Plugin directory.
if (! defined('WPMUDEV_PLUGINTEST_DIR')) {
	define('WPMUDEV_PLUGINTEST_DIR', plugin_dir_path(__FILE__));
}

// Plugin url.
if (! defined('WPMUDEV_PLUGINTEST_URL')) {
	define('WPMUDEV_PLUGINTEST_URL', plugin_dir_url(__FILE__));
}

// Assets url.
if (! defined('WPMUDEV_PLUGINTEST_ASSETS_URL')) {
	define('WPMUDEV_PLUGINTEST_ASSETS_URL', WPMUDEV_PLUGINTEST_URL . '/build');
}

// Shared UI Version.
if (! defined('WPMUDEV_PLUGINTEST_SUI_VERSION')) {
	define('WPMUDEV_PLUGINTEST_SUI_VERSION', '2.12.23');
}

// Load scoped vendor autoloader.
if ( file_exists( __DIR__ . '/build/php-scoped/autoload.php' ) ) {
    require_once __DIR__ . '/build/php-scoped/autoload.php';
}





// Daily scan hook: runs when Action Scheduler calls 'wpmudev_daily_scan'
add_action( 'wpmudev_daily_scan', function() {
    $enabled = get_option( 'wpmudev_daily_scan_enabled', false );
    if ( ! $enabled ) {
        return; // safety check
    }

    // Load saved post types or fallback
    $post_types = get_option( 'wpmudev_scheduled_post_types', [ 'post','page' ] );

    // Reset status
    update_option( 'wpmudev_scan_status', [
        'status' => 'pending',
        'time'   => current_time( 'mysql' )
    ]);

    // Enqueue Action Scheduler job
    as_enqueue_async_action(
        'wpmudev_posts_do_scan',
        [ 'post_types' => $post_types ],
        'wpmudev-plugin-test'
    );
});



function wpmudev_run_posts_scan( $post_types ) {
    error_log( 'Worker fired with post types: ' . wp_json_encode( $post_types ) );

    $args = [
        'post_type'      => $post_types,
        'post_status'    => 'publish',
        'posts_per_page' => 50,
        'fields'         => 'ids',
    ];

    $post_ids = get_posts( $args );

    $results = [];
    foreach ( $post_ids as $post_id ) {
        update_post_meta( $post_id, 'wpmudev_test_last_scan', current_time( 'mysql' ) );
        $results[] = [
            'id'    => $post_id,
            'title' => get_the_title( $post_id ),
			'type'  => get_post_type( $post_id ),
        ];
    }

    // Save results
    $scan_data   = get_option( 'wpmudev_scan_data', [] );
    $scan_data[] = [
        'time'   => current_time( 'mysql' ),
        'count'  => count( $results ),
        'posts'  => $results,
    ];

    update_option( 'wpmudev_scan_data', $scan_data );

	update_option( 'wpmudev_scan_status', [
        'status' => 'Idle',
        'time'   => current_time( 'mysql' )
    ]);

	

}

// ✅ Hook the worker
add_action( 'wpmudev_posts_do_scan', 'wpmudev_run_posts_scan', 10, 1 );







/**
 * WPMUDEV_PluginTest class.
 */
class WPMUDEV_PluginTest
{

	/**
	 * Holds the class instance.
	 *
	 * @var WPMUDEV_PluginTest $instance
	 */
	private static $instance = null;

	/**
	 * Return an instance of the class
	 *
	 * Return an instance of the WPMUDEV_PluginTest Class.
	 *
	 * @return WPMUDEV_PluginTest class instance.
	 * @since 1.0.0
	 *
	 */
	public static function get_instance()
	{
		if (null === self::$instance) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Class initializer.
	 */
	public function load()
	{
		load_plugin_textdomain(
			'wpmudev-plugin-test',
			false,
			dirname(plugin_basename(__FILE__)) . '/languages'
		);



		WPMUDEV\PluginTest\Loader::instance();
	}
}

// Init the plugin and load the plugin instance for the first time.
add_action(
	'init',
	function () {
		WPMUDEV_PluginTest::get_instance()->load();
	},
	9
);
