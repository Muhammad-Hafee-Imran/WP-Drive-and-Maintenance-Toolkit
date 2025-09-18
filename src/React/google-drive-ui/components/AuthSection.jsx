import { Button, Spinner } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

const AuthSection = ({
    isLoading,
    handleAuth,
    setShowCredentials
}) => (
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
);

export default AuthSection;
