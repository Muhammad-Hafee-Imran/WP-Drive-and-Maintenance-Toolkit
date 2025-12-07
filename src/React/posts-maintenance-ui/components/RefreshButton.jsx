import { __ } from "@wordpress/i18n";

const RefreshButton = ({ isLoading, onClick }) => (
    <div className="hafee-pm-actions">
        <button
            className="button"
            onClick={onClick}
            disabled={isLoading}
        >
            {isLoading ? __("Refreshing...", "hafee-utility-plugin") : __("Refresh Scan Data", "hafee-utility-plugin")}
        </button>
    </div>
);

export default RefreshButton;
