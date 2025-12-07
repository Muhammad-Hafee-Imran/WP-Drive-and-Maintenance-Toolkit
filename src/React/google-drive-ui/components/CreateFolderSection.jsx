import { Button, TextControl, Spinner } from "@wordpress/components";
import { __ } from "@wordpress/i18n";


const CreateFolderSection = ({
    folderName,
    setFolderName,
    handleCreateFolder,
    isLoading
}) => (
    <div className="hafee-box">
        <div className="hafee-box-header">
            <h2 className="hafee-box-title">
                {__("Create New Folder", "hafee-utility-plugin")}
            </h2>
        </div>
        <div className="hafee-box-body">
            <div className="hafee-box-settings-row">
                <TextControl
                    label={__("Folder Name", "hafee-utility-plugin")}
                    value={folderName}
                    onChange={setFolderName}
                    placeholder={__("Enter folder name", "hafee-utility-plugin")}
                />
            </div>
        </div>
        <div className="hafee-box-footer">
            <div className="hafee-actions-right">
                <Button
                    variant="secondary"
                    onClick={handleCreateFolder}
                    disabled={isLoading || !folderName.trim()}
                >
                    {isLoading ? (
                        <Spinner />
                    ) : (
                        __("Create Folder", "hafee-utility-plugin")
                    )}
                </Button>
            </div>
        </div>
    </div>
);

export default CreateFolderSection;
