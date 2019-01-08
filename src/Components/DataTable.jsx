import React, { Component } from 'react';
import { Table, TableHead, TableBody, TableCell, TableRow, TableFooter, TablePagination } from '@material-ui/core';


export class MatchTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            columns: props.columns,
            page: 0,
            rowsPerPage: 1,
        }
    }
    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };
    render() {
        return (
            <React.Fragment>
                <Table>
                    <TableHead>
                        <TableRow>
                            {this.state.columns.map(column =>
                                <TableCell key={column}>
                                    {column}
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.data ? this.state.data
                        .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                        .map(row =>
                            <TableRow key={row.id}>
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell>{row.bet}</TableCell>
                                <TableCell>{row.status > 0 ? <span style={{ color: 'GREEN' }}>WON</span> : <span style={{ color: 'red' }}>LOST</span>}</TableCell>
                            </TableRow>
                        ) : {}}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5,10,15]}
                    component="div"
                    count={this.state.data.length}
                    rowsPerPage={this.state.rowsPerPage}
                    page={this.state.page}
                    backIconButtonProps={{
                        'aria-label': 'Previous Page',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'Next Page',
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </React.Fragment>
        )
    }
}