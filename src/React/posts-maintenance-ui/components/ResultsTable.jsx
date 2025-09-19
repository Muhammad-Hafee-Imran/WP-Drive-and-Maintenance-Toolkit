import { __ } from "@wordpress/i18n";
const ResultsTable = ({ results }) => (
    <table className="widefat striped wpmudev-pm-results">
        <thead>
            <tr>
                <th>{__("ID", "wpmudev-plugin-test")}</th>
                <th>{__("Title", "wpmudev-plugin-test")}</th>
                <th>{__("Type", "wpmudev-plugin-test")}</th> 
                <th>{__("Last Scan", "wpmudev-plugin-test")}</th>
            </tr>
        </thead>
        <tbody>
            {results.map((row, index) => (
                <tr key={`${row.id}-${index}`}>
                    <td>{row.id}</td>
                    <td>{row.title}</td>
                    <td>{row.type}</td>   
                    <td>{row.lastScan}</td>
                </tr>
            ))}
        </tbody>
    </table>
);


export default ResultsTable;
