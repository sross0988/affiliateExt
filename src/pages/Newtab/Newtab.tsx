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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from "@mui/material/useMediaQuery";
import './Newtab.css';
import './Newtab.scss';
import { getOrganizedTodaysReports, TableChartConfigType, TagIdentifierType } from './utils';
import useLocalStorage from './useLocalStorage';

import { SUPPORTED_STATS, SUPPORTED_TABLES_CHARTS } from './constants';
import TableStat from './TableStat';
import AnimatedStat from './AnimatedStat';
import defaultTheme from './theme';


/*
// TODO: 
// Real time items table
// Category table
// Custom profit table - 2% etc
// Download the data


// Offline status
// You are not logged in status
// Remove chart
// Clean up code
// Custom height for the tables
// Masony layout for the dashboard
// Fix eslint errors
*/

const Newtab = () => {
  const [primaryColor, setPrimaryColor] = useLocalStorage<string>('primary_color', '#1976d2');
  const [tagIdentities, setTagIdentities] = useLocalStorage<TagIdentifierType[]>('tag_identities_1', []);
  const [stats, setStats] = useLocalStorage<string[]>('stat_ids', [...SUPPORTED_STATS.map(stat => stat.statId)]);
  const [tablesCharts, setTablesCharts] = useLocalStorage<string[]>('table_chart_ids', [...SUPPORTED_TABLES_CHARTS.map(table => table.id)]);
  const { data: todaysReports, isLoading: isLoadingReports, refetch: refetchReports, isFetching: isFetchingReports } = useGetTodaysReports();
  const { data: todaysBounties, isLoading: isLoadingBounties, refetch: refetchBounties, isFetching: isFetchingBounties } = useGetTodaysBounties();
  const organizedReports = getOrganizedTodaysReports(todaysReports?.records || [], todaysBounties?.records || []);
  const isLoading = isLoadingReports || isLoadingBounties;
  // Get OS-level preference for dark mode
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  // state: boolean ; true == use dark mode
  const [darkMode, setDarkMode] = useLocalStorage('dark-mode', prefersDarkMode);

  const themeString = (b: boolean) => (b ? "dark" : "light");

  const theme = React.useMemo(
    () =>
      createTheme({
        ...defaultTheme,
        palette: {
          ...defaultTheme.palette,
          primary: {
            ...defaultTheme.palette.primary,
            main: primaryColor,
          },
          mode: themeString(darkMode),
        },
      })
    ,
    [darkMode, primaryColor]
  );


  return (

    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* This is for a consistent baseline style */}
      <div className="App">
        <PrimarySearchAppBar
          setStats={setStats}
          stats={stats}
          setTablesCharts={setTablesCharts}
          tablesCharts={tablesCharts}
          setPrimaryColor={setPrimaryColor}
          primaryColor={primaryColor}
          setDarkMode={setDarkMode}
          darkMode={darkMode}
          refresh={() => {
            refetchReports();
            refetchBounties();
          }}
          isRefreshing={isFetchingReports || isFetchingBounties}

        >
          <Box sx={{
            margin: '1rem'
          }}>
            <Grid container spacing={2} >
              {stats.map((statId) => {
                return (
                  <Grid item xs={12} sm={6} md={6} lg={3} key={statId}>
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
                    <Grid item xs={12} lg={6} key={tableConfig.id}>
                      <Card raised
                        sx={{
                          minHeight: '440px',
                          ...styles
                        }}
                      >
                        {isLoading ? <CircularProgress /> : <TableStat tagIdentities={tagIdentities} setTagIdentities={setTagIdentities} tableConfig={tableConfig} organizedReports={organizedReports} />}
                      </Card>
                    </Grid>
                  )
                })
              }
            </Grid>
          </Box>
        </PrimarySearchAppBar>
      </div>
    </ThemeProvider>
  );
};

export default Newtab;
