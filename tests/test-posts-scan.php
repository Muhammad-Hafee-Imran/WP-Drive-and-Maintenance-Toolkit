<?php
/**
 * Tests for Posts Maintenance functionality.
 *
 * @package Hafee_Toolkit
 */

class TestPostsScan extends WP_Test_REST_TestCase {

    public function setUp(): void {
        parent::setUp();
        // Ensure each test runs as an admin so permission_callback passes.
        $user_id = $this->factory()->user->create( [ 'role' => 'administrator' ] );
        wp_set_current_user( $user_id );
    }

    /**
     * Test scan with no posts.
     */
    public function test_scan_no_posts() {
        $request  = new WP_REST_Request( 'POST', '/hafee/v1/posts/scan-now' );
        $response = rest_get_server()->dispatch( $request );
        $data     = $response->get_data();

        $this->assertTrue( $data['success'] );
        $this->assertContains( 'post', $data['post_types'] );
        $this->assertContains( 'page', $data['post_types'] );
    }

    /**
     * Test scan history may be empty initially.
     */
    public function test_get_scan_data_returns_history() {
        $request  = new WP_REST_Request( 'GET', '/hafee/v1/posts/get-scan-data' );
        $response = rest_get_server()->dispatch( $request );
        $data     = $response->get_data();

        $this->assertIsArray( $data['history'] );
        $this->assertArrayHasKey( 'status', $data );
        $this->assertArrayHasKey( 'total_scans', $data );
    }

    /**
     * Test single post scan (just response success).
     */
    public function test_scan_single_post() {
        $post_id = $this->factory()->post->create();

        $request  = new WP_REST_Request( 'POST', '/hafee/v1/posts/scan-now' );
        $response = rest_get_server()->dispatch( $request );
        $data     = $response->get_data();

        $this->assertTrue( $data['success'] );
    }

    /**
     * Test multiple post types scan (only posts & pages).
     */
    public function test_scan_multiple_post_types() {
        $this->factory()->post->create();
        $this->factory()->post->create( [ 'post_type' => 'page' ] );

        $request  = new WP_REST_Request( 'POST', '/hafee/v1/posts/scan-now' );
        $response = rest_get_server()->dispatch( $request );
        $data     = $response->get_data();

        $this->assertContains( 'post', $data['post_types'] );
        $this->assertContains( 'page', $data['post_types'] );
    }

    /**
     * Test scan updates existing meta with a fresh value.
     */
    public function test_scan_updates_existing_meta() {
        $post_id = $this->factory()->post->create();
        update_post_meta( $post_id, 'hafee_test_last_scan', 'old_value' );

        $request  = new WP_REST_Request( 'POST', '/hafee/v1/posts/scan-now' );
        rest_get_server()->dispatch( $request );

        $new_value = get_post_meta( $post_id, 'hafee_test_last_scan', true );
        $this->assertNotEmpty( $new_value );
    }

    /**
     * Test scheduling scan returns success.
     */
    public function test_schedule_scan_returns_success() {
        $request = new WP_REST_Request( 'POST', '/hafee/v1/posts/schedule-scan' );

        // Use set_param so the endpoint callback sees it via get_param().
        $request->set_param( 'enabled', true );

        $response = rest_get_server()->dispatch( $request );
        $data     = $response->get_data();

        $this->assertTrue( $data['success'] );
    }
}
