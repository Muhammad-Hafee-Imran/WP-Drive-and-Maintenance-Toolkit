import {
    createRoot,
    StrictMode,
    useEffect,
    useState
} from "@wordpress/element";

import Header from "./components/Header";
import ScanTypeSelector from "./components/ScanTypeSelector";
import ScanButton from "./components/ScanButton";
import RefreshButton from "./components/RefreshButton";
import ResultsTable from "./components/ResultsTable";
import Notice from "./components/Notice";

import useNotice from "./hooks/useNotice";
import useScan from "./hooks/useScan";
import useResults from "./hooks/useResults";
import useScanStatus from "./hooks/useScanStatus";

import "./scss/posts-style.scss";

const PostsMaintenanceApp = () => {
    const { notice, showNotice, clearNotice } = useNotice();
    const {
        isScanning,
        message: scanMessage,
        scanType,
        setScanType,
        handleScanNow
    } = useScan();

    const { scanStatus, setScanStatus, statusTime, setStatusTime } = useScanStatus();

    // Pass setScanStatus into useResults
    const {
        history,
        totalScans,
        lastScan,
        message: resultsMessage,
        isLoading,
        handleResults
    } = useResults(setScanStatus, setStatusTime);

    // Load results when page mounts
    useEffect(() => {
        handleResults();
    }, []);

    return (
        <div className="wpmudev-pm-container">
            <Header />

            {/* Notice messages */}
            <Notice
                type={notice.type || "info"}
                message={notice.message || scanMessage || resultsMessage}
                onDismiss={clearNotice}
            />

            {/* Content type selector */}
            <ScanTypeSelector scanType={scanType} setScanType={setScanType} />

            {/* Run Scan button */}
            <ScanButton
                isScanning={isScanning}
                scanStatus={scanStatus} 
                onClick={async () => {
                    await handleScanNow();
                    await handleResults();
                }}
            />

            {/* Refresh results button */}
            <RefreshButton
                isLoading={isLoading}
                onClick={handleResults}
            />

            {/* ✅ Status indicator */}
            <div className="wpmudev-pm-status">
                <p><strong>Status:</strong> {scanStatus}</p>
                <strong>Last Checked:</strong> {statusTime ? statusTime : "N/A"}
            </div>

            {/* Summary */}
            <div className="wpmudev-pm-summary">
                <p><strong>Total Scans:</strong> {totalScans}</p>
                <p><strong>Last Scan:</strong> {lastScan ? lastScan.time : "No scans yet"}</p>
            </div>

            {/* Loading indicator */}
            {isLoading && <p>Loading results...</p>}

            {/* Results table */}
            {history.length > 0 && <ResultsTable results={history} />}
        </div>
    );
};

// Mount React app into container
const domElement = document.getElementById(wpmudevPostsMaintenance.domId);

if (domElement) {
    const root = createRoot(domElement);
    root.render(
        <StrictMode>
            <PostsMaintenanceApp />
        </StrictMode>
    );
} else {
    console.error("❌ React root element not found:", wpmudevPostsMaintenance.domId);
}
