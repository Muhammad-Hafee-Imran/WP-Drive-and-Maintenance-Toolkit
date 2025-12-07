# WP Drive and Maintenance Toolkit

A WordPress plugin providing Google Drive integration and automated content maintenance workflows.

## Features

- OAuth 2.0 Drive integration
- Secure file upload/download
- React-based admin interface (WP Scripts, WP Components)
- WP-CLI command for post scanning
- Background processing via Action Scheduler
- Daily cron automation
- Composer + PSR-4 autoloading
- PHPUnit tests + automated build pipeline
- Dependency isolation with PHP Scoper

## Development

### Composer
Install composer packages
```bash
composer install
```

### Build Tasks (npm)
Everything should be handled by npm.

Install npm packages
```bash
npm install
```

| Command              | Action                                                |
|----------------------|-------------------------------------------------------|
| `npm run watch`      | Compiles and watch for changes.                       |
| `npm run compile`    | Compile production ready assets.                      |
| `npm run build`      | Build production ready bundle inside `/build/` folder |
