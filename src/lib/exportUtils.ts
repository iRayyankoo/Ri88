/**
 * Utility to convert an array of objects to a CSV string and trigger a download.
 */
export const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    // Extract headers from the first object
    const headers = Object.keys(data[0]);
    
    // Create CSV rows
    const csvRows = [
        headers.join(','), // header row
        ...data.map(row => 
            headers.map(fieldName => {
                const value = row[fieldName];
                const escaped = ('' + value).replace(/"/g, '""'); // escape double quotes
                return `"${escaped}"`;
            }).join(',')
        )
    ];

    const csvContent = csvRows.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
