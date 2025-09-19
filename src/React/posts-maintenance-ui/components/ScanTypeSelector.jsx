import { __ } from "@wordpress/i18n";

const ScanTypeSelector = ({ scanType, setScanType }) => (
    <div className="wpmudev-pm-scan-type">
        <label htmlFor="scan-type" style={{ marginRight: "8px" }}>
            {__("Content type:", "wpmudev-plugin-test")}
        </label>
        <select
            id="scan-type"
            value={scanType}
            onChange={(e) => setScanType(e.target.value)}
        >
              <option value="posts">{__("Posts", "wpmudev-plugin-test")}</option>
            <option value="pages">{__("Pages", "wpmudev-plugin-test")}</option>
            <option value="both">{__("Posts & Pages", "wpmudev-plugin-test")}</option>
        </select>
    </div>
);

export default ScanTypeSelector;
