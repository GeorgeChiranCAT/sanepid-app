import React from 'react';

const Table = ({
                   columns = [],
                   data = [],
                   className = '',
                   theadClassName = '',
                   tbodyClassName = '',
                   trClassName = '',
                   thClassName = '',
                   tdClassName = '',
                   emptyMessage = 'No data available',
                   ...props
               }) => {
    return (
        <div className={`overflow-x-auto ${className}`} {...props}>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className={`bg-gray-50 ${theadClassName}`}>
                <tr className={trClassName}>
                    {columns.map((column, index) => (
                        <th
                            key={index}
                            className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${thClassName} ${column.className || ''}`}
                            style={column.style}
                            {...column.headerProps}
                        >
                            {column.header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody className={`bg-white divide-y divide-gray-200 ${tbodyClassName}`}>
                {data.length > 0 ? (
                    data.map((row, rowIndex) => (
                        <tr key={rowIndex} className={`${trClassName}`}>
                            {columns.map((column, colIndex) => (
                                <td
                                    key={colIndex}
                                    className={`px-6 py-4 whitespace-nowrap ${tdClassName} ${column.cellClassName || ''}`}
                                    {...column.cellProps}
                                >
                                    {column.cell ? column.cell(row, rowIndex) : row[column.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td
                            colSpan={columns.length}
                            className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                            {emptyMessage}
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;