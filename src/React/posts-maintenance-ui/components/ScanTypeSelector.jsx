const ScanTypeSelector = ({ scanType, setScanType }) => (
    <div className="wpmudev-pm-scan-type">
        <label htmlFor="scan-type" style={{ marginRight: "8px" }}>
            Content type:
        </label>
        <select
            id="scan-type"
            value={scanType}
            onChange={(e) => setScanType(e.target.value)}
        >
            <option value="posts">Posts</option>
            <option value="pages">Pages</option>
            <option value="both">Posts & Pages</option>
        </select>
    </div>
);

export default ScanTypeSelector;
