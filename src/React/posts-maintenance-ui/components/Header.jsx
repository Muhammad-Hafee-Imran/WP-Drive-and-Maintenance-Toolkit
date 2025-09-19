import { __ } from "@wordpress/i18n";

const Header = () => (
    <header className="wpmudev-pm-header">
        <h1> {__('Posts Maintenance', 'wpmudev-plugin-test' )} </h1>
        <p>{__('Run a scan across your posts to detect and update metadata.', 'wpmudev-plugin-test' )} </p>
    </header>
);

export default Header;
