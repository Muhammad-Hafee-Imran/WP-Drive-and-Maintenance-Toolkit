import { __ } from "@wordpress/i18n";

const Header = () => (
    <header className="hafee-pm-header">
        <h1> {__('Posts Maintenance', 'hafee-utility-plugin' )} </h1>
        <p>{__('Run a scan across your posts to detect and update metadata.', 'hafee-utility-plugin' )} </p>
    </header>
);

export default Header;
