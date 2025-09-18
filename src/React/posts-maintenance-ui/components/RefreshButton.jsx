const RefreshButton = ({ isLoading, onClick }) => (
    <div className="wpmudev-pm-actions">
        <button
            className="button"
            onClick={onClick}
            disabled={isLoading}
        >
            {isLoading ? "Refreshing..." : "Refresh Scan Data"}
        </button>
    </div>
);

export default RefreshButton;
