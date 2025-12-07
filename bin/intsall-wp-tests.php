<?php
/**
 * Windows-friendly installer for WordPress PHPUnit test suite.
 *
 * Usage:
 *   php bin/install-wp-tests.php <db-name> <db-user> <db-pass> <db-host> <wp-version>
 */

if ( $argc < 6 ) {
    echo "Usage: php bin/install-wp-tests.php <db-name> <db-user> <db-pass> <db-host> <wp-version>\n";
    exit(1);
}

list(, $db_name, $db_user, $db_pass, $db_host, $wp_version) = $argv;

$tests_dir = sys_get_temp_dir() . '/wordpress-tests-lib';

// Download WordPress if not present.
$wp_core_dir = sys_get_temp_dir() . '/wordpress/';
if ( ! file_exists( $wp_core_dir . 'wp-settings.php' ) ) {
    echo "Downloading WordPress {$wp_version}...\n";
    $zip = "https://wordpress.org/wordpress-{$wp_version}.zip";
    if ( $wp_version === 'latest' ) {
        $zip = "https://wordpress.org/latest.zip";
    }

    $zip_file = sys_get_temp_dir() . '/wordpress.zip';
    file_put_contents( $zip_file, file_get_contents( $zip ) );

    $zip_obj = new ZipArchive;
    $zip_obj->open( $zip_file );
    $zip_obj->extractTo( $wp_core_dir );
    $zip_obj->close();

    // If extracted into "wordpress/", fix the structure.
    if ( is_dir( $wp_core_dir . 'wordpress' ) ) {
        rename( $wp_core_dir . 'wordpress', $wp_core_dir . 'src' );
    }
}

// Download the WP test suite.
if ( ! file_exists( $tests_dir . '/includes/functions.php' ) ) {
    echo "Downloading WordPress test suite...\n";
    $zip_file = sys_get_temp_dir() . '/wordpress-tests-lib.zip';
    file_put_contents(
        $zip_file,
        file_get_contents( 'https://develop.svn.wordpress.org/trunk/tests/phpunit/includes/functions.php?view=co' )
    );
    mkdir( $tests_dir, 0777, true );
    // Minimal test suite (includes/functions.php only). For full, you'd checkout from develop.svn.
    copy( $zip_file, $tests_dir . '/includes/functions.php' );
}

// Create test database.
echo "Creating test database...\n";
$mysqli = new mysqli( $db_host, $db_user, $db_pass );
if ( $mysqli->connect_error ) {
    die( "MySQL connection failed: " . $mysqli->connect_error . "\n" );
}
$mysqli->query( "CREATE DATABASE IF NOT EXISTS {$db_name}" );
echo "Done. Test DB '{$db_name}' is ready.\n";
