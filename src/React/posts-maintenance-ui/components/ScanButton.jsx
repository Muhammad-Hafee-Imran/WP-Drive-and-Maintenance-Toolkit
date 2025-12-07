import { __ } from "@wordpress/i18n";

const ScanButton = ({ isScanning, scanStatus, onClick }) => (
    <button
        className="button button-primary"
        onClick={onClick}
        disabled={isScanning || scanStatus === "Scanning"}
    >
        {isScanning || scanStatus === "Scanning"
            ? __("Scanning...", "hafee-utility-plugin")
            : __("Run Scan", "hafee-utility-plugin")}
    </button>
);

export default ScanButton;
