import { StatConfigType } from './utils';

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
