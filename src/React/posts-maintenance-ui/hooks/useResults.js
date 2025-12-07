import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

export default function useResults(setScanStatus, setStatusTime) {
    const [history, setHistory] = useState([]);
    const [totalScans, setTotalScans] = useState(0);
    const [lastScan, setLastScan] = useState(null);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleResults = async () => {
        let data;
        try {
            setIsLoading(true);

            const response = await fetch(
                `/wp-json/${hafeePostsMaintenance.restEndpointGetData}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "X-WP-Nonce": hafeePostsMaintenance.nonce,
                    },
                }
            );

            data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || __("Failed to fetch results.","hafee-utility-plugin"));
            }

            // ✅ Always update status and status_time
            if (data.status) {
                setScanStatus(data.status);
            }
            if (data.status_time) {
                setStatusTime(data.status_time);
            } else {
                setStatusTime(null);
            }

            // If status is still pending or scanning, retry after 3s
            if (data.status === "Scanning") {
                setTimeout(handleResults, 3000);
                return; // stop here, don’t update table yet
            }

            // Only update table if status is idle
            if (data.status === "Idle" && data.last_scan && Array.isArray(data.last_scan.posts)) {
                const mapped = data.last_scan.posts.map((p) => ({
                    id: p.id,
                    title: p.title,
                    type: p.type || __("N/A", "hafee-utility-plugin"),
                    lastScan: data.last_scan.time,
                }));
                setHistory(mapped);
            } else if (data.status === "Idle") {
                setHistory([]);
            }

            if (data.total_scans) {
                setTotalScans(data.total_scans);
            }

            if (data.last_scan) {
                setLastScan(data.last_scan);
            }

            if (data.message) {
                setMessage(data.message);
            }

        } catch (error) {
            setMessage(error.message || __("Unexpected error.","hafee-utility-plugin"));
        } finally {
            setIsLoading(false);
        }
    };

    return {
        history,
        totalScans,
        lastScan,
        message,
        isLoading,
        handleResults,
    };
}
