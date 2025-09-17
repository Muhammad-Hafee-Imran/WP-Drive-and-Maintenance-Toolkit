import {
    createRoot,
    render,
    StrictMode,
    useState,
    useEffect,
    createInterpolateElement,
    useRef
} from "@wordpress/element";
import { Button, TextControl, Spinner, Notice } from "@wordpress/components";
import { __, sprintf } from "@wordpress/i18n";
import "./googledrive-page/scss/style.scss";

const domElement = document.getElementById(
    window.wpmudevDriveTest.dom_element_id
);

const WPMUDEV_DriveTest = () => {

    const fileInputRef = useRef(null);

    const [isAuthenticated, setIsAuthenticated] = useState(
        window.wpmudevDriveTest.authStatus || false
    );
    const [hasCredentials, setHasCredentials] = useState(
        window.wpmudevDriveTest.hasCredentials || false
    );
    const [showCredentials, setShowCredentials] = useState(
        !window.wpmudevDriveTest.hasCredentials
    );
    const [isLoading, setIsLoading] = useState(false);
    const [nextPageToken, setNextPageToken] = useState(null);
    const [files, setFiles] = useState([]);
    const [uploadFile, setUploadFile] = useState(null);
    const [folderName, setFolderName] = useState("");
    const [notice, setNotice] = useState({ message: "", type: "" });

    const [credentials, setCredentials] = useState({
        clientId: "",
        clientSecret: "",
    });

    useEffect(() => {

        if (isAuthenticated) {
            loadFiles();

        }
    }, [isAuthenticated]);

    const showNotice = (message, type = "success") => {
        setNotice({ message, type });
        setTimeout(() => setNotice({ message: "", type: "" }), 5000);
    };

    const handleSaveCredentials = async () => {

        if (!credentials.clientId.trim() || !credentials.clientSecret.trim()) {
            showNotice(__("Credential fields must not be empty.", "wpmudev-plugin-test"), "error");

            return;
        }

        setIsLoading(true);

        try {

            const response = await fetch(`/wp-json/${wpmudevDriveTest.restEndpointSave}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'X-WP-Nonce': wpmudevDriveTest.nonce
                },
                body: JSON.stringify(credentials)
            })

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
        finally {
            setIsLoading(false);
        }
    };

    const handleAuth = async () => {

        try {

            setIsLoading(true);
            const response = await fetch(`/wp-json/${wpmudevDriveTest.restEndpointAuth}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'X-WP-Nonce': wpmudevDriveTest.nonce
                },
            })


            const data = await response.json();

            if (!response.ok) {
                showNotice(data.message || __("Authentication Failed.", "wpmudev-plugin-test"), "error");
            } else {
                window.location.href = data.authUrl;

                console.log("else completed ");

            }


        } catch (error) {
            showNotice(error.message || __("Authentication Failed.", "wpmudev-plugin-test"), "error");

        }
        finally {
            setIsLoading(false);
        }

    };

    const loadFiles = async ({ pageSize = 20, q = "trashed=false", pageToken = "", append = false } = {}) => {
        try {
            setIsLoading(true);
            let url = `/wp-json/${wpmudevDriveTest.restEndpointFiles}?pageSize=${pageSize}&q=${encodeURIComponent(q)}`;
            if (pageToken) url += `&pageToken=${encodeURIComponent(pageToken)}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-WP-Nonce': wpmudevDriveTest.nonce
                },
            });

            const data = await response.json();

            if (!response.ok) {
                showNotice(data.message || __("Could not fetch files.", "wpmudev-plugin-test"), "error");
            } else {
                console.log("Returned files from backend:", data.files);

                if (append) {
                    showNotice(__("More files fetched from the Google Drive", "wpmudev-plugin-test"), "error");
                    setFiles(prevFiles => [...prevFiles, ...(data.files || [])]);

                } else {

                    showNotice(__("Files fetched from the Google Drive", "wpmudev-plugin-test"), "error");
                    setFiles(data.files || []);
                }
                setNextPageToken(data.nextPageToken || null);
            }
        } catch (error) {
            showNotice(error.message || __("Failed to retrieve files.", "wpmudev-plugin-test"), "error");
        } finally {
            setIsLoading(false);
        }
    };


    const handleUpload = async () => {

        const formData = new FormData();
        formData.append('file', uploadFile);
        try {
            setIsLoading(true);

            const response = await fetch(`/wp-json/${wpmudevDriveTest.restEndpointUpload}`, {
                method: 'POST',
                headers: {
                    'X-WP-Nonce': wpmudevDriveTest.nonce,
                },
                body: formData
            })

            const data = await response.json();
            if (!response.ok) {
                showNotice(data.message || __("Uploading Failed", "wpmudev-plugin-test"), "error");
            } else {
                showNotice(__("Your file is Uploaded.", "wpmudev-plugin-test"), "success");
                setUploadFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                loadFiles();
            }
        } catch (error) {
            showNotice(error.message || __("Uploading Failed", "wpmudev-plugin-test"), "error");
        }
        finally {
            setIsLoading(false);
        }
    };


    const handleDownload = async (fileId, fileName) => {
        try {
            setIsLoading(true);

            const url = `/wp-json/${wpmudevDriveTest.restEndpointDownload}?fileId=${encodeURIComponent(fileId)}&fileName=${encodeURIComponent(fileName)}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    'X-WP-Nonce': wpmudevDriveTest.nonce,
                },
            });

            if (!response.ok) {
                let errorMsg = __("File downloading failed.", "wpmudev-plugin-test");
                try {
                    const data = await response.json();
                    if (data && data.message) errorMsg = data.message;
                } catch (e) {
                    // If not JSON stick with the default error message.
                }
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


    const handleCreateFolder = async () => {

        try {
            setIsLoading(true);
            const response = await fetch(`/wp-json/${wpmudevDriveTest.restEndpointCreate}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'X-WP-Nonce': wpmudevDriveTest.nonce,
                },
                body: JSON.stringify({ folderName }),
            })

            const data = await response.json();

            if (!response.ok) {
                showNotice(data.message || __("Folder creation failed.", "wpmudev-plugin-test"), "error");
            } else {
                showNotice(__("Folder has been created.", "wpmudev-plugin-test"), "success");
                setFolderName("");
                loadFiles();
            }

        } catch (error) {
            showNotice(error.message || __("Folder creation failed.", "wpmudev-plugin-test"), "error");
        }
        finally {
            setIsLoading(false);
        }

    };

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

            {notice.message && (
                <Notice status={notice.type} isDismissible onRemove="">
                    {__(notice.message, "wpmudev-plugin-test")}
                </Notice>
            )}

            {showCredentials ? (
                <div className="sui-box">
                    <div className="sui-box-header">
                        <h2 className="sui-box-title">
                            {__("Set Google Drive Credentials", "wpmudev-plugin-test")}
                        </h2>
                    </div>
                    <div className="sui-box-body">
                        <div className="sui-box-settings-row">
                            <TextControl
                                help={createInterpolateElement(
                                    __(
                                        "You can get Client ID from <a>Google Cloud Console</a>. Make sure to enable Google Drive API.",
                                        "wpmudev-plugin-test"
                                    ),
                                    {
                                        a: (
                                            <a
                                                href="https://console.cloud.google.com/apis/credentials"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            />
                                        ),
                                    }
                                )}
                                label={__("Client ID", "wpmudev-plugin-test")}
                                value={credentials.clientId}
                                onChange={(value) =>
                                    setCredentials({ ...credentials, clientId: value })
                                }
                            />
                        </div>

                        <div className="sui-box-settings-row">
                            <TextControl
                                help={createInterpolateElement(
                                    __(
                                        "You can get Client Secret from <a>Google Cloud Console</a>.",
                                        "wpmudev-plugin-test"
                                    ),
                                    {
                                        a: (
                                            <a
                                                href="https://console.cloud.google.com/apis/credentials"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            />
                                        ),
                                    }
                                )}
                                label={__("Client Secret", "wpmudev-plugin-test")}
                                value={credentials.clientSecret}
                                onChange={(value) =>
                                    setCredentials({ ...credentials, clientSecret: value })
                                }
                                type="password"
                            />
                        </div>

                        <div className="sui-box-settings-row">
                            <span>
                                {createInterpolateElement(
                                    __(
                                        "Please use this URL <em></em> in your Google API's <strong>Authorized redirect URIs</strong> field.",
                                        "wpmudev-plugin-test"
                                    ),
                                    {
                                        em: <em>{window.wpmudevDriveTest.redirectUri}</em>,
                                        strong: <strong />,
                                    }
                                )}
                            </span>
                        </div>

                        <div className="sui-box-settings-row">
                            <p>
                                <strong>
                                    {__(
                                        "Required scopes for Google Drive API:",
                                        "wpmudev-plugin-test"
                                    )}
                                </strong>{" "}
                                https://www.googleapis.com/auth/drive.file{" | "}
                                https://www.googleapis.com/auth/drive.readonly
                            </p>
                        </div>
                    </div>
                    <div className="sui-box-footer">
                        <div className="sui-actions-right">
                            <Button
                                variant="primary"
                                onClick={handleSaveCredentials}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Spinner />
                                ) : (
                                    __("Save Credentials", "wpmudev-plugin-test")
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : !isAuthenticated ? (
                <div className="sui-box">
                    <div className="sui-box-header">
                        <h2 className="sui-box-title">
                            {__("Authenticate with Google Drive", "wpmudev-plugin-test")}
                        </h2>
                    </div>
                    <div className="sui-box-body">
                        <div className="sui-box-settings-row">
                            <p>
                                {__(
                                    "Please authenticate with Google Drive to proceed with the test.",
                                    "wpmudev-plugin-test"
                                )}
                            </p>
                            <p>
                                <strong>
                                    {__(
                                        "This test will require the following permissions:",
                                        "wpmudev-plugin-test"
                                    )}
                                </strong>
                            </p>
                            <ul>
                                <li>
                                    {__(
                                        "View and manage Google Drive files",
                                        "wpmudev-plugin-test"
                                    )}
                                </li>
                                <li>
                                    {__("Upload new files to Drive", "wpmudev-plugin-test")}
                                </li>
                                <li>{__("Create folders in Drive", "wpmudev-plugin-test")}</li>
                            </ul>
                        </div>
                    </div>
                    <div className="sui-box-footer">
                        <div className="sui-actions-left">
                            <Button
                                variant="secondary"
                                onClick={() => setShowCredentials(true)}
                            >
                                {__("Change Credentials", "wpmudev-plugin-test")}
                            </Button>
                        </div>
                        <div className="sui-actions-right">
                            <Button
                                variant="primary"
                                onClick={handleAuth}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Spinner />
                                ) : (
                                    __("Authenticate with Google Drive", "wpmudev-plugin-test")
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <>



                    {/* File Upload Section */}
                    <div className="sui-box">
                        <div className="sui-box-header">
                            <h2 className="sui-box-title">
                                {__("Upload File to Drive", "wpmudev-plugin-test")}
                            </h2>
                        </div>
                        <div className="sui-box-body">
                            <div className="sui-box-settings-row">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={(e) => setUploadFile(e.target.files[0])}
                                    className="drive-file-input"
                                    aria-label={__("Upload file", "wpmudev-plugin-test")}
                                />
                                {uploadFile && (
                                    <p>
                                        <strong>{__("Selected:", "wpmudev-plugin-test")}</strong>{" "}
                                        {uploadFile.name} ({Math.round(uploadFile.size / 1024)} KB)
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="sui-box-footer">
                            <div className="sui-actions-right">
                                <Button
                                    variant="primary"
                                    onClick={handleUpload}
                                    disabled={isLoading || !uploadFile}
                                >
                                    {isLoading ? (
                                        <Spinner />
                                    ) : (
                                        __("Upload to Drive", "wpmudev-plugin-test")
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Create Folder Section */}
                    <div className="sui-box">
                        <div className="sui-box-header">
                            <h2 className="sui-box-title">
                                {__("Create New Folder", "wpmudev-plugin-test")}
                            </h2>
                        </div>
                        <div className="sui-box-body">
                            <div className="sui-box-settings-row">
                                <TextControl
                                    label={__("Folder Name", "wpmudev-plugin-test")}
                                    value={folderName}
                                    onChange={setFolderName}
                                    placeholder={__("Enter folder name", "wpmudev-plugin-test")}
                                />
                            </div>
                        </div>
                        <div className="sui-box-footer">
                            <div className="sui-actions-right">
                                <Button
                                    variant="secondary"
                                    onClick={handleCreateFolder}
                                    disabled={isLoading || !folderName.trim()}
                                >
                                    {isLoading ? (
                                        <Spinner />
                                    ) : (
                                        __("Create Folder", "wpmudev-plugin-test")
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Files List Section */}
                    <div className="sui-box">
                        <div className="sui-box-header">
                            <h2 className="sui-box-title">
                                {__("Your Drive Files", "wpmudev-plugin-test")}
                            </h2>
                            <div className="sui-actions-right drive-file-buttons">
                                <Button
                                    variant="secondary"
                                    onClick={() =>
                                        loadFiles({
                                            pageToken: nextPageToken,
                                            append: true
                                        })
                                    }
                                    disabled={isLoading || !nextPageToken}
                                >
                                    {isLoading ? <Spinner /> : __("Show More", "wpmudev-plugin-test")}
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={loadFiles}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Spinner />
                                    ) : (
                                        __("Refresh Files", "wpmudev-plugin-test")
                                    )}
                                </Button>
                            </div>
                        </div>
                        <div className="sui-box-body">
                            {isLoading ? (
                                <div className="drive-loading">
                                    <Spinner />
                                    <p>{__("Loading files...", "wpmudev-plugin-test")}</p>
                                </div>
                            ) : files.length > 0 ? (
                                <div className="drive-files-grid">
                                    {files.map((file) => (
                                        <div key={file.id} className="drive-file-item">
                                            <div className="file-info">
                                                <strong>{file.name}</strong>
                                                <small>Type: {file.mimeType === "application/vnd.google-apps.folder" ? "📁 Folder" : "📄 File"} </small><br></br>
                                                {file.mimeType !== "application/vnd.google-apps.folder" && (
                                                    <>
                                                        <small>Size: {Math.round(file.size / 1024)} KB</small>
                                                        <br />
                                                    </>
                                                )}                                                <small>
                                                    {file.modifiedTime
                                                        ? new Date(file.modifiedTime).toLocaleDateString()
                                                        : __("Unknown date", "wpmudev-plugin-test")}
                                                </small>
                                            </div>
                                            <div className="file-actions">
                                                {file.webViewLink && (
                                                    <Button
                                                        variant="link"
                                                        size="small"
                                                        href={file.webViewLink}
                                                        target="_blank"
                                                    >
                                                        {__("View in Drive", "wpmudev-plugin-test")}
                                                    </Button>
                                                )}
                                                {file.mimeType !== "application/vnd.google-apps.folder" &&
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() => handleDownload(file.id, file.name)}
                                                        disabled={isLoading}
                                                    >
                                                        {isLoading ? (
                                                            <Spinner />
                                                        ) : (
                                                            __("Download", "wpmudev-plugin-test")
                                                        )}


                                                    </Button>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="sui-box-settings-row">
                                    <p>
                                        {__(
                                            "No files found in your Drive. Upload a file or create a folder to get started.",
                                            "wpmudev-plugin-test"
                                        )}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
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
