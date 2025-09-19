import { useState } from "@wordpress/element";
import { createInterpolateElement } from '@wordpress/element';
export default function useDownloadFile(showNotice) {
    const [isLoading, setIsLoading] = useState(false);

    const handleDownload = async (fileId, fileName) => {
        try {
            setIsLoading(true);
            const url = `/wp-json/${wpmudevDriveTest.restEndpointDownload}?fileId=${encodeURIComponent(fileId)}&fileName=${encodeURIComponent(fileName)}`;
            const response = await fetch(url, {
                method: "GET",
                headers: { 'X-WP-Nonce': window.wpmudevDriveTest.nonce },
            });
            if (!response.ok) {
                let errorMsg = __("File downloading failed.", "wpmudev-plugin-test");
                try {
                    const data = await response.json();
                    if (data && data.message) errorMsg = data.message;
                } catch (e) {}
                showNotice(errorMsg, "error");
                return;
            }
            const blob = await response.blob();
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName || "downloaded";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showNotice(__("File has been downloaded.", "wpmudev-plugin-test"), "success");
        } catch (error) {
            showNotice(error.message || __("Unable to download file.", "wpmudev-plugin-test"), "error");
        } finally {
            setIsLoading(false);
        }
    };

    return { handleDownload, isLoading };
}
