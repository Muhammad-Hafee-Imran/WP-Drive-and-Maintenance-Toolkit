import { __ } from "@wordpress/i18n";

const ScanTypeSelector = ({ scanType, setScanType }) => (
    <div className="hafee-pm-scan-type">
        <label htmlFor="scan-type" style={{ marginRight: "8px" }}>
            {__("Content type:", "hafee-utility-plugin")}
        </label>
        <select
            id="scan-type"
            value={scanType}
            onChange={(e) => setScanType(e.target.value)}
        >
              <option value="posts">{__("Posts", "hafee-utility-plugin")}</option>
            <option value="pages">{__("Pages", "hafee-utility-plugin")}</option>
            <option value="both">{__("Posts & Pages", "hafee-utility-plugin")}</option>
        </select>
    </div>
);

export default ScanTypeSelector;
