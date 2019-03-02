import React, { Component } from 'react';
import { myTheme, ColorPalate } from '../Components/MainStyles';
import { MuiThemeProvider } from '@material-ui/core'

import { Navigation } from '../Components/Navigation';
import { MatchTable } from '../Components/DataTable';

import { Paper } from '@material-ui/core';

export class History extends Component {

    render() {
        return (
            <MuiThemeProvider theme={myTheme}>
            <div className='History Page'>
                <Navigation active='history' />
                <section className='ContainerCenter'>
                    <Paper className='Block'>
                        <h1 style={{color: ColorPalate.green}}><i className="fas fa-chart-bar"></i> History Log</h1>
                        <div style={{ width: '100%', overflowX: 'scroll' }}>
                            <MatchTable />
                        </div>

                    </Paper>
                </section>
            </div>
            </MuiThemeProvider>
        )
    }
}