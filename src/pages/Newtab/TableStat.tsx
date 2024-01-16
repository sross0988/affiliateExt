import React from 'react';
import _ from 'lodash';
import {
    Box,
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
    IconButton,
    Collapse,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import './Newtab.css';
import './Newtab.scss';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { OrganizedReportType, SummarySaleType, TableChartConfigType, TagIdentifierType } from './utils';
import useLocalStorage from './useLocalStorage';

const TableStatRow = ({
    row,
    tableConfig,
    uniqueKey,
    tagIdentities,
    setTagIdentities,
}: {
    row: SummarySaleType;
    tableConfig: TableChartConfigType;
    uniqueKey: string;
    tagIdentities: TagIdentifierType[];
    setTagIdentities: (tagIdentities: TagIdentifierType[]) => void;
}) => {
    const [open, setOpen] = useLocalStorage(`${uniqueKey}_open`, false);
    return (
        <>
            <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                {tableConfig.columns.map((column) => {
                    // @ts-ignore
                    const fmtData = column.format ? column.format(row[column.id], row, {
                        tagIdentities,
                        setTagIdentities,
                        // @ts-ignore
                    }) : row[column.id];
                    return (
                        <TableCell
                            key={column.id}
                            align={column.align || 'left'}
                        >{fmtData}</TableCell>
                    )
                })}
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={tableConfig.columns.length + 1}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        {(tableConfig?.collapseColumns || []).map((column) => {
                                            return (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align || 'left'}
                                                >{column.name}</TableCell>
                                            )
                                        })}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(row.lines || []).map((line) => {
                                        return (<TableRow>
                                            {(tableConfig?.collapseColumns || []).map((column) => {
                                                // @ts-ignore
                                                const fmtData = column.format ? column.format(line[column.id], line, {
                                                    tagIdentities,
                                                    setTagIdentities,
                                                    // @ts-ignore
                                                }) : line[column.id];
                                                return (
                                                    <TableCell
                                                        key={column.id}
                                                        align={column.align || 'left'}
                                                    >{fmtData}</TableCell>
                                                )
                                            })}
                                        </TableRow>);
                                    })}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>


    )
}

const TableStat = ({
    tableConfig,
    organizedReports,
    tagIdentities,
    setTagIdentities
}: {
    tableConfig: TableChartConfigType;
    organizedReports: OrganizedReportType;
    tagIdentities: TagIdentifierType[];
    setTagIdentities: (tagIdentities: TagIdentifierType[]) => void;
}) => {
    const [sort, setSort] = useLocalStorage(`${tableConfig.id}_sort`, tableConfig.defaultSort);
    const [sortDirection, setSortDirection] = useLocalStorage<'asc' | 'desc'>(`${tableConfig.id}_sortDirection`, tableConfig.defaultSortDirection);
    // @ts-ignore
    const data = organizedReports[tableConfig.id];

    const sortedData = _.orderBy(data, [sort], [sortDirection]);

    const uniqueKey = tableConfig.uniqueKey || 'asin';

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
                                <TableCell />
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
                                // @ts-ignore
                                const key = `${row.title}-${row?.[uniqueKey] || i}`;
                                return (
                                    <TableStatRow
                                        row={row}
                                        tableConfig={tableConfig}
                                        key={key}
                                        uniqueKey={key}
                                        tagIdentities={tagIdentities}
                                        setTagIdentities={setTagIdentities}
                                    />
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