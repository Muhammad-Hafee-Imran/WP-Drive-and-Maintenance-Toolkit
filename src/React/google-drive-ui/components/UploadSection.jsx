import { Button, Spinner } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

const UploadSection = ({
    uploadFile,
    setUploadFile,
    fileInputRef,
    handleUpload,
    isLoading
}) => (
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
                    onChange={e => setUploadFile(e.target.files[0])}
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
);

export default UploadSection;
