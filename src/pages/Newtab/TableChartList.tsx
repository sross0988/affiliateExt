import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import _ from 'lodash';

import DragHandleIcon from '@mui/icons-material/DragHandle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Switch from '@mui/material/Switch';
import { ListItemIcon, Tooltip } from '@mui/material';
import { SUPPORTED_TABLES_CHARTS } from './constants';


export default function TableChartList({
    tablesCharts,
    setTablesCharts
}: {
    tablesCharts: string[];
    setTablesCharts: (stats: string[]) => void;
}) {

    const handleToggleTableChart = (id: string) => {
        if (tablesCharts.includes(id)) {
            setTablesCharts(tablesCharts.filter(stat => stat !== id));
        } else {
            setTablesCharts([...tablesCharts, id]);
        }
    }

    const onDragEnd = (result: any) => {
        if (!result.destination) {
            return;
        }
        const items = Array.from(tablesCharts);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setTablesCharts(items);
    }

    const supportedStatsNotPresent = SUPPORTED_TABLES_CHARTS.filter(stat => !tablesCharts.includes(stat.id)).map(stat => stat.id);
    const statsToRender = [...tablesCharts, ...supportedStatsNotPresent];

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                    <List
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        sx={{ width: '100%', bgcolor: 'background.paper', marginTop: '10px' }}
                        subheader={<ListSubheader sx={{
                            lineHeight: '24px',
                            fontWeight: 700,
                            textAlign: 'left',
                        }}>Tables</ListSubheader>}
                        dense
                    >
                        {statsToRender.map((id, index) => {
                            const tableChart = _.find(SUPPORTED_TABLES_CHARTS, { id });
                            if (!tableChart) {
                                return null;
                            }
                            return (<Draggable
                                isDragDisabled={!tablesCharts.includes(tableChart.id)}
                                key={tableChart.id} draggableId={tableChart.id} index={index}>
                                {(provided, snapshot) => (
                                    <Tooltip title={tableChart.description} placement='left'>
                                        <ListItem
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            {tablesCharts.includes(tableChart.id) ? <ListItemIcon>
                                                <DragHandleIcon />
                                            </ListItemIcon> : null}
                                            <ListItemButton
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleToggleTableChart(tableChart.id)

                                                }}
                                            >
                                                <ListItemText id={tableChart.id} primary={tableChart.name} />
                                                <Switch
                                                    edge="end"
                                                    checked={tablesCharts.includes(tableChart.id)}
                                                    inputProps={{
                                                        'aria-labelledby': 'switch-list-label-wifi',
                                                    }}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    </Tooltip>
                                )}
                            </Draggable>)
                        })}
                        {provided.placeholder}
                    </List>
                )}
            </Droppable>
        </DragDropContext>
    );
}