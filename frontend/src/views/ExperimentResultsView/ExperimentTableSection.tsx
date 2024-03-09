// ExperimentTableSection.tsx
// Fetch data for table section based on experimentId
useEffect(() => {
    const fetchTableData = async () => {
        try {
            const response = await fetch(`http://localhost:8000/experiment/${experimentId}/table-data`);
            if (!response.ok) {
                throw new Error('Failed to fetch table data');
            }
            const data = await response.json();
            setTableData(data);
        } catch (error) {
            console.error('Error fetching table data:', error);
        }
    };
    fetchTableData();
}, [experimentId]);
