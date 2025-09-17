import { Button, TextControl, Spinner } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

const CreateFolderSection = ({
    folderName,
    setFolderName,
    handleCreateFolder,
    isLoading
}) => (
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
);

export default CreateFolderSection;
