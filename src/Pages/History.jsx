import React, { Component } from 'react';

import { Navigation } from '../Components/Navigation';
import { MatchTable } from '../Components/DataTable';

import { Paper } from '@material-ui/core';

export class History extends Component {
    constructor(props) {
        super(props);
        this.state={
            data:[{id: 1, name:'haris', bet:20, status: -1}, {id: 2, name:'kartik', bet:100, status: 1}],
            columns:['Opponent', 'Bet', 'Status']
        }
    }
    render() {
        return(
            <div className='History Page'>
                <Navigation active='history'/>
                <section className='ContainerCenter'>
                    <Paper className='Block'>
                        <h1><i className="fas fa-chart-bar"></i> History Log</h1>
                        <MatchTable columns={this.state.columns} data={this.state.data}/>
                    </Paper>
                </section>
            </div>
        )
    }
}