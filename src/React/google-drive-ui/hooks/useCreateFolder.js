import { useState } from "@wordpress/element";
import { createInterpolateElement } from '@wordpress/element';
export default function useCreateFolder(showNotice, reloadFiles) {
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateFolder = async (folderName, setFolderName) => {
        if (!folderName.trim()) {
            showNotice(__("Folder name is required.", "wpmudev-plugin-test"), "error");
            return;
        }
        try {
            setIsLoading(true);
            const response = await fetch(`/wp-json/${wpmudevDriveTest.restEndpointCreate}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'X-WP-Nonce': window.wpmudevDriveTest.nonce,
                },
                body: JSON.stringify({ folderName }),
            });
            const data = await response.json();
            if (!response.ok) {
                showNotice(data.message || __("Folder creation failed.","wpmudev-plugin-test"), "error");
            } else {
                showNotice(__("Folder has been created.","wpmudev-plugin-test"), "success");
                setFolderName("");
                reloadFiles();
            }
        } catch (error) {
            showNotice(error.message || __("Folder creation failed.","wpmudev-plugin-test"), "error");
        } finally {
            setIsLoading(false);
        }
    };

    return { handleCreateFolder, isLoading };
}
