
import React from 'react';
import { StatConfigType, formatPrice, TableChartConfigType, TAG, TagIdentifierType } from './utils';
import _ from 'lodash';
import {
    Link,
    Dialog,
    Button,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField
} from '@mui/material';

const TagLink = ({ tag, tagIdentities, setTagIdentities }: {
    tag: string;
    tagIdentities: TagIdentifierType[];
    setTagIdentities: (tagIdentities: TagIdentifierType[]) => void;
}) => {
    const [open, setOpen] = React.useState(false);
    const [label, setLabel] = React.useState('');
    const [link, setLink] = React.useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    if ((tagIdentities || []).length === 0
        || !_.find(tagIdentities, { tag })?.tag
    ) {
        return <>{tag}{` — `}<Link
            onClick={handleClickOpen}
            sx={{
                cursor: 'pointer',
            }}
        >Add details</Link>
            <React.Fragment>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        component: 'form',
                        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries((formData as any).entries());
                            const email = formJson.email;
                            console.log(email);
                            handleClose();
                        },
                    }}
                >
                    <DialogTitle>Add Tracking ID Details — {tag}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Map affiliate tracking IDs to labels and links, so you can easily see which items are earning you money.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="label"
                            name="email"
                            label="Label"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={(event) => {
                                setLabel(event.target.value);
                            }}
                            value={label}
                        />

                        <TextField
                            margin="dense"
                            id="link"
                            name="link"
                            label="Link"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={(event) => {
                                setLink(event.target.value);
                            }}
                            value={link}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit"
                            disabled={!label}
                            onClick={() => {
                                const newTagIdentities = [...tagIdentities];
                                newTagIdentities.push({
                                    tag,
                                    label,
                                    link,
                                });
                                setTagIdentities(newTagIdentities);
                                handleClose();
                            }}
                        >Add</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>

        </>;
    }

    const tagIdentity = _.find(tagIdentities, { tag });

    if (tagIdentity?.link) {

        return (
            <Link
                href={tagIdentity.link}
                target="_blank"
                rel="noopener noreferrer"
            >{tagIdentity.label}</Link>
        )
    }

    return <>{tagIdentity?.label}</>;

}

const AmazonLink = ({ row }: { row: any }) => {
    let averagePrice = 0;
    if ((row?.lines || []).length > 0) {
        // average price of lines
        averagePrice = parseFloat(Number(_.sumBy(row.lines, (line: any) => parseFloat(line.price)) / (row.lines.length || 1)).toFixed(2));
    }

    // average price to two decimal places
    averagePrice = parseFloat(averagePrice.toFixed(2));

    return (
        <>
            <Link
                href={`https://www.amazon.com/dp/${row.asin}?tag=${TAG}`}
                target="_blank"
                rel="noopener noreferrer"
            >{row.title || row.product_title}</Link>{` — `}
            <Link
                href={`https://www.jungle.deals/deal/${row.asin}${averagePrice > 0 ? `?threshold=${averagePrice + 0.01}` : ''}`}
                target="_blank"
                rel="noopener noreferrer"
            >Details</Link>
        </>
    );
}


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
                // @ts-ignore
                format: (value: string, row: any, options: {
                    tagIdentities: TagIdentifierType[];
                    setTagIdentities: (tagIdentities: TagIdentifierType[]) => void;
                }) => {
                    return (<TagLink tag={value} tagIdentities={options.tagIdentities} setTagIdentities={options.setTagIdentities} />);
                },
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
                format: (_value: string, row: any) => {
                    return <AmazonLink row={row} />
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
                format: (_value: string, row: any) => {
                    return <AmazonLink row={row} />
                },
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
                // @ts-ignore
                format: (value: string, row: any, options: {
                    tagIdentities: TagIdentifierType[];
                    setTagIdentities: (tagIdentities: TagIdentifierType[]) => void;
                }) => {
                    return (<TagLink tag={value} tagIdentities={options.tagIdentities} setTagIdentities={options.setTagIdentities} />);
                },
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
