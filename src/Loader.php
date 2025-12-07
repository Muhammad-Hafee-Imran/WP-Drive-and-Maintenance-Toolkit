<?php

/**
 * Class to boot up plugin.
 *
 * @since   1.0.0
 *
 * @package Hafee_Toolkit
 */

namespace Hafee\Toolkit;

use Hafee\Toolkit\Base;

// If this file is called directly, abort.
defined('WPINC') || die;

final class Loader extends Base
{
	/**
	 * Settings helper class instance.
	 *
	 * @since 1.0.0
	 * @var object
	 *
	 */
	public $settings;

	/**
	 * Minimum supported php version.
	 *
	 * @since  1.0.0
	 * @var float
	 *
	 */
	public $php_version = '7.4';

	/**
	 * Minimum WordPress version.
	 *
	 * @since  1.0.0
	 * @var float
	 *
	 */
	public $wp_version = '6.1';

	/**
	 * Initialize functionality of the plugin.
	 *
	 * This is where we kick-start the plugin by defining
	 * everything required and register all hooks.
	 *
	 * @since  1.0.0
	 * @access protected
	 * @return void
	 */
	protected function __construct()
	{
		if (! $this->can_boot()) {
			return;
		}

		$this->init();
	}

	/**
	 * Main condition that checks if plugin parts should continue loading.
	 *
	 * @return bool
	 */
	private function can_boot()
	{
		/**
		 * Checks
		 *  - PHP version
		 *  - WP Version
		 * If not then return.
		 */
		global $wp_version;

		return (
			version_compare(PHP_VERSION, $this->php_version, '>') &&
			version_compare($wp_version, $this->wp_version, '>')
		);
	}

	/**
	 * Register all the actions and filters.
	 *
	 * @since  1.0.0
	 * @access private
	 * @return void
	 */
	private function init()
	{
		App\AdminPages\GoogleDrive::instance()->init();
		Endpoints\V1\DriveAPI::instance()->init();
		App\AdminPages\PostsMaintenance::instance()->init_posts_maintenance();
		Endpoints\V1\PostsApi::instance()->init_posts_api();

		if (defined('WP_CLI') && WP_CLI) {
			try {
				\WP_CLI::add_command(
					'hafee posts scan',
					\Hafee\Toolkit\CLI\PostsCli::class
				);
			} catch (\Exception $e) {
				\WP_CLI::warning('Could not register posts-scan command: ' . $e->getMessage());
			}
		}
	}
}
