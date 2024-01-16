
import React from 'react';
import { StatConfigType, formatPrice, TableChartConfigType, TAG } from './utils';
import _ from 'lodash';
import {
    Link,
} from '@mui/material';

export const SUPPORTED_TABLES_CHARTS: TableChartConfigType[] = [
    {
        id: 'reportRowsByASIN',
        name: 'Today\'s Sales by Items',
        description: 'Sales data organized by item.',
        type: 'table',
        uniqueKey: 'asin',
        collapseColumns: [
            {
                id: 'tracking_id',
                name: 'Tracking ID',
            },
            {
                id: 'merchant_name',
                name: 'Merchant',
            },
            {
                id: 'ordered_items',
                name: 'Total Items Ordered',
            },
            {
                id: 'price',
                name: 'Price',
                format: (value: number) => {
                    return formatPrice(value);
                },
                align: 'right',
            },
        ],
        columns: [
            {
                name: 'Product Title',
                id: 'title',
                sortable: true,
                format: (value: string, row: any) => {
                    return <Link
                        href={`https://www.amazon.com/dp/${row.asin}?tag=${TAG}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >{value}</Link>
                },
                align: 'left',
            },
            {
                name: 'Total Ordered',
                id: 'totalItemsPurchased',
                sortable: true,
                align: 'right',
            },
            {
                name: 'Total Sales Revenue',
                id: 'totalSalesRevenue',
                sortable: true,
                format: (value: number) => {
                    return formatPrice(value);
                },
                align: 'right',
            },
            {
                name: 'Total Profit',
                id: 'profit',
                sortable: true,
                format: (value: number) => {
                    return formatPrice(value);
                },
                align: 'right',
            },
        ],
        defaultSort: 'totalItemsPurchased',
        defaultSortDirection: 'desc',

    },
    {
        name: 'Today\'s Sales by Tracking ID',
        id: 'reportRowsByTag',
        type: 'table',
        description: 'Data organized by Tracking ID.',
        uniqueKey: 'tag',
        collapseColumns: [
            {
                id: 'product_title',
                name: 'Product Title',
                format: (value: string, row: any) => {
                    return <Link
                        href={`https://www.amazon.com/dp/${row.asin}?tag=${TAG}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >{value}</Link>
                }
            },
            {
                id: 'ordered_items',
                name: 'Total Items Ordered',
            },
            {
                id: 'price',
                name: 'Price',
                format: (value: number) => {
                    return formatPrice(value);
                },
                align: 'right',
            },
            {
                id: 'product_category',
                name: 'Product Category',
            },
            {
                id: 'merchant_name',
                name: 'Merchant',
            },
        ],
        columns: [
            {
                name: 'Tracking ID',
                id: 'tag',
                sortable: true,
                align: 'left',
            },
            {
                name: 'Total Items Ordered',
                id: 'totalItemsPurchased',
                sortable: true,
                align: 'right',
            },

            {
                name: 'Total Profit',
                id: 'totalProfit',
                sortable: true,
                format: (value: number) => {
                    return formatPrice(value);
                },
                align: 'right',
            },
            {
                name: 'Total Item Order Profit',
                id: 'profit',
                sortable: true,
                format: (value: number) => {
                    return formatPrice(value);
                },
                align: 'right',
            },
            {
                name: 'Total Bounty Earnings',
                id: 'bountyEarnings',
                sortable: true,
                format: (value: number) => {
                    return formatPrice(value);
                },
                align: 'right',
            },
            {
                name: 'Total Sales Revenue',
                id: 'totalSalesRevenue',
                sortable: true,
                format: (value: number) => {
                    return formatPrice(value);
                },
                align: 'right',
            },
        ],
        defaultSort: 'totalItemsPurchased',
        defaultSortDirection: 'desc',
    }
];


export const SUPPORTED_STATS: StatConfigType[] = [
    {
        statId: 'totalProfit',
        name: 'Daily Total Profit',
        description: 'The total profit earned today including bounties credited today AND estimated earnings from orders today.',
        statFormat: 'price'
    },
    {
        statId: 'totalSalesRevenue',
        name: 'Total Sales Revenue',
        description: 'This is the total amount spent on items ordered.',
        statFormat: 'price'
    },
    {
        statId: 'totalItemsOrdered',
        name: 'Total Items Ordered',
        description: 'This is the total amount of items ordered.',
        statFormat: 'int'
    },
    {
        statId: 'totalLineItems',
        name: 'Total Line Items',
        description: 'If you have three orders with two items each, this would be three.',
        statFormat: 'int'
    },
    {
        statId: 'totalBountyEarnings',
        name: 'Total Bounty Earnings',
        description: 'This is the total amount of bounties earned today.',
        statFormat: 'price'
    },
    {
        statId: 'numberBountyEvents',
        name: 'Total Bounty Events',
        description: 'This is how many bounties you were credited with today.',
        statFormat: 'int'
    }
];
