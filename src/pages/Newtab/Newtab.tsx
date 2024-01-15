import React from 'react';
import _ from 'lodash';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Link,
  CircularProgress,
} from '@mui/material';
import { useGetTodaysReports, useGetTodaysBounties } from './useAmazonAffiliate';
import PrimarySearchAppBar from './app';
import AnimatedCounter from './AnimatedCounter';
import './Newtab.css';
import './Newtab.scss';
import { formatPrice, getOrganizedTodaysReports, OrganizedReportType, StatConfigType } from './utils';
import useLocalStorage from './useLocalStorage';
import { SUPPORTED_STATS } from './constants';

const TAG = 'jd-daily-20';


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

  return (
    <Card
      raised
    >
      <CardContent sx={{
        minHeight: '128px',
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


const Newtab = () => {
  const [stats, setStats] = useLocalStorage<string[]>('stat_ids', [...SUPPORTED_STATS.map(stat => stat.statId)]);
  const { data: todaysReports, isLoading: isLoadingReports } = useGetTodaysReports();
  const { data: todaysBounties, isLoading: isLoadingBounties } = useGetTodaysBounties();
  const organizedReports = getOrganizedTodaysReports(todaysReports?.records || [], todaysBounties?.records || []);
  const isLoading = isLoadingReports || isLoadingBounties;

  return (
    <div className="App">
      <PrimarySearchAppBar
        setStats={setStats}
        stats={stats}
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
            <Grid item xs={12} lg={6} >
              <Card raised>
                <CardContent>
                  <Typography variant="h5" component="div">
                    Today's Sales by Products
                  </Typography>
                  <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                    <Table stickyHeader sx={{ minWidth: 650 }} size="small" aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Product Title</TableCell>
                          <TableCell align="right">Total Ordered</TableCell>
                          <TableCell align="right">Total Sales Revenue</TableCell>
                          <TableCell align="right">Total Profit</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(organizedReports?.reportRowsByASIN || []).map((row, i) => {
                          return (
                            <TableRow
                              key={`${row.title}-${row.asin}-${i}`}
                              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                              <TableCell component="th" scope="row">
                                <Link
                                  href={`https://www.amazon.com/dp/${row.asin}?tag=${TAG}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >{row.title}</Link>
                              </TableCell>
                              <TableCell align="right">{row.totalItemsPurchased}</TableCell>
                              <TableCell align="right">{formatPrice(row.totalSalesRevenue)}</TableCell>
                              <TableCell align="right">{formatPrice(row.profit)}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>

                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Card raised>
                <CardContent>
                  <Typography variant="h5" component="div">
                    Today's Sales by Time
                  </Typography>
                  <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                    <Table stickyHeader sx={{ minWidth: 650 }} size="small" aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Product Title</TableCell>
                          <TableCell align="right">Ordered Items</TableCell>
                          <TableCell align="right">Price</TableCell>
                          <TableCell align="right">Tracking Id</TableCell>
                          <TableCell align="right">Merchant name</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {todaysReports?.records.map((row, i) => (
                          <TableRow
                            key={`${row.product_title}-${row.asin}-${i}`}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">
                              <Link
                                href={`https://www.amazon.com/dp/${row.asin}?tag=${TAG}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >{row.product_title}</Link>
                            </TableCell>
                            <TableCell align="right">{row.ordered_items}</TableCell>
                            <TableCell align="right">{formatPrice(row.price)}</TableCell>
                            <TableCell align="right">{row.tracking_id}</TableCell>
                            <TableCell align="right">{row.merchant_name}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} lg={6} >
              <Card raised>
                <CardContent>
                  <Typography variant="h5" component="div">
                    Today's Sales by Tag
                  </Typography>
                  <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                    <Table stickyHeader sx={{ minWidth: 650 }} size="small" aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Tag</TableCell>
                          <TableCell align="right">Total Items Sold</TableCell>
                          <TableCell align="right">Item Profit</TableCell>
                          <TableCell align="right">Bounty Profit</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(organizedReports.reportRowsByTag).map((row, i) => (
                          <TableRow
                            key={`${row.tag}-${i}`}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">
                              {row.tag}
                            </TableCell>
                            <TableCell align="right">{row.totalItemsPurchased}</TableCell>
                            <TableCell align="right">{formatPrice(row.profit)}</TableCell>
                            <TableCell align="right">{formatPrice(row.bountyEarnings)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </PrimarySearchAppBar>
    </div>
  );
};

export default Newtab;
