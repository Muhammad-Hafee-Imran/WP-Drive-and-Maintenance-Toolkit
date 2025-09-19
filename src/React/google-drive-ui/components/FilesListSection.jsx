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
                                <small>
                                    {__("Type:", "wpmudev-plugin-test")} {file.mimeType === "application/vnd.google-apps.folder"
                                        ? __("📁 Folder", "wpmudev-plugin-test")
                                        : __("📄 File", "wpmudev-plugin-test")}{" "}
                                </small>
                                <br />
                                {file.mimeType !== "application/vnd.google-apps.folder" && (
                                    <>
                                        <small>
                                           {__("Size:", "wpmudev-plugin-test")} {Math.round((file.size || 0) / 1024)} KB
                                        </small>
                                        <br />
                                    </>
                                )}
                                <small>
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
                                    </Button>
                                }
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
);

export default FilesListSection;
