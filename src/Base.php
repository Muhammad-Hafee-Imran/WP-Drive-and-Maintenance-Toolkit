<?php
/**
 * File Description:
 * Base abstract class to be inherited by other classes
 *
 * @since   1.0.0
 *
 * @package Hafee_Toolkit
 */

namespace Hafee\Toolkit;

use Hafee\Toolkit\Singleton;

// Abort if called directly.
defined( 'WPINC' ) || die;

/**
 * Class Base
 *
 * @package Hafee\Toolkit
 */
abstract class Base extends Singleton {
	/**
	 * Getter method.
	 *
	 * Allows access to extended site properties.
	 *
	 * @param string $key Property to get.
	 *
	 * @return mixed Value of the property. Null if not available.
	 * @since 1.0.0
	 */
	public function __get( $key ) {
		// If set, get it.
		if ( isset( $this->{$key} ) ) {
			return $this->{$key};
		}

		return null;
	}

	/**
	 * Setter method.
	 *
	 * Set property and values to class.
	 *
	 * @param string $key Property to set.
	 * @param mixed  $value Value to assign to the property.
	 *
	 * @since 1.0.0
	 */
	public function __set( $key, $value ) {
		$this->{$key} = $value;
	}
}
