const ProgressBar = ({ progress }) => (
    <div className="hafee-pm-progress">
        <div
            className="hafee-pm-progress-bar"
            style={{ width: `${progress}%` }}
        />
        <span>{progress}%</span>
    </div>
);

export default ProgressBar;
