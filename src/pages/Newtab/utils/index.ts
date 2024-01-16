import _ from 'lodash';
import { SaleType, BountyType } from './../useAmazonAffiliate';

export const getProfitMultiplier = (cat: string) => {
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

export const getProfitFromRows = (rows: SaleType[]) => {
    let profit = 0;

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const profitMultiplier = getProfitMultiplier(row.product_category);
        profit += (parseInt(row.ordered_items) * parseFloat(row.price) * profitMultiplier);
    }

    return profit;
}

export const calculateProfit = (rows: SummarySaleType[]) => {
    let profit = 0;

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const profitMultiplier = getProfitMultiplier(row.category);
        profit += (row.totalSalesRevenue * profitMultiplier);
    }

    return profit;
};

export const TAG = 'jd-daily-20';

export interface TagIdentifierType {
    tag: string;
    label: string;
    link?: string;
}

export interface ColumnType {
    name: string;
    id: string;
    sortable?: boolean;
    format?: (value: any, row: any, options?: {
        tagIdentities?: TagIdentifierType[];
        setTagIdentities?: (tagIdentities: TagIdentifierType[]) => void;
    }) => any;
    align?: 'left' | 'right';
}

export interface CollapseColumnType {
    name: string;
    id: string;
    format?: (value: any, row: any, options?: {
        tagIdentities?: TagIdentifierType[];
        setTagIdentities?: (tagIdentities: TagIdentifierType[]) => void;
    }) => any;
    align?: 'left' | 'right';
}

export interface TableChartConfigType {
    id: string;
    uniqueKey: string;
    name: string;
    type: string;
    columns: ColumnType[];
    defaultSort: string;
    defaultSortDirection: 'asc' | 'desc';
    description: string;
    collapseColumns?: CollapseColumnType[];
}

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
    lines: Array<SaleType | BountyType>;
}

export interface StatConfigType {
    statId: keyof OrganizedReportType;
    name: string;
    description: string;
    statFormat: 'price' | 'int';
}

export interface SummaryTagType {
    totalItemsPurchased: number;
    totalSalesRevenue: number;
    tag: string;
    profit: number;
    bountyEarnings: number;
    bountyEvents: number;
    totalProfit: number;
    lines: Array<SaleType | BountyType>;
}

export interface OrganizedReportType {
    mostPurchased: SummarySaleType | null;
    mostSalesRevenue: SaleType | null;
    totalItemsOrdered: number;
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
    numberBountyEvents: number;
    totalLineItems: number;
};

export const getOrganizedTodaysReports = (reports: SaleType[], bounties: BountyType[]) => {
    const organizedReports: OrganizedReportType = {
        mostPurchased: null,
        mostSalesRevenue: null,
        totalLineItems: 0,
        totalItemsOrdered: 0,
        totalSalesRevenue: 0,
        reportsByTag: {},
        reportsByAsin: {},
        reportRowsByASIN: [],
        reportRowsByTag: [],
        reportsByCategory: {},
        totalProfit: 0,
        totalBountyEarnings: 0,
        bounties: [],
        numberBountyEvents: 0,
    };

    organizedReports.bounties = bounties;
    organizedReports.totalLineItems = reports.length;
    organizedReports.totalItemsOrdered = reports.reduce((acc, cur) => acc + parseInt(cur.ordered_items, 10), 0);

    for (let i = 0; i < reports.length; i++) {
        const line = reports[i];
        line.total_sales_revenue = parseInt(line.ordered_items, 10) * parseFloat(line.price);

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
            lines: ([...report.lines]),
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
                bountyEvents: bountiesByTag[tag].reduce((acc, cur) => acc + parseInt(cur.bounty_events), 0),
                totalProfit: bountiesByTag[tag].reduce((acc, cur) => acc + parseFloat(cur.bounty_earnings), 0),
                lines: [...bountiesByTag[tag]],
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
            bountyEvents: bountiesByTrackingId.reduce((acc, cur) => acc + parseInt(cur.bounty_events), 0),
            totalProfit: getProfitFromRows(report.lines) + totalBountyProfit,
            lines: [...report.lines],
        });
    }


    // sort by total items purchased

    organizedReports.reportRowsByASIN = _.sortBy(organizedReports.reportRowsByASIN, (report: SummarySaleType) => report.totalItemsPurchased).reverse();
    organizedReports.totalSalesRevenue = organizedReports.reportRowsByASIN.reduce((acc, cur) => acc + cur.totalSalesRevenue, 0);
    organizedReports.mostPurchased = organizedReports.reportRowsByASIN.length > 0 ? organizedReports.reportRowsByASIN[0] : null;
    organizedReports.reportRowsByTag = _.sortBy(organizedReports.reportRowsByTag, (report: SummaryTagType) => report.totalItemsPurchased).reverse();


    organizedReports.totalBountyEarnings = bounties.reduce((acc, cur) => acc + parseFloat(cur.bounty_earnings), 0);
    organizedReports.numberBountyEvents = bounties.reduce((acc, cur) => acc + parseFloat(cur.bounty_events), 0);
    organizedReports.totalProfit = calculateProfit(organizedReports?.reportRowsByASIN) + organizedReports.totalBountyEarnings;

    return organizedReports;

}