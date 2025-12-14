# WP Drive and Maintenance Toolkit

A WordPress plugin focused on asynchronous background processing, external API integration, and maintainable admin tooling, implemented using modern WordPress engineering practices.


## Design Goals

This plugin is structured to reflect production-grade WordPress development practices:
- Clear separation of concerns across PHP, REST, and React layers
- Explicit handling of asynchronous workflows using Action Scheduler
- Dependency isolation to avoid conflicts in shared plugin environments
- Maintainable architecture optimized for long-lived systems rather than short-term demos


## Features

- **Google Drive Integration**: OAuth 2.0 authentication with secure file upload, download, and folder management
- **Posts Maintenance**: Automated background scanning of posts and pages with Action Scheduler
- **React Admin Interface**: Modern React-based admin UI using WordPress Scripts and Components
- **WP-CLI Support**: Command-line interface for running maintenance scans
- **Background Processing**: Asynchronous task processing via Action Scheduler
- **Dependency Isolation**: PHP Scoper for vendor dependency isolation
- **PSR-4 Autoloading**: Modern PHP structure with Composer autoloading


## Requirements

- WordPress 6.1 or higher
- PHP 7.4 or higher
- Node.js 14+ and npm (for development)
- Composer (for PHP dependencies)

## Installation

### For End Users

1. Download or clone this repository
2. Upload the plugin folder to `/wp-content/plugins/`
3. Activate the plugin through the WordPress admin panel
4. Navigate to **Google Drive Test** or **Posts Maintenance** in the admin menu

### For Developers

1. Clone the repository:
```bash
git clone <repository-url>
cd wp-drive-and-maintenance-toolkit
```

2. Install PHP dependencies:
```bash
composer install
```

3. Install Node.js dependencies:
```bash
npm install
```

4. Build the plugin assets:
```bash
npm run build
```

## Development

### Available Commands

#### NPM Scripts

| Command | Description |
|---------|-------------|
| `npm install` | Install Node.js dependencies |
| `npm run build` | Build production-ready assets (compiles React, SCSS, and outputs to `/build/`) |
| `npm run start` | Start development mode with watch (recompiles on file changes) |
| `npm run translate` | Generate translation template file (`languages/hafee-utility-plugin.pot`) |
| `npm run package` | Create a distributable zip file (builds assets, optimizes Composer, creates zip) |

#### Composer Scripts

| Command | Description |
|---------|-------------|
| `composer install` | Install PHP dependencies |
| `composer build` | Build plugin (runs `npm run build` and PHP Scoper) |
| `composer test` | Run PHPUnit tests |

### Development Workflow

1. **Start development mode:**
```bash
npm run start
```
This watches for changes and automatically recompiles assets.

2. **Make your changes** to files in `src/`

3. **Build for production:**
```bash
npm run build
```

4. **Run tests:**
```bash
composer test
```

### Project Structure

```
wp-drive-and-maintenance-toolkit/
├── src/                          # Source code
│   ├── App/                      # Application classes
│   │   └── AdminPages/           # Admin page controllers
│   ├── CLI/                      # WP-CLI commands
│   ├── Encryption/                # Encryption utilities
│   ├── Endpoints/                # REST API endpoints
│   │   └── V1/                   # API version 1
│   ├── React/                    # React components and UI
│   │   ├── google-drive-ui/      # Google Drive interface
│   │   └── posts-maintenance-ui/ # Posts maintenance interface
│   ├── Base.php                  # Base class
│   ├── Loader.php                # Plugin loader
│   └── Singleton.php             # Singleton pattern
├── tests/                        # PHPUnit tests
├── languages/                    # Translation files
├── build/                        # Compiled assets (generated)
├── vendor/                       # Composer dependencies (generated)
├── wp-drive-maintenance-toolkit.php  # Main plugin file
├── composer.json                 # PHP dependencies
├── package.json                  # Node.js dependencies
└── webpack.config.js             # Webpack configuration
```

## Usage

### Google Drive Integration

1. Navigate to **Google Drive Test** in WordPress admin
2. Enter your Google Cloud Console OAuth credentials (Client ID and Client Secret)
3. Click **Authenticate with Google Drive**
4. Once authenticated, you can:
   - Upload files to Google Drive
   - Download files from Google Drive
   - Create folders
   - View and manage your Drive files

### Posts Maintenance

1. Navigate to **Posts Maintenance** in WordPress admin
2. Select content type (Posts, Pages, or Both)
3. Click **Run Scan** to scan immediately, or
4. Enable **Scheduled Scans** for automatic daily scanning

### WP-CLI Commands

Run maintenance scans from the command line:

```bash
# Scan all posts and pages
wp hafee posts scan --type=all_posts_pages

# Scan only posts
wp hafee posts scan --type=all_posts

# Scan only pages
wp hafee posts scan --type=all_pages
```

## Building for Distribution

To create a production-ready zip file:

```bash
npm run package
```

This will:
1. Build all assets (`npm run build`)
2. Install production Composer dependencies
3. Create a zip file excluding development files

## Testing

Run the PHPUnit test suite:

```bash
composer test
```

Or directly with PHPUnit:

```bash
vendor/bin/phpunit
```

## Code Standards

This plugin follows WordPress Coding Standards. Run code quality checks:

```bash
vendor/bin/phpcs
```

## REST API Endpoints

### Google Drive Endpoints

- `POST /wp-json/hafee/v1/drive/save-credentials` - Save OAuth credentials
- `POST /wp-json/hafee/v1/drive/auth` - Get OAuth authorization URL
- `GET /wp-json/hafee/v1/drive/callback` - OAuth callback handler
- `GET /wp-json/hafee/v1/drive/files` - List Drive files
- `POST /wp-json/hafee/v1/drive/upload` - Upload file to Drive
- `GET /wp-json/hafee/v1/drive/download` - Download file from Drive
- `POST /wp-json/hafee/v1/drive/create-folder` - Create folder in Drive

### Posts Maintenance Endpoints

- `POST /wp-json/hafee/v1/posts/scan-now` - Trigger immediate scan
- `POST /wp-json/hafee/v1/posts/schedule-scan` - Enable/disable scheduled scans
- `GET /wp-json/hafee/v1/posts/get-scan-data` - Get scan history and status
- `GET /wp-json/hafee/v1/posts/schedule-status` - Get schedule status

## License

GPL-2.0-or-later

## Author

Muhammad Hafee Imran
