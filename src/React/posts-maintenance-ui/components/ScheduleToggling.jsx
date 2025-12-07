import { __ } from "@wordpress/i18n";
const ScheduleToggle = ({ enabled, loading, onToggle, scanType }) => (
    <button
        className={`button ${enabled ? "button-secondary" : "button-primary"}`}
        onClick={() => onToggle(!enabled, scanType)} // 👈 send both
        disabled={loading}
    >
        {loading
           ? __("Updating...", "hafee-utility-plugin")
            : enabled
            ? __("Disable Scheduled Scans", "hafee-utility-plugin")
            : __("Enable Scheduled Scans", "hafee-utility-plugin")}
    </button>
);

export default ScheduleToggle;
