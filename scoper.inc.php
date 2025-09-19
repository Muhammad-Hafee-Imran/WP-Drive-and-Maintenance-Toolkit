<?php
use Symfony\Component\Finder\Finder;

return [
    'prefix' => 'WPMUDEV\\PluginTest\\Vendor',

    'finders' => [
        // Scope only Google API Client
        Finder::create()
            ->files()
            ->in(__DIR__ . '/vendor/google'),

        // Scope only WP Background Processing
        Finder::create()
            ->files()
            ->in(__DIR__ . '/vendor/deliciousbrains/wp-background-processing'),
    ],

    'exclude-namespaces' => [
        'WPMUDEV\\PluginTest', // don't scope your plugin code
    ],

    'exclude-classes' => [
        'WP_CLI', // never scope WP-CLI globals
    ],

    'exclude-files' => [
        __DIR__ . '/vendor/composer/installed.json',
    ],
];
