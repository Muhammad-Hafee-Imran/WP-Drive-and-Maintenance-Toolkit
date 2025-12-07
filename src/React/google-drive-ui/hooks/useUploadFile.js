import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

export default function useUploadFile(showNotice, reloadFiles) {
    const [isLoading, setIsLoading] = useState(false);

    const handleUpload = async (fileInputRef, uploadFile) => {
        if (!uploadFile) {
            showNotice(__("No file selected.","hafee-utility-plugin"), "error");
            return;
        }
        const formData = new FormData();
        formData.append('file', uploadFile);
        try {
            setIsLoading(true);
            const response = await fetch(`/wp-json/${hafeeDriveTest.restEndpointUpload}`, {
                method: 'POST',
                headers: { 'X-WP-Nonce': window.hafeeDriveTest.nonce },
                body: formData
            });
            const data = await response.json();
            if (!response.ok) {
                showNotice(data.message || __("Uploading failed.","hafee-utility-plugin"), "error");
            } else {
                showNotice(__("Your file is uploaded.","hafee-utility-plugin"), "success");
                if (fileInputRef && fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                reloadFiles();
            }
        } catch (error) {
            console.log(error);
            showNotice(error.message || __("Uploading failed.","hafee-utility-plugin"), "error");
        } finally {
            setIsLoading(false);
        }
    };

    return { handleUpload, isLoading };
}
