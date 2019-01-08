import React, { Component } from 'react';
import { MainStyles } from '../Components/MainStyles';

import { JsonQueryAuth, HostAddress, getCookie } from '../Services/Query'
import { Navigation } from '../Components/Navigation';
import { MatchCard, ChallengeCard, GameCard } from '../Components/Cards';

import { Grid, Typography, Fab, Button} from '@material-ui/core';
import { GridList, GridListTile, GridListTileBar, List, ListItem, ListItemText } from '@material-ui/core';
import { TextField, Avatar, MenuItem } from '@material-ui/core';
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary } from '@material-ui/core';
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import './Dashboard.css'


export class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            challenges: [],
            games: [],
            matches: [],
            tournamentMatches: []
        }
    }
    load = async () => {
        const res = await  JsonQueryAuth('POST', 'dashboard/', {});
        let { gamePocket, challenges, matches, feeds } = res;
        challenges = challenges.map( ch => {
            return {
                _id : ch._id,
                opponent : ch.challenger._id === getCookie('logauti') ? ch.challenged : ch.challenger,
                game : ch.game,
                bet: ch.balance,
                isChallenger : ch.challenger._id === getCookie('logauti')
            }
        });
        matches = matches.map( ch => {
            return {
                _id : ch._id,
                opponent : ch.challenger._id === getCookie('logauti') ? ch.challenged : ch.challenger,
                game : ch.game,
                bet: ch.balance,
                isTournament : ch.is_tournament
            }
        });
        this.setState({
            challenges : challenges,
            matches : matches.filter( m => !m.isTournament),
            tournamentMatches : matches.filter(m => m.isTournament),
            games : gamePocket
        })
        console.log(gamePocket);
    }
    async componentDidMount() {
        this.load()
    }

    render() {
        return (
            <div className='Dashboard Page'>
                <Navigation active='dashboard' load={this.load} />
                <section className='ContainerCenter'>
                    <ExpansionPanel style={MainStyles.expansion} defaultExpanded>
                        <ExpansionPanelSummary  expandIcon={<ExpandMoreIcon style={MainStyles.header}/>}>
                            <Typography style={MainStyles.header}><i className="fas fa-puzzle-piece"></i> Challenges</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails >
                            <Grid container spacing={16}>
                                {this.state.challenges.map(clng => <ChallengeCard key={clng._id}
                                 bet={clng.bet}
                                 game={clng.game}
                                 opponent={clng.opponent}
                                 isChallenger= {clng.isChallenger}
                                 id={clng._id}
                                 load={this.load} 
                                 />)}
                            </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel style={MainStyles.expansion} defaultExpanded>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon style={MainStyles.header}/>}>
                            <Typography style={MainStyles.header}><i className="fas fa-gamepad"></i> Challenge Matches</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Grid container spacing={16}>
                                {this.state.matches.map(m => <MatchCard key={m._id} 
                                bet={m.bet}
                                game={m.game}
                                opponent={m.opponent}
                                id={m._id}
                                />)}
                            </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel style={MainStyles.expansion} defaultExpanded>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon style={MainStyles.header}/>}>
                            <Typography style={MainStyles.header}><i className="fas fa-gamepad"></i> Tournament Matches</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Grid container spacing={16}>
                            {this.state.tournamentMatches.map(m => <MatchCard key={m._id} 
                                bet={m.bet}
                                game={m.game}
                                opponent={m.opponent}
                                id={m._id}
                                />)}
                            </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel style={MainStyles.expansion} defaultExpanded>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon style={MainStyles.header}/>}>
                            <Typography style={MainStyles.header}><i className="fas fa-dice"></i> Game Librery</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                        <Grid container spacing={16}>
                                {this.state.games.map(game => <GameCard key={game._id} game={game} />)}
                            </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel style={MainStyles.expansion} defaultExpanded>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon style={MainStyles.header}/>}>
                            <Typography style={MainStyles.header}><i className="fab fa-pushed"></i> Feeds</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                            sit amet blandit leo lobortis eget.
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </section>
            </div>
        );
    }
};