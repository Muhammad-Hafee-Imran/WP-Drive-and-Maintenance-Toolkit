import { Button, Spinner } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { createInterpolateElement } from '@wordpress/element';
const FilesListSection = ({
    files,
    isLoading,
    nextPageToken,
    loadFiles,
    handleDownload
}) => (
    <div className="hafee-box">
        <div className="hafee-box-header">
            <h2 className="hafee-box-title">
                {__("Your Drive Files", "hafee-utility-plugin")}
            </h2>
            <div className="hafee-actions-right drive-file-buttons">
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
                    {isLoading ? <Spinner /> : __("Show More", "hafee-utility-plugin")}
                </Button>
                <Button
                    variant="secondary"
                    onClick={loadFiles}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Spinner />
                    ) : (
                        __("Refresh Files", "hafee-utility-plugin")
                    )}
                </Button>
            </div>
        </div>
        <div className="hafee-box-body">
            {isLoading ? (
                <div className="drive-loading">
                    <Spinner />
                    <p>{__("Loading files...", "hafee-utility-plugin")}</p>
                </div>
            ) : files.length > 0 ? (
                <div className="drive-files-grid">
                    {files.map((file) => (
                        <div key={file.id} className="drive-file-item">
                            <div className="file-info">
                                <strong>{file.name}</strong>
                                <small>
                                    {__("Type:", "hafee-utility-plugin")} {file.mimeType === "application/vnd.google-apps.folder"
                                        ? __("📁 Folder", "hafee-utility-plugin")
                                        : __("📄 File", "hafee-utility-plugin")}{" "}
                                </small>
                                <br />
                                {file.mimeType !== "application/vnd.google-apps.folder" && (
                                    <>
                                        <small>
                                           {__("Size:", "hafee-utility-plugin")} {Math.round((file.size || 0) / 1024)} KB
                                        </small>
                                        <br />
                                    </>
                                )}
                                <small>
                                    {file.modifiedTime
                                        ? new Date(file.modifiedTime).toLocaleDateString()
                                        : __("Unknown date", "hafee-utility-plugin")}
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
                                        {__("View in Drive", "hafee-utility-plugin")}
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
                                            __("Download", "hafee-utility-plugin")
                                        )}
                                    </Button>
                                }
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="hafee-box-settings-row">
                    <p>
                        {__(
                            "No files found in your Drive. Upload a file or create a folder to get started.",
                            "hafee-utility-plugin"
                        )}
                    </p>
                </div>
            )}
        </div>
    </div>
);

export default FilesListSection;
