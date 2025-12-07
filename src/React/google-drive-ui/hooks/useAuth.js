import { useState } from "@wordpress/element";
import { createInterpolateElement } from '@wordpress/element';
import { __ } from "@wordpress/i18n";

export default function useAuth(showNotice) {
    const [isLoading, setIsLoading] = useState(false);

    const handleAuth = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/wp-json/${hafeeDriveTest.restEndpointAuth}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'X-WP-Nonce': window.hafeeDriveTest.nonce
                },
            });
            const data = await response.json();
            if (!response.ok) {
                showNotice(data.message || __("Authentication Failed.","hafee-utility-plugin"), "error");
            } else {
                window.location.href = data.authUrl;
            }
        } catch (error) {
            showNotice(error.message || __("Authentication Failed.","hafee-utility-plugin"), "error");
        } finally {
            setIsLoading(false);
        }
    };

    return { handleAuth, isLoading };
}
