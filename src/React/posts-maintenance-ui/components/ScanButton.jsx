const ScanButton = ({ isScanning, scanStatus, onClick }) => (
    <button
        className="button button-primary"
        onClick={onClick}
        disabled={isScanning || scanStatus === "Scanning"}
    >
        {isScanning || scanStatus === "Scanning" ? "Scanning..." : "Run Scan"}
    </button>
);

export default ScanButton;
