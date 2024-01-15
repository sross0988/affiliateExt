import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import _ from 'lodash';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Switch from '@mui/material/Switch';
import { Tooltip } from '@mui/material';
import { SUPPORTED_STATS } from './constants';
import { StatConfigType } from './utils';

export default function StatList({
    stats,
    setStats
}: {
    stats: string[];
    setStats: (stats: string[]) => void;
}) {

    const handleToggleStat = (statId: string) => {
        if (stats.includes(statId)) {
            setStats(stats.filter(stat => stat !== statId));
        } else {
            setStats([...stats, statId]);
        }
    }

    const onDragEnd = (result: any) => {
        if (!result.destination) {
            return;
        }
        const items = Array.from(stats);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setStats(items);
    }

    const supportedStatsNotPresent = SUPPORTED_STATS.filter(stat => !stats.includes(stat.statId)).map(stat => stat.statId);
    const statsToRender = [...stats, ...supportedStatsNotPresent];

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
                        }}>Stats</ListSubheader>}
                        dense
                    >
                        {statsToRender.map((statId, index) => {
                            const stat = _.find(SUPPORTED_STATS, { statId }) as StatConfigType | undefined;
                            if (!stat) {
                                return null;
                            }
                            return (<Draggable
                                isDragDisabled={!stats.includes(stat.statId)}
                                key={stat.statId} draggableId={stat.statId} index={index}>
                                {(provided, snapshot) => (
                                    <Tooltip title={stat.description} placement='left'>
                                        <ListItem
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <ListItemButton
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleToggleStat(stat.statId)
                                                }}
                                            >
                                                <ListItemText id={stat.statId} primary={stat.name} />
                                                <Switch
                                                    edge="end"
                                                    checked={stats.includes(stat.statId)}
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