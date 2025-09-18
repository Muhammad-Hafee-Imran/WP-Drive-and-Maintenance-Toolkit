import { useState } from "@wordpress/element";

export default function useScan() {
    const [isScanning, setIsScanning] = useState(false);
    const [message, setMessage] = useState("");
    const [scanType, setScanType] = useState("posts"); // 👈 default option

    const handleScanNow = async () => {
        try {

            const response = await fetch(
                `/wp-json/${wpmudevPostsMaintenance.restEndpointScanNow}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-WP-Nonce": wpmudevPostsMaintenance.nonce,
                    },
                    body: JSON.stringify({
                        type: scanType, // 👈 send selected option
                    }),
                }
            );

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || "Scan failed.");
            }
            if (data.message) {
                setMessage(data.message);
            }

        } catch (error) {
            console.error("Error running scan:", error);
            setMessage(error.message || "Unexpected error.");
        }
    };

    return {
        isScanning,
        message,
        scanType,     // 👈 expose selected type
        setScanType,  // 👈 expose setter for dropdown
        handleScanNow,
    };
}
