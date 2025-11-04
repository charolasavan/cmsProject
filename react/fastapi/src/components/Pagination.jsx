import React from 'react'
import { TablePagination } from '@mui/material';


export default function Pagination({ count, page, onPageChange, rowsPerPage, onRowsPerPageChange }) {
    return (
        <div>
            <TablePagination
                component="div"
                count={count}
                page={page}
                onPageChange={onPageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={onRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 25]}  // Options for rows per page
            />
        </div>
    )
}
