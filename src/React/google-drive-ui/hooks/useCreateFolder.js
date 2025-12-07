import { useState } from "@wordpress/element";
import { createInterpolateElement } from '@wordpress/element';
import { __ } from "@wordpress/i18n";

export default function useCreateFolder(showNotice, reloadFiles) {
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateFolder = async (folderName, setFolderName) => {
        if (!folderName.trim()) {
            showNotice(__("Folder name is required.", "hafee-utility-plugin"), "error");
            return;
        }
        try {
            setIsLoading(true);
            const response = await fetch(`/wp-json/${hafeeDriveTest.restEndpointCreate}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'X-WP-Nonce': window.hafeeDriveTest.nonce,
                },
                body: JSON.stringify({ folderName }),
            });
            const data = await response.json();
            if (!response.ok) {
                showNotice(data.message || __("Folder creation failed.","hafee-utility-plugin"), "error");
            } else {
                showNotice(__("Folder has been created.","hafee-utility-plugin"), "success");
                setFolderName("");
                reloadFiles();
            }
        } catch (error) {
            showNotice(error.message || __("Folder creation failed.","hafee-utility-plugin"), "error");
        } finally {
            setIsLoading(false);
        }
    };

    return { handleCreateFolder, isLoading };
}
