import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HistoricalDataTable = ({ data, onExport }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const columns = [
    { key: 'date', label: 'Date', sortable: true },
    { key: 'url', label: 'URL', sortable: true },
    { key: 'experimentType', label: 'Experiment', sortable: true },
    { key: 'device', label: 'Device', sortable: true },
    { key: 'performance', label: 'Performance', sortable: true },
    { key: 'fcp', label: 'FCP (ms)', sortable: true },
    { key: 'lcp', label: 'LCP (ms)', sortable: true },
    { key: 'cls', label: 'CLS', sortable: true },
    { key: 'fid', label: 'FID (ms)', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  const filteredAndSortedData = useMemo(() => {
    let filtered = data?.filter(item => 
      item?.url?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      item?.experimentType?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );

    if (sortConfig?.key) {
      filtered?.sort((a, b) => {
        let aValue = a?.[sortConfig?.key];
        let bValue = b?.[sortConfig?.key];

        if (sortConfig?.key === 'date') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (aValue < bValue) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedData?.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedData?.length / pageSize);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig?.key === key && prevConfig?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getPerformanceScoreColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-error';
  };

  const formatExperimentType = (type) => {
    const typeMap = {
      'baseline': 'Baseline',
      'no-js': 'No JS',
      'no-third-party': 'No 3rd Party',
      'no-render-blocking': 'No Render Block',
      'unused-resources': 'Unused Resources',
      'first-party-only': 'First Party Only'
    };
    return typeMap?.[type] || type;
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-border">
        <h3 className="text-sm font-medium text-foreground flex items-center space-x-2 mb-3 sm:mb-0">
          <Icon name="Table" size={16} />
          <span>Historical Data</span>
          <span className="text-xs text-muted-foreground">
            ({filteredAndSortedData?.length} records)
          </span>
        </h3>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          {/* Search */}
          <div className="relative">
            <Icon name="Search" size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search URL or experiment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="pl-9 pr-3 py-2 text-sm border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring w-full sm:w-64"
            />
          </div>
          
          {/* Export Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            iconName="Download"
            iconSize={14}
          >
            Export
          </Button>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {columns?.map((column) => (
                <th
                  key={column?.key}
                  className={`px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider ${
                    column?.sortable ? 'cursor-pointer hover:bg-muted/70' : ''
                  }`}
                  onClick={() => column?.sortable && handleSort(column?.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column?.label}</span>
                    {column?.sortable && (
                      <Icon
                        name={
                          sortConfig?.key === column?.key
                            ? sortConfig?.direction === 'asc' ?'ChevronUp' :'ChevronDown' :'ChevronsUpDown'
                        }
                        size={12}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData?.map((row, index) => (
              <tr key={index} className="hover:bg-muted/30 transition-smooth">
                <td className="px-4 py-3 text-sm text-foreground">
                  {new Date(row.date)?.toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm text-foreground max-w-xs truncate" title={row?.url}>
                  {row?.url}
                </td>
                <td className="px-4 py-3 text-sm text-foreground">
                  <span className="px-2 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium">
                    {formatExperimentType(row?.experimentType)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name={row?.device === 'mobile' ? 'Smartphone' : 'Monitor'} size={14} />
                    <span className="capitalize">{row?.device}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`font-medium ${getPerformanceScoreColor(row?.performance)}`}>
                    {row?.performance}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-foreground">{row?.fcp}</td>
                <td className="px-4 py-3 text-sm text-foreground">{row?.lcp}</td>
                <td className="px-4 py-3 text-sm text-foreground">{row?.cls}</td>
                <td className="px-4 py-3 text-sm text-foreground">{row?.fid}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="Eye"
                      iconSize={12}
                      title="View Details"
                    />
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="Download"
                      iconSize={12}
                      title="Download Report"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-border">
          <div className="flex items-center space-x-2 mb-3 sm:mb-0">
            <span className="text-sm text-muted-foreground">Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e?.target?.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 text-sm border border-border rounded bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-muted-foreground">per page</span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              iconName="ChevronLeft"
              iconSize={14}
            >
              Previous
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              iconName="ChevronRight"
              iconSize={14}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoricalDataTable;