import { Button, TextControl, Spinner } from "@wordpress/components";
import { __ } from '@wordpress/i18n';
import { createInterpolateElement } from '@wordpress/element';

// Credentials form for entering Client ID/Secret
const CredentialsForm = ({
    credentials,
    setCredentials,
    handleSaveCredentials,
    isLoading,
    redirectUri
}) => (
    <div className="hafee-box">
        <div className="hafee-box-header">
            <h2 className="hafee-box-title">{__("Set Google Drive Credentials", "hafee-utility-plugin")}</h2>
        </div>
        <div className="hafee-box-body">
            {/* Client ID */}
            <div className="hafee-box-settings-row">
                <TextControl
                    help={createInterpolateElement(
                        __("You can get Client ID from <a>Google Cloud Console</a>. Make sure to enable Google Drive API.", "hafee-utility-plugin"),
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
                    label={__("Client ID", "hafee-utility-plugin")}
                    value={credentials.clientId}
                    onChange={value =>
                        setCredentials({ ...credentials, clientId: value })
                    }
                />
            </div>
            {/* Client Secret */}
            <div className="hafee-box-settings-row">
                <TextControl
                    help={createInterpolateElement(
                        __("You can get Client Secret from <a>Google Cloud Console</a>.", "hafee-utility-plugin"),
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
                    label={__("Client Secret", "hafee-utility-plugin")}
                    value={credentials.clientSecret}
                    onChange={value =>
                        setCredentials({ ...credentials, clientSecret: value })
                    }
                    type="password"
                />
            </div>
            {/* Redirect URI */}
            <div className="hafee-box-settings-row">
                <span>
                    {createInterpolateElement(
                        __("Please use this URL <em></em> in your Google API's <strong>Authorized redirect URIs</strong> field.", "hafee-utility-plugin"),
                        {
                            em: <em>{redirectUri}</em>,
                            strong: <strong />,
                        }
                    )}
                </span>
            </div>
            {/* Scopes */}
            <div className="hafee-box-settings-row">
                <p>
                    <strong>
                        {__("Required scopes for Google Drive API:", "hafee-utility-plugin")}
                    </strong>{" "}
                    https://www.googleapis.com/auth/drive.file{" | "}
                    https://www.googleapis.com/auth/drive.readonly
                </p>
            </div>
        </div>
        <div className="hafee-box-footer">
            <div className="hafee-actions-right">
                <Button
                    variant="primary"
                    onClick={handleSaveCredentials}
                    disabled={isLoading}
                >
                    {isLoading ? <Spinner /> : __("Save Credentials", "hafee-utility-plugin")}
                </Button>
            </div>
        </div>
    </div>
);

export default CredentialsForm;
