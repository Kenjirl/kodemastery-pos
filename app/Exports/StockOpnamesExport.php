<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class StockOpnamesExport implements FromArray, WithHeadings
{
    protected $stockOpnames;

    public function __construct($stockOpnames)
    {
        $this->stockOpnames = $stockOpnames;
    }

    /**
     * Define the headings for the Excel file.
     *
     * @return array
     */
    public function headings(): array
    {
        return [
            'No.',
            'Date',
            'Status',
            'Product Name',
            'Physical Quantity',
            'System Quantity',
            'Quantity Difference',
        ];
    }

    /**
     * Format data for export.
     *
     * @return array
     */
    public function array(): array
    {
        $data = [];
        $row = 1;

        foreach ($this->stockOpnames as $stockOpname) {
            foreach ($stockOpname->details as $detail) {
                $data[] = [
                    $row++,
                    $stockOpname->opname_date,
                    ucfirst($stockOpname->status),
                    $detail->product->name ?? 'No product',
                    $detail->physical_quantity ?? 0,
                    $detail->stockTotal->total_stock ?? 0,
                    $detail->quantity_difference ?? 0,
                ];
            }
        }

        return $data;
    }
}
