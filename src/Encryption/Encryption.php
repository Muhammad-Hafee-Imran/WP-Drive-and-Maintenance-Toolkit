<?php

namespace WPMUDEV\PluginTest\Encryption;

defined('ABSPATH') || exit;

class Encryption
{

    public static function get_key()
    {
        $key = get_option('wpmudev_plugin_test_encryption_key');
        if (! $key) {
            $key = bin2hex(openssl_random_pseudo_bytes(32));
            add_option('wpmudev_plugin_test_encryption_key', $key, '', false);
        }
        return $key;
    }

    public static function encrypt($plaintext)
    {
        $key = hex2bin(self::get_key());
        if (! $key) {
            return false;
        }

        $cipher = 'aes-256-gcm';
        $iv     = openssl_random_pseudo_bytes(openssl_cipher_iv_length($cipher));
        $tag = null; 
        $ciphertext = openssl_encrypt(
            $plaintext,
            $cipher,
            $key,
            OPENSSL_RAW_DATA,
            $iv,
            $tag
        );


        if ($ciphertext === false) {
            return false;
        }

        $payload = [
            'iv'         => base64_encode($iv),
            'tag'        => base64_encode($tag),
            'ciphertext' => base64_encode($ciphertext),
        ];

        return base64_encode(wp_json_encode($payload));
    }

    public static function decrypt( $encrypted ) {
    // Bail early if empty or not a string
    if ( empty( $encrypted ) || ! is_string( $encrypted ) ) {
        return false;
    }

    $key = hex2bin( self::get_key() );
    if ( ! $key ) {
        return false;
    }

    // Try decoding
    $decoded = json_decode( base64_decode( $encrypted ), true );

    // If decoding failed → maybe legacy plain JSON (not encrypted)
    if ( ! is_array( $decoded ) ) {
        return $encrypted; // fallback: return raw string (legacy support)
    }

    // Validate structure
    if ( empty( $decoded['iv'] ) || empty( $decoded['tag'] ) || empty( $decoded['ciphertext'] ) ) {
        return false;
    }

    $iv         = base64_decode( $decoded['iv'] );
    $tag        = base64_decode( $decoded['tag'] );
    $ciphertext = base64_decode( $decoded['ciphertext'] );

    if ( $iv === false || $tag === false || $ciphertext === false ) {
        return false;
    }

    $plaintext = openssl_decrypt(
        $ciphertext,
        'aes-256-gcm',
        $key,
        OPENSSL_RAW_DATA,
        $iv,
        $tag
    );

    return $plaintext !== false ? $plaintext : false;
}


}
