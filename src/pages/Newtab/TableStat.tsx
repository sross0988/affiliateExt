import React from 'react';
import _ from 'lodash';
import {
    Card,
    CardContent,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableSortLabel,
    Paper,
} from '@mui/material';
import './Newtab.css';
import './Newtab.scss';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { OrganizedReportType, SummarySaleType, TAG } from './utils';
import useLocalStorage from './useLocalStorage';

export interface ColumnType {
    name: string;
    id: string;
    sortable?: boolean;
    format?: (value: any, row: any) => any;
    align?: 'left' | 'right';
}

export interface TableChartConfigType {
    id: string;
    name: string;
    type: string;
    columns: ColumnType[];
    defaultSort: string;
    defaultSortDirection: 'asc' | 'desc';
}

{/* <TableStat tableConfig={SUPPORTED_TABLES_CHARTS[0]} organizedReports={organizedReports}/> */ }

const TableStat = ({ tableConfig, organizedReports }: {
    tableConfig: TableChartConfigType;
    organizedReports: OrganizedReportType;
}) => {
    const [sort, setSort] = useLocalStorage(`${tableConfig.id}_sort`, tableConfig.defaultSort);
    const [sortDirection, setSortDirection] = useLocalStorage<'asc' | 'desc'>(`${tableConfig.id}_sortDirection`, tableConfig.defaultSortDirection);
    // @ts-ignore
    const data = organizedReports[tableConfig.id];

    const sortedData = _.orderBy(data, [sort], [sortDirection]);

    const createSortHandler =
        (property: string) => (event: React.MouseEvent<unknown>) => {
            if (sort === property) {
                setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
            } else {
                setSortDirection('desc');
                setSort(property);
            }
        };

    return (
        <Card raised>
            <CardContent>
                <Typography variant="h5" component="div"
                    sx={{
                        marginBottom: '1rem'
                    }}
                >
                    {tableConfig.name}
                </Typography>
                <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                    <Table stickyHeader sx={{ minWidth: 650 }} size="small" aria-label={tableConfig.name}>
                        <TableHead>
                            <TableRow>
                                {tableConfig.columns.map((column) => {

                                    return (
                                        <TableCell
                                            key={column.id}
                                            align={column?.align || 'left'}
                                            sortDirection={sort === column.id ? sortDirection : false}
                                        >
                                            <TableSortLabel
                                                active={sort === column.id}
                                                direction={sort === column.id ? sortDirection : 'desc'}
                                                onClick={createSortHandler(column.id)}
                                                IconComponent={ArrowUpwardIcon}
                                            >
                                                {column.name}
                                            </TableSortLabel>
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(sortedData || []).map((row: SummarySaleType, i: number) => {
                                return (
                                    <TableRow
                                        key={`${row.title}-${row.asin}-${i}`}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        {tableConfig.columns.map((column) => {
                                            // @ts-ignore
                                            const fmtData = column.format ? column.format(row[column.id], row) : row[column.id];
                                            return (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align || 'left'}
                                                >{fmtData}</TableCell>
                                            )
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>

    )
};

export default TableStat;