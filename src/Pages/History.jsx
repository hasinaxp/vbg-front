import React, { Component } from 'react';

import { Navigation } from '../Components/Navigation';
import { MatchTable } from '../Components/DataTable';

import { Paper } from '@material-ui/core';

export class History extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className='History Page'>
                <Navigation active='history' />
                <section className='ContainerCenter'>
                    <Paper className='Block'>
                        <h1><i className="fas fa-chart-bar"></i> History Log</h1>
                        <div style={{ width: '100%', overflowX: 'scroll' }}>
                            <MatchTable />
                        </div>

                    </Paper>
                </section>
            </div>
        )
    }
}