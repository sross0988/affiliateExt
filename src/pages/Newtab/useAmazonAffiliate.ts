import axios, { AxiosInstance } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { fakeRecords, fakeBounties } from './utils/mocks';

const axiosInstance: AxiosInstance = axios.create({});

export interface SaleType {
    asin: string;
    merchant_name: string;
    ordered_items: string;
    price: string;
    product_category: string;
    product_category_string_id: string;
    product_title: string;
    tracking_id: string;
    total_sales_revenue?: number;
}

export interface BountyType {
    bounty_earning_per_quantity: string;
    bounty_earnings: string;
    bounty_event_name: string;
    bounty_event_string_id: string;
    bounty_event_type: string;
    bounty_events: string;
    bounty_revenue: string;
    tag_id: string;
    tag_value: string;
}

const pad = (num: number, size: number) => {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
};

export function useGetTodaysReports(): UseQueryResult<{
    records: SaleType[];
}> {

    const queryFn = async (): Promise<{
        records: SaleType[];
    }> => {
        // if on development return mock data
        if (process.env.NODE_ENV === 'development') {
            // return mockData;
            return Promise.resolve({
                records: fakeRecords
            });
        }

        const result = await axiosInstance.get(
            `https://affiliate-program.amazon.com/home/reports/table.json?query%5Btype%5D=realtime&query%5Bstart_date%5D=2017-08-29&query%5Bend_date%5D=2017-08-29&query%5Border%5D=desc&query%5Btag_id%5D=all&query%5Bcolumns%5D=product_title%2Casin%2Cproduct_category%2Cmerchant_name%2Cordered_items%2Ctracking_id%2Cprice&query%5Bskip%5D=0&query%5Bsort%5D=day&query%5Blimit%5D=25000&store_id=beyondavatars-20`
        );

        return result.data;
    };

    return useQuery<{
        records: SaleType[];
    }>(`daily-sales`, () => queryFn(), {
        onError: () => {
            console.error('Something went wrong while fetching the live deals');
        },
        // refetch every 15 seconds
        refetchInterval: 1000 * 15
    });
}


export function useGetTodaysBounties(): UseQueryResult<{
    records: BountyType[];
}> {

    const queryFn = async (): Promise<{
        records: BountyType[];
    }> => {
        // if on development return mock data
        if (process.env.NODE_ENV === 'development') {
            // return mockData;
            return Promise.resolve({
                records: fakeBounties
            });
        }

        const month = pad(new Date().getMonth() + 1, 2);
        const day = pad(new Date().getDate(), 2);
        const year = new Date().getFullYear();

        const result = await axiosInstance.get(
            `https://affiliate-program.amazon.com/home/reports/table.json?query%5Btype%5D=bounty&query%5Bstart_date%5D=${year}-${month}-${day}&query%5Bend_date%5D=${year}-${month}-${day}&query%5Btag_id%5D=all&query%5Bcolumns%5D=bounty_event_name%2Cbounty_event_type%2Cbounty_revenue%2Ctag_value%2Cbounty_events%2Cbounty_earning_per_quantity%2Cbounty_earnings%2Ctag_id&query%5Bskip%5D=0&query%5Bsort%5D=tag_value&query%5Blimit%5D=25&query%5Blast_accessed_row_index%5D=0&store_id=beyondavatars-20`
        );

        return result.data;
    };

    return useQuery<{
        records: BountyType[];
    }>(`daily-bounties`, () => queryFn(), {
        onError: () => {
            console.error('Something went wrong while fetching the live deals');
        },
        // refetch every 15 seconds
        refetchInterval: 1000 * 15
    });
}
