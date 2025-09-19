import { __ } from "@wordpress/i18n";
const ScheduleToggle = ({ enabled, loading, onToggle, scanType }) => (
    <button
        className={`button ${enabled ? "button-secondary" : "button-primary"}`}
        onClick={() => onToggle(!enabled, scanType)} // 👈 send both
        disabled={loading}
    >
        {loading
           ? __("Updating...", "wpmudev-plugin-test")
            : enabled
            ? __("Disable Scheduled Scans", "wpmudev-plugin-test")
            : __("Enable Scheduled Scans", "wpmudev-plugin-test")}
    </button>
);

export default ScheduleToggle;
