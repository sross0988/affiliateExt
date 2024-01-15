import React from 'react';
import _ from 'lodash';
import {
    Card,
    CardContent,
    Typography,
    CircularProgress,
} from '@mui/material';
import AnimatedCounter from './AnimatedCounter';
import './Newtab.css';
import './Newtab.scss';
import { formatPrice, OrganizedReportType, StatConfigType } from './utils';
import { SUPPORTED_STATS } from './constants';

const AnimatedStat = ({ statId, organizedReports, isLoading }: {
    statId: string;
    organizedReports: OrganizedReportType;
    isLoading: boolean;
}) => {
    const stat = _.find(SUPPORTED_STATS, { statId }) as StatConfigType | undefined;
    if (!stat) {
        return null;
    }
    const { statFormat } = stat as StatConfigType;
    // @ts-ignore
    const value = organizedReports[statId] as number;

    const renderAnimatedStat = () => {
        switch (statFormat) {
            case 'price':
                return <AnimatedCounter value={value} formattingFn={formatPrice} decimals={2} />;
            case 'int':
            default:
                return <AnimatedCounter value={value} />;
        }
    }

    const statName = stat.name;

    const styles: React.CSSProperties = {};

    if (isLoading) {
        styles['display'] = 'flex';
        styles['alignItems'] = 'center';
        styles['justifyContent'] = 'center';
    }

    return (
        <Card
            raised
        >
            <CardContent sx={{
                minHeight: '128px',
                ...styles
            }}>
                {!isLoading && organizedReports?.totalProfit ? <>
                    <Typography variant="h5" component="div">
                        {statName}
                    </Typography>
                    <Typography variant="h3" component="div">
                        {renderAnimatedStat()}
                    </Typography>
                </> : <CircularProgress />}
            </CardContent>
        </Card>
    )

}

export default AnimatedStat;