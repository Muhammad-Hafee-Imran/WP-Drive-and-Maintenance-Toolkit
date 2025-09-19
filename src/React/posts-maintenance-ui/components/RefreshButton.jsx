import { __ } from "@wordpress/i18n";

const RefreshButton = ({ isLoading, onClick }) => (
    <div className="wpmudev-pm-actions">
        <button
            className="button"
            onClick={onClick}
            disabled={isLoading}
        >
            {isLoading ? __("Refreshing...", "wpmudev-plugin-test") : __("Refresh Scan Data", "wpmudev-plugin-test")}
        </button>
    </div>
);

export default RefreshButton;
