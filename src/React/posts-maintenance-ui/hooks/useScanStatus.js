import { useState } from "@wordpress/element";

export default function useScanStatus() {
    // By default status = idle
    const [scanStatus, setScanStatus] = useState("Idle");
    const [statusTime, setStatusTime] = useState(null);

    return {
        scanStatus,
        setScanStatus,
        statusTime,
        setStatusTime,
    };
}
