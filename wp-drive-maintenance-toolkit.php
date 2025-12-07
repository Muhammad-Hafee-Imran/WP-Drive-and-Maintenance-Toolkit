<?php

/**
 * Plugin Name:       WP Drive and Maintenance Toolkit
 * Description:       Provides Google Drive integration and automated content maintenance tools for WordPress, including background post scanning, Action Scheduler automation, and a React-powered admin interface.
 * Requires at least: 6.1
 * Requires PHP:      7.4
 * Version:           0.1.1
 * Author:            Muhammad Hafee Imran
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       hafee-utility-plugin
 */

if (! defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

// Support for site-level autoloading.
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
	require_once __DIR__ . '/vendor/autoload.php';
}


// Plugin version.
if (! defined('HAFEE_TOOLKIT_VERSION')) {
	define('HAFEE_TOOLKIT_VERSION', '1.0.0');
}

// Define HAFEE_TOOLKIT_PLUGIN_FILE.
if (! defined('HAFEE_TOOLKIT_PLUGIN_FILE')) {
	define('HAFEE_TOOLKIT_PLUGIN_FILE', __FILE__);
}

if (! class_exists('ActionScheduler')) {
	require_once __DIR__ . '/vendor/action-scheduler-trunk/action-scheduler.php';
}


// Plugin directory.
if (! defined('HAFEE_TOOLKIT_DIR')) {
	define('HAFEE_TOOLKIT_DIR', plugin_dir_path(__FILE__));
}

// Plugin url.
if (! defined('HAFEE_TOOLKIT_URL')) {
	define('HAFEE_TOOLKIT_URL', plugin_dir_url(__FILE__));
}

// Assets url.
if (! defined('HAFEE_TOOLKIT_ASSETS_URL')) {
	define('HAFEE_TOOLKIT_ASSETS_URL', HAFEE_TOOLKIT_URL . '/build');
}

// Load scoped vendor autoloader.
if ( file_exists( __DIR__ . '/build/php-scoped/autoload.php' ) ) {
    require_once __DIR__ . '/build/php-scoped/autoload.php';
}





// Daily scan hook: runs when Action Scheduler calls 'hafee_daily_scan'
add_action( 'hafee_daily_scan', function() {
    $enabled = get_option( 'hafee_daily_scan_enabled', false );
    if ( ! $enabled ) {
        return; // safety check
    }

    // Load saved post types or fallback
    $post_types = get_option( 'hafee_scheduled_post_types', [ 'post','page' ] );

    // Reset status
    update_option( 'hafee_scan_status', [
        'status' => 'pending',
        'time'   => current_time( 'mysql' )
    ]);

    // Enqueue Action Scheduler job
    as_enqueue_async_action(
        'hafee_posts_do_scan',
        [ 'post_types' => $post_types ],
        'hafee-utility-plugin'
    );
});



function hafee_run_posts_scan( $post_types ) {

    $args = [
        'post_type'      => $post_types,
        'post_status'    => 'publish',
        'posts_per_page' => 50,
        'fields'         => 'ids',
    ];

    $post_ids = get_posts( $args );

    $results = [];
    foreach ( $post_ids as $post_id ) {
        update_post_meta( $post_id, 'hafee_test_last_scan', current_time( 'mysql' ) );
        $results[] = [
            'id'    => $post_id,
            'title' => get_the_title( $post_id ),
			'type'  => get_post_type( $post_id ),
        ];
    }

    // Save results
    $scan_data   = get_option( 'hafee_scan_data', [] );
    $scan_data[] = [
        'time'   => current_time( 'mysql' ),
        'count'  => count( $results ),
        'posts'  => $results,
    ];

    update_option( 'hafee_scan_data', $scan_data );

	update_option( 'hafee_scan_status', [
        'status' => 'Idle',
        'time'   => current_time( 'mysql' )
    ]);

	

}

add_action( 'hafee_posts_do_scan', 'hafee_run_posts_scan', 10, 1 );







/**
 * HAFEE_Toolkit class.
 */
class HAFEE_Toolkit
{

	/**
	 * Holds the class instance.
	 *
	 * @var HAFEE_Toolkit $instance
	 */
	private static $instance = null;

	/**
	 * Return an instance of the class
	 *
	 * Return an instance of the HAFEE_Toolkit Class.
	 *
	 * @return HAFEE_Toolkit class instance.
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
			'hafee-utility-plugin',
			false,
			dirname(plugin_basename(__FILE__)) . '/languages'
		);



		Hafee\Toolkit\Loader::instance();
	}
}

// Init the plugin and load the plugin instance for the first time.
add_action(
	'init',
	function () {
		HAFEE_Toolkit::get_instance()->load();
	},
	9
);
