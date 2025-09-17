import { useState } from "@wordpress/element";

export default function useAuth(showNotice) {
    const [isLoading, setIsLoading] = useState(false);

    const handleAuth = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/wp-json/${wpmudevDriveTest.restEndpointAuth}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'X-WP-Nonce': window.wpmudevDriveTest.nonce
                },
            });
            const data = await response.json();
            if (!response.ok) {
                showNotice(data.message || "Authentication Failed.", "error");
            } else {
                window.location.href = data.authUrl;
            }
        } catch (error) {
            showNotice(error.message || "Authentication Failed.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return { handleAuth, isLoading };
}
