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
import { useGetTodaysReports, useGetTodaysBounties, SaleType, BountyType } from './useAmazonAffiliate';
// import logo from '../../assets/img/logo.svg';
import PrimarySearchAppBar from './app';
import './Newtab.css';
import './Newtab.scss';
import useLocalStorage from './useLocalStorage';

const TAG = 'jd-daily-20';

const getProfitMultiplier = (cat: string) => {
  switch (cat) {
    case "Clothing &amp; Accessories":
    case "Beauty &amp; Grooming":
    case "Jewelry":
    case "Kindle Hardware":
    case "Luggage":
    case "Luxury Beauty":
    case "Prime Exclusive Phones":
    case "Watches":
    case "Clothing &amp; Accessories":
    case "Clothing & Accessories":
      return 0.03;
    case "Electronics":
    case "Office Products":
    case "Industrial &amp; Scientific":
    case "Industrial & Scientific":
    case "Amazon Instant Video":
    case "Health &amp; Personal Care":
    case "Health & Personal Care":
    case "Books":
    case "Toys &amp; Games":
    case "Toys & Games":
    case "Other Gift Card Brands":
    case "Health &amp; Household":
    case "Health & Household":
    case "Grocery & Gourmet Food":
    case "Grocery &amp; Gourmet Food":
    case "Electronic Components &amp; Home Audio":
    case "Prime Pantry":
    case "Gift Card":
    case "Amazon Gift Cards":
      return 0.01;
    case "Computers, Tablets &amp; Components":
    case "TV":
    case "Video Games":
      return 0.0025;
    case "Amazon Fresh":
    case "Kindle Unlimited Memberships":
    case "Wine, Spirits &amp; Beer":
      return 0;
    default:
      return 0.02;
  }
};

const getProfitFromRows = (rows: SaleType[]) => {
  let profit = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const profitMultiplier = getProfitMultiplier(row.product_category);
    profit += (parseInt(row.ordered_items) * parseFloat(row.price) * profitMultiplier);
  }

  return profit;
}

const calculateProfit = (rows: SummarySaleType[]) => {
  let profit = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const profitMultiplier = getProfitMultiplier(row.category);
    profit += (row.totalSalesRevenue * profitMultiplier);
  }

  return profit;
};

export const formatPrice = (pricePassed: number | string): string => {
  const price = Number(pricePassed);
  if (Number.isNaN(price) || !price?.toFixed) return '';
  if (price <= 0.995) {
    const centPrice = Math.round(100 * Number(price.toFixed(2)));
    return `${centPrice}¢`;
  }
  return `$${price.toFixed(2)}`;
};

export interface SummarySaleType {
  totalItemsPurchased: number;
  totalSalesRevenue: number;
  title: string;
  asin: string;
  category: string;
  profit: number;
}

export interface SummaryTagType {
  totalItemsPurchased: number;
  totalSalesRevenue: number;
  tag: string;
  profit: number;
  bountyEarnings: number;
  bountyEvents: number;
}

const getOrganizedTodaysReports = (reports: SaleType[], bounties: BountyType[]) => {
  const organizedReports: {
    mostPurchased: SummarySaleType | null;
    mostSalesRevenue: SaleType | null;
    totalSalesLines: number;
    totalItemsPurchased: number;
    totalSalesRevenue: number;
    reportsByTag: {
      [tag: string]: {
        totalItemsPurchased: number;
        totalSalesRevenue: number;
        lines: SaleType[];
      };
    };
    reportsByAsin: {
      [asin: string]: {
        totalItemsPurchased: number;
        totalSalesRevenue: number;
        lines: SaleType[];
        title: string;
        asin: string;
      };
    };
    reportsByCategory: {
      [asin: string]: {
        totalItemsPurchased: number;
        totalSalesRevenue: number;
        lines: SaleType[];
      };
    };
    reportRowsByASIN: SummarySaleType[];
    reportRowsByTag: SummaryTagType[];
    totalProfit: number;
    totalBountyEarnings: number;
    bounties: BountyType[];
  } = {
    mostPurchased: null,
    mostSalesRevenue: null,
    totalSalesLines: 0,
    totalItemsPurchased: 0,
    totalSalesRevenue: 0,
    reportsByTag: {},
    reportsByAsin: {},
    reportRowsByASIN: [],
    reportRowsByTag: [],
    reportsByCategory: {},
    totalProfit: 0,
    totalBountyEarnings: 0,
    bounties: [],
  };

  organizedReports.bounties = bounties;
  organizedReports.totalSalesLines = reports.length;
  organizedReports.totalItemsPurchased = reports.reduce((acc, cur) => acc + parseInt(cur.ordered_items, 10), 0);

  for (let i = 0; i < reports.length; i++) {
    const line = reports[i];

    // reports by tag logic
    const tag = line.tracking_id;

    if (organizedReports.reportsByTag[tag]) {
      organizedReports.reportsByTag[tag].lines.push(line);
      organizedReports.reportsByTag[tag].totalItemsPurchased += parseInt(line.ordered_items, 10);
      organizedReports.reportsByTag[tag].totalSalesRevenue += (parseInt(line.ordered_items) * parseFloat(line.price));
    } else {
      organizedReports.reportsByTag[tag] = {
        totalItemsPurchased: parseInt(line.ordered_items),
        totalSalesRevenue: parseInt(line.ordered_items) * parseFloat(line.price),
        lines: [line],
      };
    }

    const asin = line.asin;

    if (organizedReports.reportsByAsin[asin]) {
      organizedReports.reportsByAsin[asin].lines.push(line);
      organizedReports.reportsByAsin[asin].totalItemsPurchased += parseInt(line.ordered_items, 10);
      organizedReports.reportsByAsin[asin].totalSalesRevenue += (parseInt(line.ordered_items) * parseFloat(line.price));
    } else {
      organizedReports.reportsByAsin[asin] = {
        totalItemsPurchased: parseInt(line.ordered_items),
        totalSalesRevenue: parseInt(line.ordered_items) * parseFloat(line.price),
        title: line.product_title,
        lines: [line],
        asin,
      };
    }

    const category = line.product_category;

    if (organizedReports.reportsByCategory[category]) {
      organizedReports.reportsByCategory[category].lines.push(line);
      organizedReports.reportsByCategory[category].totalItemsPurchased += parseInt(line.ordered_items, 10);
      organizedReports.reportsByCategory[category].totalSalesRevenue += (parseInt(line.ordered_items) * parseFloat(line.price));
    } else {
      organizedReports.reportsByCategory[category] = {
        totalItemsPurchased: parseInt(line.ordered_items),
        totalSalesRevenue: parseInt(line.ordered_items) * parseFloat(line.price),
        lines: [line],
      };
    }

    // sort reports by asin by total items purchased
    const sortedReportsByAsin = _.sortBy(Object.values(organizedReports.reportsByAsin), (report: {
      totalItemsPurchased: number;
    }) => report.totalItemsPurchased).reverse();

    // @ts-ignore
    organizedReports.mostPurchased = sortedReportsByAsin.length > 0 ? sortedReportsByAsin[0] : null;


  }


  // sort reports by asin by total sales revenue
  for (let i = 0; i < Object.values(organizedReports.reportsByAsin).length; i++) {
    const report = Object.values(organizedReports.reportsByAsin)[i];

    organizedReports.reportRowsByASIN.push({
      totalSalesRevenue: report.totalSalesRevenue,
      totalItemsPurchased: report.totalItemsPurchased,
      title: report.title,
      asin: report.asin,
      category: report.lines[0].product_category,
      profit: report.totalSalesRevenue * getProfitMultiplier(report.lines[0].product_category),
    });
  }

  // if there's any bounties that don't have a tag, add them to the reportRowsByTag
  const reportRowTags = Object.keys(organizedReports.reportsByTag);

  // group bounties by their tags

  const bountiesByTag = _.groupBy(bounties, (bounty) => bounty.tag_value);

  for (let i = 0; i < Object.keys(bountiesByTag).length; i++) {
    const tag = Object.keys(bountiesByTag)[i];
    if (!reportRowTags.includes(tag)) {
      organizedReports.reportRowsByTag.push({
        totalSalesRevenue: 0,
        totalItemsPurchased: 0,
        tag,
        profit: 0,
        bountyEarnings: bountiesByTag[tag].reduce((acc, cur) => acc + parseFloat(cur.bounty_earnings), 0),
        bountyEvents: bountiesByTag[tag].length,
      });
    }
  }

  // report rows by tag
  for (let i = 0; i < Object.values(organizedReports.reportsByTag).length; i++) {
    const report = Object.values(organizedReports.reportsByTag)[i];
    const theTag = report.lines[0].tracking_id;

    // get bounty earnings by tracking_id
    const bountiesByTrackingId = (organizedReports.bounties).filter((bounty) => bounty.tag_value === theTag);
    const totalBountyProfit = bountiesByTrackingId.reduce((acc, cur) => acc + parseFloat(cur.bounty_earnings), 0);

    organizedReports.reportRowsByTag.push({
      totalSalesRevenue: report.totalSalesRevenue,
      totalItemsPurchased: report.totalItemsPurchased,
      profit: getProfitFromRows(report.lines),
      tag: report.lines[0].tracking_id,
      bountyEarnings: totalBountyProfit,
      bountyEvents: bountiesByTrackingId.length,
    });
  }


  // sort by total items purchased

  organizedReports.reportRowsByASIN = _.sortBy(organizedReports.reportRowsByASIN, (report: SummarySaleType) => report.totalItemsPurchased).reverse();
  organizedReports.totalSalesRevenue = organizedReports.reportRowsByASIN.reduce((acc, cur) => acc + cur.totalSalesRevenue, 0);
  organizedReports.mostPurchased = organizedReports.reportRowsByASIN.length > 0 ? organizedReports.reportRowsByASIN[0] : null;
  organizedReports.reportRowsByTag = _.sortBy(organizedReports.reportRowsByTag, (report: SummaryTagType) => report.totalItemsPurchased).reverse();


  organizedReports.totalBountyEarnings = bounties.reduce((acc, cur) => acc + parseFloat(cur.bounty_earnings), 0);
  organizedReports.totalProfit = calculateProfit(organizedReports?.reportRowsByASIN) + organizedReports.totalBountyEarnings;

  return organizedReports;

}

const Newtab = () => {
  const [hideData] = useLocalStorage('hideData', false);
  const { data: todaysReports, isLoading: isLoadingReports } = useGetTodaysReports();
  const { data: todaysBounties, isLoading: isLoadingBounties } = useGetTodaysBounties();
  const organizedReports = getOrganizedTodaysReports(todaysReports?.records || [], todaysBounties?.records || []);
  const isLoading = isLoadingReports || isLoadingBounties;

  const hide = isLoadingReports || isLoadingBounties || hideData;

  return (
    <div className="App">
      <PrimarySearchAppBar>
        <Box sx={{
          margin: '1rem'
        }}>
          <Grid container spacing={2} >
            <Grid item xs={12} sm={6} md={6} lg={3} >
              <Card
                raised
              >
                <CardContent sx={{
                  minHeight: '128px',
                }}>
                  {!isLoading ? <>
                    <Typography variant="h5" component="div">
                      Total Profit
                    </Typography>
                    <Typography variant="h3" component="div">
                      {formatPrice(organizedReports?.totalProfit)}
                    </Typography>
                  </> : <CircularProgress />}
                </CardContent>

              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3} >
              <Card
                raised
              >
                <CardContent sx={{
                  minHeight: '128px',
                }}>
                  {!isLoading ? <>
                    <Typography variant="h5" component="div">
                      Total Sales Revenue
                    </Typography>
                    <Typography variant="h3" component="div">
                      {formatPrice(organizedReports?.totalSalesRevenue)}
                    </Typography>
                  </> : <CircularProgress />}
                </CardContent>

              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3} >
              <Card
                raised
              >
                <CardContent sx={{
                  minHeight: '128px',
                }}>
                  {!isLoading ? <>
                    <Typography variant="h5" component="div">
                      Total Items Sold
                    </Typography>
                    <Typography variant="h3" component="div">
                      {organizedReports?.totalItemsPurchased || 0}
                    </Typography>
                  </> : <CircularProgress />}
                </CardContent>

              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3} >
              <Card
                raised
              >
                <CardContent sx={{
                  minHeight: '128px',
                }}>
                  {!isLoading ? <>
                    <Typography variant="h5" component="div">
                      Total Sales Lines
                    </Typography>
                    <Typography variant="h3" component="div">
                      {organizedReports?.totalSalesLines || 0}
                    </Typography>
                  </> : <CircularProgress />}
                </CardContent>
              </Card>
            </Grid>
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
