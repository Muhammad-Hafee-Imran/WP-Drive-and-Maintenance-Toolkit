const ResultsTable = ({ results }) => (
    <table className="widefat striped wpmudev-pm-results">
        <thead>
            <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Type</th>      {/* ✅ new column */}
                <th>Last Scan</th>
            </tr>
        </thead>
        <tbody>
            {results.map((row, index) => (
                <tr key={`${row.id}-${index}`}>
                    <td>{row.id}</td>
                    <td>{row.title}</td>
                    <td>{row.type}</td>   {/* ✅ new column */}
                    <td>{row.lastScan}</td>
                </tr>
            ))}
        </tbody>
    </table>
);


export default ResultsTable;
