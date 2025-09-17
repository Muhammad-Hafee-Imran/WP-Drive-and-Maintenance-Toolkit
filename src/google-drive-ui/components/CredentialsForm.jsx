import { Button, TextControl, Spinner } from "@wordpress/components";
import { __, createInterpolateElement } from "@wordpress/i18n";

// Credentials form for entering Client ID/Secret
const CredentialsForm = ({
    credentials,
    setCredentials,
    handleSaveCredentials,
    isLoading,
    redirectUri
}) => (
    <div className="sui-box">
        <div className="sui-box-header">
            <h2 className="sui-box-title">{__("Set Google Drive Credentials", "wpmudev-plugin-test")}</h2>
        </div>
        <div className="sui-box-body">
            {/* Client ID */}
            <div className="sui-box-settings-row">
                <TextControl
                    help={createInterpolateElement(
                        __("You can get Client ID from <a>Google Cloud Console</a>. Make sure to enable Google Drive API.", "wpmudev-plugin-test"),
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
                    onChange={value =>
                        setCredentials({ ...credentials, clientId: value })
                    }
                />
            </div>
            {/* Client Secret */}
            <div className="sui-box-settings-row">
                <TextControl
                    help={createInterpolateElement(
                        __("You can get Client Secret from <a>Google Cloud Console</a>.", "wpmudev-plugin-test"),
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
                    onChange={value =>
                        setCredentials({ ...credentials, clientSecret: value })
                    }
                    type="password"
                />
            </div>
            {/* Redirect URI */}
            <div className="sui-box-settings-row">
                <span>
                    {createInterpolateElement(
                        __("Please use this URL <em></em> in your Google API's <strong>Authorized redirect URIs</strong> field.", "wpmudev-plugin-test"),
                        {
                            em: <em>{redirectUri}</em>,
                            strong: <strong />,
                        }
                    )}
                </span>
            </div>
            {/* Scopes */}
            <div className="sui-box-settings-row">
                <p>
                    <strong>
                        {__("Required scopes for Google Drive API:", "wpmudev-plugin-test")}
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
                    {isLoading ? <Spinner /> : __("Save Credentials", "wpmudev-plugin-test")}
                </Button>
            </div>
        </div>
    </div>
);

export default CredentialsForm;
