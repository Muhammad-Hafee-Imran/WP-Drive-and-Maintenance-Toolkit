import { Button, Spinner } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { createInterpolateElement } from '@wordpress/element';

const AuthSection = ({
    isLoading,
    handleAuth,
    setShowCredentials
}) => (
    <div className="hafee-box">
        <div className="hafee-box-header">
            <h2 className="hafee-box-title">
                {__("Authenticate with Google Drive", "hafee-utility-plugin")}
            </h2>
        </div>
        <div className="hafee-box-body">
            <div className="hafee-box-settings-row">
                <p>
                    {__(
                        "Please authenticate with Google Drive to proceed with the test.",
                        "hafee-utility-plugin"
                    )}
                </p>
                <p>
                    <strong>
                        {__(
                            "This test will require the following permissions:",
                            "hafee-utility-plugin"
                        )}
                    </strong>
                </p>
                <ul>
                    <li>
                        {__(
                            "View and manage Google Drive files",
                            "hafee-utility-plugin"
                        )}
                    </li>
                    <li>
                        {__("Upload new files to Drive", "hafee-utility-plugin")}
                    </li>
                    <li>{__("Create folders in Drive", "hafee-utility-plugin")}</li>
                </ul>
            </div>
        </div>
        <div className="hafee-box-footer">
            <div className="hafee-actions-left">
                <Button
                    variant="secondary"
                    onClick={() => setShowCredentials(true)}
                >
                    {__("Change Credentials", "hafee-utility-plugin")}
                </Button>
            </div>
            <div className="hafee-actions-right">
                <Button
                    variant="primary"
                    onClick={handleAuth}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Spinner />
                    ) : (
                        __("Authenticate with Google Drive", "hafee-utility-plugin")
                    )}
                </Button>
            </div>
        </div>
    </div>
);

export default AuthSection;
