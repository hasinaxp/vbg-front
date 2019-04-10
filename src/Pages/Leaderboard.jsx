import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { MainStyles, ColorPalate, myTheme } from '../Components/MainStyles';
import { MuiThemeProvider } from '@material-ui/core';

import { JsonQueryAuth, HostAddress } from '../Services/Query';

import { Navigation } from '../Components/Navigation';

import { Grid } from '@material-ui/core';
import { List, ListItem, ListItemText, Avatar, ListSubheader } from '@material-ui/core';
import './Leaderboard.css'

export class Leaderboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            champions: [],
            achieves: {}
        }
    }
    componentDidMount() {
        this.load()
    }
    load = async () => {
        const res = await JsonQueryAuth('post', 'leaderboard', {})
        const { champions, achieves } = res
        this.setState({
            champions, achieves
        })
    }
    render() {
        return (
            <MuiThemeProvider theme={myTheme}>
            <div className='Leaderboard Page'>
                <Navigation active='leaderboard' load={this.load}/>
                <section className='ContainerCenter'>
                    <Grid container>
                        <List  style={{ ...MainStyles.paper, width: '100%', margin: '20px' }}
                    subheader={<ListSubheader component="div" style={{ color: ColorPalate.greenLight }}>Top Rankings</ListSubheader>}
                >              <div className="table"> 
                                
                            {
                                this.state.champions.map(champ => (
                                    
                                    <Link to={`/profileOther/${champ._id}`} key={champ._id} style={{ textDecoration: 'none', color: ColorPalate.greenLight }} className="table-row">
                                    <ListItem button>
                                    <div className="table-cell rank">
                                            {champ.rank} 
                                         </div>
                                        <div className="table-cell icon">
                                            <Avatar alt="Remy Sharp" src={`${HostAddress}${champ.img}`}
                                            style={{ width: 50, height: 50 }} />
                                        </div>
                                        <div className="table-cell playername">
                                            {champ.full_name}
                                         </div>
                                       
                                       
                                        <div className="table-cell point">
                                            <span style={{ color: ColorPalate.greenLight, fontSize: '1.2rem' }}> ({champ.leader_point} bp)</span>
                                         </div>                               
                                        
                                        <ListItemText
                                           // primary={<span style={{ color: ColorPalate.green, fontSize: '1.4rem' }}>RANK {champ.rank} | {champ.full_name}</span>}
                                           // secondary={}
                                         />
                                    </ListItem>
                                    </Link>
                                   
                                ))
                            }
                            </div>
                        </List>
                    </Grid>
                </section>
            </div>
            </MuiThemeProvider>
        );
    }
};