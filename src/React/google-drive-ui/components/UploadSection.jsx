import { Button, Spinner } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { createInterpolateElement } from '@wordpress/element';
const UploadSection = ({
    uploadFile,
    setUploadFile,
    fileInputRef,
    handleUpload,
    isLoading
}) => (
    <div className="hafee-box">
        <div className="hafee-box-header">
            <h2 className="hafee-box-title">
                {__("Upload File to Drive", "hafee-utility-plugin")}
            </h2>
        </div>
        <div className="hafee-box-body">
            <div className="hafee-box-settings-row">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={e => setUploadFile(e.target.files[0])}
                    className="drive-file-input"
                    aria-label={__("Upload file", "hafee-utility-plugin")}
                />
                {uploadFile && (
                    <p>
                        <strong>{__("Selected:", "hafee-utility-plugin")}</strong>{" "}
                        {uploadFile.name} ({Math.round(uploadFile.size / 1024)} KB)
                    </p>
                )}
            </div>
        </div>
        <div className="hafee-box-footer">
            <div className="hafee-actions-right">
                <Button
                    variant="primary"
                    onClick={handleUpload}
                    disabled={isLoading || !uploadFile}
                >
                    {isLoading ? (
                        <Spinner />
                    ) : (
                        __("Upload to Drive", "hafee-utility-plugin")
                    )}
                </Button>
            </div>
        </div>
    </div>
);

export default UploadSection;
