import { useState } from "@wordpress/element";

export default function useCreateFolder(showNotice, reloadFiles) {
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateFolder = async (folderName, setFolderName) => {
        if (!folderName.trim()) {
            showNotice("Folder name is required.", "error");
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
                showNotice(data.message || "Folder creation failed.", "error");
            } else {
                showNotice("Folder has been created.", "success");
                setFolderName("");
                reloadFiles();
            }
        } catch (error) {
            showNotice(error.message || "Folder creation failed.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return { handleCreateFolder, isLoading };
}
