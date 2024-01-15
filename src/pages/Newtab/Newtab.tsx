import React from 'react';
import _ from 'lodash';
import {
  Box,
  Grid,
  Card,
  CircularProgress,
} from '@mui/material';
import { useGetTodaysReports, useGetTodaysBounties } from './useAmazonAffiliate';
import PrimarySearchAppBar from './app';
import './Newtab.css';
import './Newtab.scss';
import { getOrganizedTodaysReports, TableChartConfigType } from './utils';
import useLocalStorage from './useLocalStorage';
import { SUPPORTED_STATS, SUPPORTED_TABLES_CHARTS } from './constants';
import TableStat from './TableStat';
import AnimatedStat from './AnimatedStat';

/*
// TODO: Map tracking ids to names
// Reset all saved data
// Change the color of the app
// Dark mode
// Real time items table
// Category table
// Add collapse to all tables
// Add at least one chart
// Add custom revenue
// Double check all the data
// Offline status
// You are not logged in status
// Clean up code
// Fix the way that the arrow is displayed on tables
// Custom height for the tables
// Masony layout for the dashboard
// Fix hide data switch style
// Add hide data switch to the drawer menu
// Fix eslint errors
*/

const Newtab = () => {
  const [stats, setStats] = useLocalStorage<string[]>('stat_ids', [...SUPPORTED_STATS.map(stat => stat.statId)]);
  const [tablesCharts, setTablesCharts] = useLocalStorage<string[]>('table_chart_ids', [...SUPPORTED_TABLES_CHARTS.map(table => table.id)]);
  const { data: todaysReports, isLoading: isLoadingReports } = useGetTodaysReports();
  const { data: todaysBounties, isLoading: isLoadingBounties } = useGetTodaysBounties();
  const organizedReports = getOrganizedTodaysReports(todaysReports?.records || [], todaysBounties?.records || []);
  const isLoading = isLoadingReports || isLoadingBounties;

  return (
    <div className="App">
      <PrimarySearchAppBar
        setStats={setStats}
        stats={stats}
        setTablesCharts={setTablesCharts}
        tablesCharts={tablesCharts}
      >
        <Box sx={{
          margin: '1rem'
        }}>
          <Grid container spacing={2} >
            {stats.map((statId) => {
              return (
                <Grid item xs={12} sm={6} md={6} lg={3} >
                  <AnimatedStat
                    statId={statId}
                    organizedReports={organizedReports}
                    isLoading={isLoading}
                  />
                </Grid>
              )
            })}
            {
              tablesCharts.map((tableId) => {
                const tableConfig = _.find(SUPPORTED_TABLES_CHARTS, { id: tableId }) as TableChartConfigType | undefined;
                if (!tableConfig) {
                  return null;
                }


                const styles: React.CSSProperties = {};

                if (isLoading) {
                  styles['display'] = 'flex';
                  styles['alignItems'] = 'center';
                  styles['justifyContent'] = 'center';
                }

                return (
                  <Grid item xs={12} lg={6} >
                    <Card raised
                      sx={{
                        minHeight: '440px',
                        ...styles
                      }}
                    >
                      {isLoading ? <CircularProgress /> : <TableStat tableConfig={tableConfig} organizedReports={organizedReports} />}
                    </Card>
                  </Grid>
                )
              })
            }
          </Grid>
        </Box>
      </PrimarySearchAppBar>
    </div>
  );
};

export default Newtab;
