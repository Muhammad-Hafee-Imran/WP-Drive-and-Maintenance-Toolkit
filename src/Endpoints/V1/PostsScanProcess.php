<?php
namespace WPMUDEV\PluginTest\Endpoints\V1;

use WP_Background_Process;

class PostsScanProcess extends WP_Background_Process {

    // Unique queue identifier
    protected $action = 'posts_scan_process';

    // Task executed for each post ID
    protected function task( $post_id ) {
        // Prepare scan result
        $scan_result = [
            'post_id'    => $post_id,
            'post_title' => get_the_title( $post_id ),
            'post_type'  => get_post_type( $post_id ),
            'scan_time'  => current_time('mysql'),
            'status'     => 'success',
        ];

        // Fetch existing scan data
        $existing_data = get_option('wpmudev_scan_data', []);
        $existing_data[] = $scan_result;

        // Keep only the last 100 scans
        $existing_data = array_slice($existing_data, -100);

        // Save updated scan data
        update_option('wpmudev_scan_data', $existing_data);

        // Update post meta with last scan timestamp
        update_post_meta($post_id, 'wpmudev_test_last_scan', current_time('timestamp'));

        return false; // Remove item from queue
    }

    protected function complete() {
        parent::complete();
        error_log('Posts scan queue completed.');
    }
}
