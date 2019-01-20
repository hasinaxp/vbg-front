import React, { Component } from 'react';

import { JsonQueryAuth, HostAddress } from '../Services/Query'

import { Table, TableHead, TableBody, TableCell, TableRow, TableFooter, TablePagination } from '@material-ui/core';


export class MatchTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            columns: ['OPPONENT', 'GAME', 'BET', 'STATUS'],
            page: 0,
            rowsPerPage: 10,
        }
    }
    componentDidMount() {
        this.load()
    }

    load = async () => {
        const res = await JsonQueryAuth('post','log', {})
        console.log(res)
        if(res.status === 'ok') {
            this.setState({
                data : res.match_results
            })
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
                                    {row.opponent.full_name}
                                </TableCell>
                                <TableCell>{row.game_name}</TableCell>
                                <TableCell>{row.bet}</TableCell>
                                <TableCell>{row.status > 0 ? <span style={{ color: 'GREEN' }}>WON</span> : <span style={{ color: 'red' }}>LOST</span>}</TableCell>
                            </TableRow>
                        ) : {}}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5,10,20]}
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


export class WalletTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transaction_log : [],
            columns: ['BP', 'Date', 'Status'],
            page: 0,
            rowsPerPage: 10,
        }
    }

    componentDidMount() {
        this.load()
    }

    load = async () => {
        const res = await JsonQueryAuth('post','wallet', {})
        console.log(res)
        if(res.status === 'ok') {
            this.setState({
                transaction_log : res.transaction_log
            })
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
                        {this.state.transaction_log ? this.state.transaction_log
                        .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                        .map(row =>
                            <TableRow key={row._id}>
                                <TableCell component="th" scope="row">
                                    {row.bp}
                                </TableCell>
                                <TableCell>{row.date}</TableCell>
                                <TableCell>{row.mode > 0 ? <span style={{ color: 'GREEN' }}>{row.text}</span> : <span style={{ color: 'red' }}>{row.text}</span>}</TableCell>
                            </TableRow>
                        ) : {}}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5,10,20]}
                    component="div"
                    count={this.state.transaction_log ? this.state.transaction_log.length : 0}
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