import {
    createRoot,
    StrictMode,
    useRef,
    useState,
    useEffect
} from "@wordpress/element";

import NoticeMessage from "./google-drive-ui/components/NoticeMessage";
import CredentialsForm from "./google-drive-ui/components/CredentialsForm";
import AuthSection from "./google-drive-ui/components/AuthSection";
import UploadSection from "./google-drive-ui/components/UploadSection";
import CreateFolderSection from "./google-drive-ui/components/CreateFolderSection";
import FilesListSection from "./google-drive-ui/components/FilesListSection";

import useNotice from "./google-drive-ui/hooks/useNotice";
import useDriveFiles from "./google-drive-ui/hooks/useDriveFiles";
import useAuth from "./google-drive-ui/hooks/useAuth";
import useUploadFile from "./google-drive-ui/hooks/useUploadFile";
import useCreateFolder from "./google-drive-ui/hooks/useCreateFolder";
import useDownloadFile from "./google-drive-ui/hooks/useDownloadFile";

import { __ } from "@wordpress/i18n";
import "./google-drive-ui/scss/style.scss";

const domElement = document.getElementById(
    window.wpmudevDriveTest.dom_element_id
);

const WPMUDEV_DriveTest = () => {
    // Input refs and state for controlled fields
    const fileInputRef = useRef(null);

    // "Global" state (credentials, UI flags, etc)
    const [credentials, setCredentials] = useState({
        clientId: "",
        clientSecret: "",
    });
    const [showCredentials, setShowCredentials] = useState(
        !window.wpmudevDriveTest.hasCredentials
    );
    const [hasCredentials, setHasCredentials] = useState(
        window.wpmudevDriveTest.hasCredentials || false
    );
    const [isAuthenticated, setIsAuthenticated] = useState(
        window.wpmudevDriveTest.authStatus || false
    );
    const [uploadFile, setUploadFile] = useState(null);
    const [folderName, setFolderName] = useState("");

    // Notices
    const [notice, showNotice] = useNotice();

    // Google Drive files (load, paginate)
    const {
        files,
        nextPageToken,
        isLoading: filesLoading,
        loadFiles
    } = useDriveFiles(showNotice);

    // Google Auth
    const { handleAuth, isLoading: authLoading } = useAuth(showNotice);

    // File upload
    const { handleUpload, isLoading: uploadLoading } = useUploadFile(showNotice, loadFiles);

    // Folder creation
    const { handleCreateFolder, isLoading: folderLoading } = useCreateFolder(showNotice, loadFiles);

    // Download file
    const { handleDownload, isLoading: downloadLoading } = useDownloadFile(showNotice);

    // Merge all loading states for global spinner/disable logic
    const isLoading = filesLoading || authLoading || uploadLoading || folderLoading || downloadLoading;

    // Handle save credentials
    const handleSaveCredentials = async () => {
        if (!credentials.clientId.trim() || !credentials.clientSecret.trim()) {
            showNotice(__("Credential fields must not be empty.", "wpmudev-plugin-test"), "error");
            return;
        }
        try {
            const response = await fetch(`/wp-json/${wpmudevDriveTest.restEndpointSave}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'X-WP-Nonce': wpmudevDriveTest.nonce
                },
                body: JSON.stringify(credentials)
            });
            const data = await response.json();
            if (!response.ok) {
                showNotice(data.message || __("Failed to save credentials.", "wpmudev-plugin-test"), "error");
            } else {
                showNotice(__('Credentials Saved.', 'wpmudev-plugin-test'), "success");
                setShowCredentials(false);
                setHasCredentials(true);
            }
        } catch (error) {
            showNotice(__("Error Saving Credentials.", "wpmudev-plugin-test") + error.message || "", "error");
        }
    };

    useEffect(() => {
    if (isAuthenticated) {
        loadFiles();
    }
}, [isAuthenticated]);


    return (
        <>
            <div className="sui-header">
                <h1 className="sui-header-title">
                    {__("Google Drive Test ", "wpmudev-plugin-test")}
                </h1>
                <p className="sui-description">
                    {__(
                        "Test Google Drive API integration for applicant assessment",
                        "wpmudev-plugin-test"
                    )}
                </p>
            </div>

            <NoticeMessage notice={notice} />

            {showCredentials ? (
                <CredentialsForm
                    credentials={credentials}
                    setCredentials={setCredentials}
                    handleSaveCredentials={handleSaveCredentials}
                    isLoading={isLoading}
                    redirectUri={window.wpmudevDriveTest.redirectUri}
                />
            ) : !isAuthenticated ? (
                <AuthSection
                    isLoading={isLoading}
                    handleAuth={handleAuth}
                    setShowCredentials={setShowCredentials}
                />
            ) : (
                <>
                    <UploadSection
                        uploadFile={uploadFile}
                        setUploadFile={setUploadFile}
                        fileInputRef={fileInputRef}
                        handleUpload={() => handleUpload(fileInputRef, uploadFile)}
                        isLoading={isLoading}
                    />
                    <CreateFolderSection
                        folderName={folderName}
                        setFolderName={setFolderName}
                        handleCreateFolder={() => handleCreateFolder(folderName, setFolderName)}
                        isLoading={isLoading}
                    />
                    <FilesListSection
                        files={files}
                        isLoading={isLoading}
                        nextPageToken={nextPageToken}
                        loadFiles={loadFiles}
                        handleDownload={handleDownload}
                    />
                </>
            )}
        </>
    );
};

if (createRoot) {
    createRoot(domElement).render(
        <StrictMode>
            <WPMUDEV_DriveTest />
        </StrictMode>
    );
} else {
    render(
        <StrictMode>
            <WPMUDEV_DriveTest />
        </StrictMode>,
        domElement
    );
}
