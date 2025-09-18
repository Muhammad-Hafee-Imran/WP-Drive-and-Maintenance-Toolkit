const Notice = ({ type, message, onDismiss }) => {
    if (!message) return null;

    const classes = `notice notice-${type} is-dismissible`;

    return (
        <div className={classes}>
            <p>{message}</p>
            <button type="button" className="notice-dismiss" onClick={onDismiss}>
                <span className="screen-reader-text">Dismiss this notice.</span>
            </button>
        </div>
    );
};

export default Notice;
