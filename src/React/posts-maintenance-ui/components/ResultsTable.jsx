import { __ } from "@wordpress/i18n";
const ResultsTable = ({ results }) => (
    <table className="widefat striped hafee-pm-results">
        <thead>
            <tr>
                <th>{__("ID", "hafee-utility-plugin")}</th>
                <th>{__("Title", "hafee-utility-plugin")}</th>
                <th>{__("Type", "hafee-utility-plugin")}</th> 
                <th>{__("Last Scan", "hafee-utility-plugin")}</th>
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
