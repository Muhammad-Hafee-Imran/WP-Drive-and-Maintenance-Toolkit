<?php

namespace WPMUDEV\PluginTest\Endpoints\V1;

defined('ABSPATH') || exit;

use WP_REST_Request;
use WP_REST_Response;
use WPMUDEV\PluginTest\Base;
use WPMUDEV\PluginTest\Endpoints\V1\PostsScanProcess;

class PostsApi extends Base
{

    public function init_posts_api()
    {

        add_action('rest_api_init', array($this, 'register_routes_posts'));

        // Hook the worker function into Action Scheduler
        add_action('wpmudev_posts_do_scan', 'wpmudev_run_posts_scan', 10, 1);
    }

    public function register_routes_posts()
    {
        // Scan now endpoint
        register_rest_route('wpmudev/v1/posts', '/scan-now', [
            'methods' => 'POST',
            'callback' => array($this, 'scan_posts_now')
        ]);

        // Schedule the scan
        register_rest_route('wpmudev/v1/posts', '/schedule-scan', [
            'methods' => 'POST',
            'callback' => array($this, 'schedule_posts')
        ]);

        // Show scan history
        register_rest_route('wpmudev/v1/posts', '/get-scan-data', [
            'methods' => 'GET',
            'callback' => array($this, 'get_scan_data')
        ]);
    }


     public function scan_posts_now( WP_REST_Request $request ) {
        $params = $request->get_json_params();
        $option = isset( $params['scanType'] ) ? sanitize_text_field( $params['scanType'] ) : 'all_posts_pages';

        // Map option to post types
        switch ( $option ) {
            case 'all_posts':       $post_types = [ 'post' ]; break;
            case 'all_pages':       $post_types = [ 'page' ]; break;
            case 'all_posts_pages': $post_types = [ 'post','page' ]; break;
            default:                $post_types = [ 'post','page' ]; break;
        }

        update_option( 'wpmudev_scan_status', [
        'status' => 'Scanning',
        'time'   => current_time( 'mysql' )
        ] );

        // Enqueue Action Scheduler job
        as_enqueue_async_action(
            'wpmudev_posts_do_scan',
            [ 'post_types' => $post_types ],
            'wpmudev-plugin-test'
        );

        return [
            'success'    => true,
            'message'    => 'Scan requested. Processing in background.',
            'post_types' => $post_types,
        ];
    }

    public function get_scan_data() {
        $scan_data = get_option( 'wpmudev_scan_data', [] );
        $status = get_option( 'wpmudev_scan_status', [ 'status' => 'Idle' ] );

        return [
            'status'      => $status['status'],
            'status_time' => $status['time'] ?? null,
            'total_scans' => count( $scan_data ),
            'last_scan'   => end( $scan_data ) ?: null,
            'history'     => $scan_data,
        ];
    }

    public function schedule_posts( WP_REST_Request $request ) {
    $params = $request->get_json_params();

    // Toggle enable/disable
    $enable = isset( $params['enable'] ) ? (bool) $params['enable'] : false;

    // Post type option (default = posts + pages)
    $option = isset( $params['post_type_option'] ) ? sanitize_text_field( $params['post_type_option'] ) : 'all_posts_pages';

    // Map option → post types
    switch ( $option ) {
        case 'all_posts':       $post_types = [ 'post' ]; break;
        case 'all_pages':       $post_types = [ 'page' ]; break;
        case 'all_posts_pages': $post_types = [ 'post','page' ]; break;
        default:                $post_types = [ 'post','page' ]; break;
    }

    if ( $enable ) {
        // Save settings
        update_option( 'wpmudev_daily_scan_enabled', true );
        update_option( 'wpmudev_scheduled_post_types', $post_types );

        // Schedule if not already scheduled
        if ( ! as_next_scheduled_action( 'wpmudev_daily_scan' ) ) {
            as_schedule_recurring_action(
                strtotime( 'tomorrow midnight' ),
                DAY_IN_SECONDS,
                'wpmudev_daily_scan'
            );
        }

        return [
            'success'     => true,
            'message'     => 'Daily scan scheduled.',
            'enabled'     => true,
            'post_types'  => $post_types,
        ];
    } else {
        // Disable scheduling
        update_option( 'wpmudev_daily_scan_enabled', false );
        delete_option( 'wpmudev_scheduled_post_types' );
        as_unschedule_all_actions( 'wpmudev_daily_scan' );

        return [
            'success' => true,
            'message' => 'Daily scan disabled.',
            'enabled' => false,
        ];
    }
}

}