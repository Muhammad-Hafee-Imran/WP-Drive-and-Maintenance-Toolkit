import { __ } from "@wordpress/i18n";

const ScanButton = ({ isScanning, scanStatus, onClick }) => (
    <button
        className="button button-primary"
        onClick={onClick}
        disabled={isScanning || scanStatus === "Scanning"}
    >
        {isScanning || scanStatus === "Scanning"
            ? __("Scanning...", "wpmudev-plugin-test")
            : __("Run Scan", "wpmudev-plugin-test")}
    </button>
);

export default ScanButton;
