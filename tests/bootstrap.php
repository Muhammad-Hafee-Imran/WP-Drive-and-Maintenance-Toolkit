<?php
/**
 * PHPUnit bootstrap file.
 *
 * @package Hafee_Toolkit
 */

// Load Composer autoloader so classes are available.
require dirname( __DIR__ ) . '/vendor/autoload.php';

// Find the WordPress test library.
$_tests_dir = getenv( 'WP_TESTS_DIR' );
if ( ! $_tests_dir ) {
    $_tests_dir = rtrim( sys_get_temp_dir(), '/\\' ) . '/wordpress-tests-lib';
}

if ( ! file_exists( "{$_tests_dir}/includes/functions.php" ) ) {
    echo "Could not find {$_tests_dir}/includes/functions.php, have you run bin/install-wp-tests.sh ?" . PHP_EOL;
    exit( 1 );
}

require_once "{$_tests_dir}/includes/functions.php";

/**
 * Only load the Posts API when running tests.
 */
function _manually_load_plugin() {
    // Initialize PostsApi (autoloaded via Composer).
    if ( class_exists( '\Hafee\Toolkit\Endpoints\V1\PostsApi' ) ) {
        \Hafee\Toolkit\Endpoints\V1\PostsApi::instance()->init_posts_api();
    }
}
tests_add_filter( 'plugins_loaded', '_manually_load_plugin' );

/**
 * Stub Action Scheduler functions for PHPUnit.
 * Prevents "undefined function" errors during tests.
 */
if ( ! function_exists( 'as_enqueue_async_action' ) ) {
    function as_enqueue_async_action( $hook, $args = [], $group = '' ) {
        return true;
    }
}
if ( ! function_exists( 'as_unschedule_all_actions' ) ) {
    function as_unschedule_all_actions( $hook, $args = [], $group = '' ) {
        return true;
    }
}
if ( ! function_exists( 'as_next_scheduled_action' ) ) {
    function as_next_scheduled_action( $hook, $args = [], $group = '' ) {
        return false;
    }
}

// Boot WP testing environment.
require "{$_tests_dir}/includes/bootstrap.php";
