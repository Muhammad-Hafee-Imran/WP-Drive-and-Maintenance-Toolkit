import { useState, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
export default function useScheduleToggle() {
    const [enabled, setEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // ✅ Load saved state on mount
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await fetch(
                    `/wp-json/${wpmudevPostsMaintenance.restEndpointScheduleStatus}`,
                    {
                        headers: {
                            "X-WP-Nonce": wpmudevPostsMaintenance.nonce,
                        },
                    }
                );
                if (!response.ok) {
                    throw new Error(__("Failed to fetch schedule status.","wpmudev-plugin-test"));
                }
                const data = await response.json();

                if (typeof data.enabled !== "undefined") {
                    setEnabled(data.enabled);
                }
                if (data.message) {
                    setMessage(data.message);
                }
            } catch (e) {

                setMessage(e.message || __("Unexpected error.","wpmudev-plugin-test"));
            }
        };

        fetchStatus();
    }, []);

    // ✅ Toggle state
    const toggleSchedule = async (newValue, scanType) => {
        try {
            setLoading(true);

            const response = await fetch(
                `/wp-json/${wpmudevPostsMaintenance.restEndpointScheduleScan}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-WP-Nonce": wpmudevPostsMaintenance.nonce,
                    },
                    body: JSON.stringify({
                        enabled: newValue,
                        type: scanType,
                    }),
                }
            );

            const data = await response.json();

            if (typeof data.enabled !== "undefined") {
                setEnabled(data.enabled);
            }
            if (data.message) {
                setMessage(data.message);
            }
        } catch (e) {

            setMessage(e.message || __("Failed to update schedule.","wpmudev-plugin-test"));
        } finally {
            setLoading(false);
        }
    };

    return { enabled, loading, message, toggleSchedule };
}
