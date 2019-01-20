import React, { Component } from 'react';

import { Paper } from '@material-ui/core';

import { WalletTable } from '../Components/DataTable'
import { Navigation } from '../Components/Navigation';

export class Wallet extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <div className='Wallet Page'>
                <Navigation active='wallet'/>
                <section className='ContainerCenter'>
                    <Paper className='Block' >
                        <h1><i className="fas fa-chart-bar"></i> Wallet Log</h1>
                        <div style={{ width: '100%', overflowX: 'scroll'}}>
                        <WalletTable />
                        </div>
                    </Paper>
                </section>
            </div>
        )
    }
}