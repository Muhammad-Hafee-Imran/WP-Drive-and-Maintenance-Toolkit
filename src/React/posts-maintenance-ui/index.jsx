import {
    createRoot,
    StrictMode,
    useEffect
} from "@wordpress/element";
import { __ } from "@wordpress/i18n";

import Header from "./components/Header";
import ScanTypeSelector from "./components/ScanTypeSelector";
import ScanButton from "./components/ScanButton";
import RefreshButton from "./components/RefreshButton";
import ResultsTable from "./components/ResultsTable";
import Notice from "./components/Notice";
import ScheduleToggle from "./components/ScheduleToggle"; // 👈 new

import useNotice from "./hooks/useNotice";
import useScan from "./hooks/useScan";
import useResults from "./hooks/useResults";
import useScanStatus from "./hooks/useScanStatus";
import useScheduleToggle from "./hooks/useScheduleToggle"; // 👈 new

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

    // Results + polling
    const {
        history,
        totalScans,
        lastScan,
        message: resultsMessage,
        isLoading,
        handleResults
    } = useResults(setScanStatus, setStatusTime);

    // Schedule toggle hook
    const { enabled, loading, message: scheduleMessage, toggleSchedule } = useScheduleToggle();

    // Load results on mount
    useEffect(() => {
        handleResults();
    }, []);

    return (
        <div className="wpmudev-pm-container">
            <Header />

            {/* Notice messages */}
            {/* Notice messages */}
            <Notice
                type={notice.type || "info"}
                message={
                    notice.message ||
                    scanMessage ||
                    resultsMessage ||
                    scheduleMessage
                }
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

            <ScheduleToggle
                enabled={enabled}
                loading={loading}
                scanType={scanType}
                onToggle={toggleSchedule}
            />



            {/* ✅ Status indicator */}
            <div className="wpmudev-pm-status">
                <p>
                    <strong>{__("Status:","wpmudev-plugin-test")}</strong> {scanStatus} &nbsp;&nbsp;
                    <strong>{__("Last Checked:","wpmudev-plugin-test")}</strong> {statusTime ? statusTime : __("N/A","wpmudev-plugin-test")}
                </p>
            </div>

            {/* Summary */}
            <div className="wpmudev-pm-summary">
                <p><strong>{__("Total Scans:","wpmudev-plugin-test")}</strong> {totalScans}</p>
                <p><strong>{__("Last Scan:","wpmudev-plugin-test")}</strong> {lastScan ? lastScan.time : __("No Scans Yet.","wpmudev-plugin-test")}</p>
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
    console.error(__(" React root element not found:","wpmudev-plugin-test"), wpmudevPostsMaintenance.domId);
}
