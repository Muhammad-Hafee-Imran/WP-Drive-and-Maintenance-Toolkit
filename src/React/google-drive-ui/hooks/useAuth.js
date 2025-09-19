import { useState } from "@wordpress/element";
import { createInterpolateElement } from '@wordpress/element';
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
                showNotice(data.message || __("Authentication Failed.","wpmudev-plugin-test"), "error");
            } else {
                window.location.href = data.authUrl;
            }
        } catch (error) {
            showNotice(error.message || __("Authentication Failed.","wpmudev-plugin-test"), "error");
        } finally {
            setIsLoading(false);
        }
    };

    return { handleAuth, isLoading };
}
