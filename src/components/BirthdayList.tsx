import React from 'react';
import PropTypes from 'prop-types';
import LoadingButton from '@mui/lab/LoadingButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';

import IconButton from '@mui/material/IconButton';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import { Dayjs } from "dayjs";
import { getFormattedDate } from "../helper";
import { TextField } from "@mui/material";

function BirthdayList({currentDate, birthdays, addFavorite, removeFavorite, ...props}: BirthdayListProps) {
    const [page, setPage] = React.useState(0);
    const [rows, setRows] = React.useState(birthdays)
    const rowsPerPage = 5;
    const [searched, setSearched] = React.useState<string>("");

    /**
     * Event handler for change of page
     * @param event 
     * @param newPage 
     */
    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    /**
     * Resetting fields upon change of original rows
     */
    React.useEffect(() => {
        setRows(birthdays)
        setPage(0)
        setSearched('')
    }, [birthdays])

    /**
     * event handler for filtering rows out based on searched value.
     * @param searchedVal 
     */
    const requestSearch = (searchedVal: any) => {
        const filteredRows = birthdays.filter((row) => {
          return row.text.toLowerCase().includes(searchedVal.toLowerCase());
        });
        setPage(0)
        setRows(filteredRows);
    };

    return (
        <>
            <h5>Birthdays on {getFormattedDate(currentDate)}</h5>
            {
                rows && rows.length > 0 ?
                <>
                    <TextField
                        fullWidth
                        label="Search"
                        aria-placeholder="Search"
                        value={searched}
                        variant="filled"
                        size="small"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setSearched(event.target.value)
                            requestSearch(event.target.value);
                        }}
                    />
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: '90%' }} size="small" aria-label="birthday list table">
                            <TableBody>
                                {(rowsPerPage > 0
                                    ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : rows
                                ).map((row, idx) => (
                                    <TableRow
                                    key={row.text}
                                    role='birthdayRow'
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.text}
                                        </TableCell>
                                        <TableCell>{row.year}</TableCell>
                                        <TableCell>
                                            {
                                                row.fav ?
                                                <IconButton size="small" data-testid={`favorite`} aria-label="favorite" color="primary"
                                                onClick={()=> removeFavorite(row)}>
                                                    <Favorite />
                                                </IconButton>:
                                                <IconButton size="small" data-testid={`favorite border`} aria-label="favorite border" color="primary"
                                                onClick={()=> addFavorite(row)}>
                                                    <FavoriteBorder />
                                                </IconButton>
                                            }
                                            
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5]}
                                    colSpan={3}
                                    count={rows.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        inputProps: {
                                        'aria-label': 'rows per page',
                                        },
                                        native: true,
                                    }}
                                    onPageChange={handleChangePage}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </>:
                <LoadingButton
                    size="small"
                    loading={true}
                    loadingIndicator="Loading…"
                    variant="contained"
                    aria-pressed="true"
                ><span>Loading...</span></LoadingButton> 
            }
        </>
    );
}

const propTypes = {
    currentDate: PropTypes.instanceOf(Dayjs),
    birthdays: PropTypes.array.isRequired,
    addFavorite: PropTypes.func.isRequired,
    removeFavorite: PropTypes.func.isRequired
}
type BirthdayListProps = PropTypes.InferProps<typeof propTypes>;


export default BirthdayList;
