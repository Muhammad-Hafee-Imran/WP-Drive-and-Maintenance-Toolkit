import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
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
                        type: scanType, 
                    }),
                }
            );

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || __("Scan failed.","wpmudev-plugin-test"));
            }
            if (data.message) {
                setMessage(data.message);
            }

        } catch (error) {
            console.error("Error running scan:", error);
            setMessage(error.message || __("Unexpected Error.","womudev-plugin-test"));
        }
    };

    return {
        isScanning,
        message,
        scanType,     
        setScanType,  
        handleScanNow,
    };
}
