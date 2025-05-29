
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/utils/constants';

interface OrderFinancial {
  id: string;
  created_at: string;
  gross_amount: number;
  vat_amount: number;
  marketplace_fee: number;
  seller_profit: number;
}

interface OrderFinancialsTableProps {
  financials: OrderFinancial[];
}

const OrderFinancialsTable: React.FC<OrderFinancialsTableProps> = ({ financials }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Order Financials</CardTitle>
      </CardHeader>
      <CardContent>
        {financials && financials.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Gross Amount</TableHead>
                  <TableHead>VAT (15%)</TableHead>
                  <TableHead>Marketplace Fee (9%)</TableHead>
                  <TableHead>Your Profit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {financials.slice(0, 10).map((financial) => (
                  <TableRow key={financial.id}>
                    <TableCell>
                      {new Date(financial.created_at).toLocaleDateString('en-ZA')}
                    </TableCell>
                    <TableCell>{formatCurrency(financial.gross_amount)}</TableCell>
                    <TableCell className="text-red-600">
                      -{formatCurrency(financial.vat_amount)}
                    </TableCell>
                    <TableCell className="text-orange-600">
                      -{formatCurrency(financial.marketplace_fee)}
                    </TableCell>
                    <TableCell className="text-green-600 font-medium">
                      {formatCurrency(financial.seller_profit)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <div className="mb-2">No completed orders yet</div>
            <div className="text-xs">Orders must be marked as "delivered" to appear here</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderFinancialsTable;
