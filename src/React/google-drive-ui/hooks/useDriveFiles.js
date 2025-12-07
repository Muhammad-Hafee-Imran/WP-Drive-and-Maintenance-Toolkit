import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

export default function useDriveFiles(showNotice) {
    const [files, setFiles] = useState([]);
    const [nextPageToken, setNextPageToken] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const loadFiles = async ({ pageSize = 20, q = "trashed=false", pageToken = "", append = false } = {}) => {
        try {
            setIsLoading(true);
            let url = `/wp-json/${hafeeDriveTest.restEndpointFiles}?pageSize=${pageSize}&q=${encodeURIComponent(q)}`;
            if (pageToken) url += `&pageToken=${encodeURIComponent(pageToken)}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'X-WP-Nonce': hafeeDriveTest.nonce },
            });
            const data = await response.json();
            if (!response.ok) {
                showNotice(data.message || __("Could not fetch files.","hafee-utility-plugin"), "error");
            } else {
                if (append) {
                    setFiles(prevFiles => [...prevFiles, ...(data.files || [])]);
                } else {
                    setFiles(data.files || []);
                }
                setNextPageToken(data.nextPageToken || null);
            }
        } catch (error) {
            showNotice(error.message || __("Failed to retrieve files.","hafee-utility-plugin"), "error");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        files,
        nextPageToken,
        isLoading,
        loadFiles
    };
}
