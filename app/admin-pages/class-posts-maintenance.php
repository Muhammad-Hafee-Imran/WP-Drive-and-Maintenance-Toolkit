<?php

namespace WPMUDEV\PluginTest\App\Admin_Pages;

// Abort if called directly.
defined( 'WPINC' ) || die;

use WPMUDEV\PluginTest\Base;

class Posts_Maintenance extends Base {

    private $page_title;

    private $assets_version;

    private $wpmudev_plugintest_posts;

    private $page_slug = 'wpmudev_plugintest_posts';



    public function init_posts_maintenance() {

        $this->page_title = __('Posts Maintenance', 'wpmudev-plugin-test');
        $this->assets_version = WPMUDEV_PLUGINTEST_VERSION;

        add_action( 'admin_menu', array($this , 'register_admin_page'));

        /**add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );

        add_filter( 'admin_body_class', array( $this, 'admin_body_classes' ) );*/

    }

    private function register_admin_page() {
        add_menu_page(
			$this->page_title,
			$this->page_title,
			'manage_options',
			$this->page_slug,
			array( $this, 'callback' ),
			'dashicons-admin-post',
			8
		);
    }

    private function callback() {

    }



}