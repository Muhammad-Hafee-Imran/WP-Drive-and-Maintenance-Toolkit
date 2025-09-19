<?php
namespace WPMUDEV\PluginTest\CLI;

use WP_CLI;
use WP_CLI_Command;
use WP_REST_Request;
use WP_REST_Response;
use WPMUDEV\PluginTest\Endpoints\V1\PostsApi;

defined( 'ABSPATH' ) || exit;

/**
 * WP-CLI command for Posts Maintenance scans.
 *
 * Usage:
 *   wp wpmudev posts scan --type=all_posts
 */
class PostsCli extends WP_CLI_Command {

    /**
     * Run a posts scan.
     *
     * ## OPTIONS
     *
     * [--type=<type>]
     * : The type of content to scan. Options:
     *   - all_posts
     *   - all_pages
     *   - all_posts_pages
     *
     * ## EXAMPLES
     *
     *     # Scan all posts
     *     wp wpmudev posts scan --type=all_posts
     *
     *     # Scan posts and pages
     *     wp wpmudev posts scan --type=all_posts_pages
     *
     * @when after_wp_load
     */
    public function __invoke( $args, $assoc_args ) {

        $option = $assoc_args['type'] ?? 'all_posts_pages';
        WP_CLI::log( '🔍 Starting scan for type: ' . $option );

        try {
            // Get PostsApi singleton instance
            $api = PostsApi::instance();

            if ( ! $api ) {
                WP_CLI::error( ' PostsApi is not initialized. Make sure Loader::instance() has booted.' );
                return;
            }

            // Simulate REST request
            $request = new WP_REST_Request( 'POST', '/wpmudev/v1/posts/scan-now' );
            $request->set_body_params( [ 'scanType' => $option ] );

            $response = $api->scan_posts_now( $request );

            // Normalize response
            if ( $response instanceof WP_REST_Response ) {
                $data = $response->get_data();
            } elseif ( is_array( $response ) ) {
                $data = $response;
            } else {
                $data = [ 'error' => 'Unexpected response type', 'raw' => $response ];
            }

            WP_CLI::success( ' Scan triggered. Response: ' . wp_json_encode( $data ) );

            // Run the worker immediately in CLI (bypass async queue)
            if ( isset( $data['post_types'] ) ) {
                do_action( 'wpmudev_posts_do_scan', [ 'post_types' => $data['post_types'] ] );
                WP_CLI::success( ' Worker executed synchronously in CLI.' );
            }

            // Fetch and display scan status summary
            $status = $api->get_scan_data();
            if ( $status instanceof WP_REST_Response ) {
                $status = $status->get_data();
            }

            WP_CLI::log( ' Total scans: ' . ( $status['total_scans'] ?? 0 ) );
            WP_CLI::log( ' Last scan: ' . ( $status['last_scan'] ?? 'N/A' )['post_date'] ?? 'N/A' );
            WP_CLI::log( 'Status: ' . ( $status['status'] ?? 'Unknown' ) );

        } catch ( \Throwable $e ) {
            WP_CLI::error(
                ' Fatal: ' . $e->getMessage() .
                ' in ' . $e->getFile() .
                ':' . $e->getLine()
            );
        }
    }
}
