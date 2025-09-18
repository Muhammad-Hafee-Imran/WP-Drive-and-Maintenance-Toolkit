const ProgressBar = ({ progress }) => (
    <div className="wpmudev-pm-progress">
        <div
            className="wpmudev-pm-progress-bar"
            style={{ width: `${progress}%` }}
        />
        <span>{progress}%</span>
    </div>
);

export default ProgressBar;
