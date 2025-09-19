<?php

namespace WPMUDEV\PluginTest\App\AdminPages;

defined( 'ABSPATH' ) || exit;

use WPMUDEV\PluginTest\Base;

class PostsMaintenance extends Base {

    /**
     * Page title.
     *
     * @var string
     */
    private $page_title;

    /**
     * Page slug.
     *
     * @var string
     */
    private $page_slug = 'wpmudev_plugintest_posts';

    /**
     * Admin page hook suffix.
     *
     * @var string
     */
    private $admin_page_hook;

    /**
     * Initialize the Posts Maintenance page.
     */
    public function init_posts_maintenance() {
        $this->page_title = __( 'Posts Maintenance', 'wpmudev-plugin-test' );

        add_action( 'admin_menu', array( $this, 'register_admin_page' ) );
        add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
        add_filter( 'admin_body_class', array( $this, 'admin_body_classes' ) );
    }

    /**
     * Register the admin menu page.
     */
    public function register_admin_page() {
        $this->admin_page_hook = add_menu_page(
            $this->page_title,
            $this->page_title,
            'manage_options',
            $this->page_slug,
            array( $this, 'callback' ),
            'dashicons-admin-post',
            8
        );
    }

    /**
     * Enqueue JS and CSS assets for the React app.
     *
     * @param string $hook The current admin page hook.
     */
    public function enqueue_assets( $hook ) {
        // Only load assets on our admin page.
        if ( $hook !== $this->admin_page_hook ) {
            return;
        }

        $script_data = $this->script_data();

        // 1. Register JS
        wp_register_script(
            'wpmudev-posts-maintenance-admin',
            WPMUDEV_PLUGINTEST_ASSETS_URL . '/posts-maintenance/index.js',
            array(
                'react',
				'wp-components',
				'wp-element',
				'wp-i18n',
				'wp-is-shallow-equal',
				'wp-polyfill',
            ),
            $script_data['version'],
            true
        );

        // 2. Register CSS
        wp_register_style(
            'wpmudev-posts-maintenance-admin-style',
            WPMUDEV_PLUGINTEST_ASSETS_URL . '/posts-maintenance/index.css',
            array(),
            $script_data['version']
        );

        // 3. Localize
        wp_localize_script(
            'wpmudev-posts-maintenance-admin',
            'wpmudevPostsMaintenance',
            array(
                'domId'   => 'wpmudev-posts-maintenance-root',
                'restEndpointGetData' => 'wpmudev/v1/posts/get-scan-data/',
                'restEndpointScheduleScan'    => 'wpmudev/v1/posts/schedule-scan/',
                'restEndpointScanNow' =>  'wpmudev/v1/posts/scan-now/',
                'restEndpointScheduleStatus' => 'wpmudev/v1/posts/schedule-status',
                'nonce'                        => wp_create_nonce( 'wp_rest' ),
            )
        );

        // 4. Enqueue
        wp_enqueue_script( 'wpmudev-posts-maintenance-admin' );
        wp_enqueue_style( 'wpmudev-posts-maintenance-admin-style' );
    }

    /**
     * Fetch script data from the Webpack-generated asset file.
     *
     * @return array
     */
    protected function script_data(): array {
        static $asset_data = null;

        if ( is_null( $asset_data ) && file_exists( WPMUDEV_PLUGINTEST_DIR . 'build/posts-maintenance/index.asset.php' ) ) {
            $asset_data = include WPMUDEV_PLUGINTEST_DIR . 'build/posts-maintenance/index.asset.php';
        }

        return (array) $asset_data;
    }

    /**
     * Add custom admin body classes if needed.
     *
     * @param string $classes Existing body classes.
     * @return string Modified classes.
     */
    public function admin_body_classes( $classes ) {
        $screen = get_current_screen();

        if ( $screen && $screen->id === $this->admin_page_hook ) {
            $classes .= ' wpmudev-posts-maintenance-admin ';
        }

        return $classes;
    }

    /**
     * Render the admin page (div for React to mount).
     */
    public function callback() {
    echo '<div id="wpmudev-posts-maintenance-root" class="sui-wrap"></div>';
}

}
