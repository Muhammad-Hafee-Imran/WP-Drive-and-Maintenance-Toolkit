import {
    createRoot,
    StrictMode,
    useRef,
    useState,
    useEffect
} from "@wordpress/element";

import { createInterpolateElement } from '@wordpress/element';

import NoticeMessage from "./components/NoticeMessage";
import CredentialsForm from "./components/CredentialsForm";
import AuthSection from "./components/AuthSection";
import UploadSection from "./components/UploadSection";
import CreateFolderSection from "./components/CreateFolderSection";
import FilesListSection from "./components/FilesListSection";

import useNotice from "./hooks/useNotice";
import useDriveFiles from "./hooks/useDriveFiles";
import useAuth from "./hooks/useAuth";
import useUploadFile from "./hooks/useUploadFile";
import useCreateFolder from "./hooks/useCreateFolder";
import useDownloadFile from "./hooks/useDownloadFile";

import { __ } from "@wordpress/i18n";
import "./scss/style.scss";

const domElement = document.getElementById(
    window.hafeeDriveTest.dom_element_id
);

const Hafee_DriveTest = () => {
    // Input refs and state for controlled fields
    const fileInputRef = useRef(null);

    // "Global" state (credentials, UI flags, etc)
    const [credentials, setCredentials] = useState({
        clientId: "",
        clientSecret: "",
    });
    const [showCredentials, setShowCredentials] = useState(
        !window.hafeeDriveTest.hasCredentials
    );
    const [hasCredentials, setHasCredentials] = useState(
        window.hafeeDriveTest.hasCredentials || false
    );
    const [isAuthenticated, setIsAuthenticated] = useState(
        window.hafeeDriveTest.authStatus || false
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
            showNotice(__("Credential fields must not be empty.", "hafee-utility-plugin"), "error");
            return;
        }
        try {
            const response = await fetch(`/wp-json/${hafeeDriveTest.restEndpointSave}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'X-WP-Nonce': hafeeDriveTest.nonce
                },
                body: JSON.stringify(credentials)
            });
            const data = await response.json();
            if (!response.ok) {
                showNotice(data.message || __("Failed to save credentials.", "hafee-utility-plugin"), "error");
            } else {
                showNotice(__('Credentials Saved.', 'hafee-utility-plugin'), "success");
                setShowCredentials(false);
                setHasCredentials(true);
            }
        } catch (error) {
            showNotice(__("Error Saving Credentials.", "hafee-utility-plugin") + error.message || "", "error");
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            loadFiles();
        }
    }, [isAuthenticated]);


    return (
        <>
            <div className="hafee-header">
                <h1 className="hafee-header-title">
                    {__("Google Drive Test ", "hafee-utility-plugin")}
                </h1>
                <p className="hafee-description">
                    {__(
                        "Manage your Google Drive files directly from WordPress with secure OAuth authentication",
                        "hafee-utility-plugin"
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
                    redirectUri={window.hafeeDriveTest.redirectUri}
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
                        handleUpload={async () => {
                            await handleUpload(fileInputRef, uploadFile);
                            setUploadFile(null); // 👈 reset after successful upload
                        }}
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
            <Hafee_DriveTest />
        </StrictMode>
    );
} else {
    render(
        <StrictMode>
            <Hafee_DriveTest />
        </StrictMode>,
        domElement
    );
}
