import { useState } from "@wordpress/element";
export default function useUploadFile(showNotice, reloadFiles) {
    const [isLoading, setIsLoading] = useState(false);

    const handleUpload = async (fileInputRef, uploadFile) => {
        if (!uploadFile) {
            showNotice(__("No file selected.","wpmudev-plugin-test"), "error");
            return;
        }
        const formData = new FormData();
        formData.append('file', uploadFile);
        try {
            setIsLoading(true);
            const response = await fetch(`/wp-json/${wpmudevDriveTest.restEndpointUpload}`, {
                method: 'POST',
                headers: { 'X-WP-Nonce': window.wpmudevDriveTest.nonce },
                body: formData
            });
            const data = await response.json();
            if (!response.ok) {
                showNotice(data.message || __("Uploading failed.","wpmudev-plugin-test"), "error");
            } else {
                showNotice(__("Your file is uploaded.","wpmudev-plugin-test"), "success");
                if (fileInputRef && fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                reloadFiles();
            }
        } catch (error) {
            showNotice(error.message || __("Uploading failed.","wpmudev-plugin-test"), "error");
        } finally {
            setIsLoading(false);
        }
    };

    return { handleUpload, isLoading };
}
