import React, { Component } from 'react';
import { MainStyles, ColorPalate } from '../Components/MainStyles'


import { JsonQueryAuth, HostAddress, getCookie } from '../Services/Query'
import { Navigation } from '../Components/Navigation';
import { TournamentCard } from '../Components/Cards';


import { Grid, Typography, Fab, Button } from '@material-ui/core';
import { Paper, Card, CardMedia, CardContent, CardActionArea } from '@material-ui/core';
import { GridList, GridListTile, GridListTileBar } from '@material-ui/core';
import { TextField, Avatar, MenuItem } from '@material-ui/core';
import { List, ListItem,ListSubheader, ListItemText } from '@material-ui/core';
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary } from '@material-ui/core';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Slide from '@material-ui/core/Slide';

export class Tournament extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isInTournament: false,
            tournament_id: ''
        }
    }
    enterTournament = id => {
        this.setState({
            isInTournament: true,
            tournament_id: id
        })
    }
    render() {
        return (
            <div className='Tournament Page'>
                <Navigation active='tournament' />
                <section className='ContainerCenter'>
                    {
                        this.state.isInTournament ? <TournamentInSide tournament_id={this.state.tournament_id} /> :
                            <TournamentOutSide enterTournament={this.enterTournament} />
                    }
                </section>
            </div>
        )
    }
}

class TournamentOutSide extends Component {
    constructor(props) {
        super(props)
        this.state = {
            not_participating: [],
            participating: []
        }
    }
    componentDidMount() {
        this.load()
    }
    load = async () => {
        const res = await JsonQueryAuth('post', 'tournament', {})
        this.setState({
            not_participating: res.tournaments.not_participating,
            participating: res.tournaments.participating
        })
        console.log(res)
    }
    render() {
        return (
            <React.Fragment>
                <ExpansionPanel style={MainStyles.expansion} defaultExpanded>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon style={MainStyles.header} />}>
                        <Typography style={MainStyles.header}><i className="fas fa-puzzle-piece"></i> Participating tournaments</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails >
                        <Grid container spacing={16}>
                            {
                                this.state.participating.map(tour => <TournamentCard key={tour._id}
                                    isParticipating={true}
                                    player_count={tour.player_count}
                                    load={this.load}
                                    game={tour.game}
                                    enterTournament={this.props.enterTournament}
                                    tournament_id={tour._id} />)
                            }
                        </Grid>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel style={MainStyles.expansion} defaultExpanded>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon style={MainStyles.header} />}>
                        <Typography style={MainStyles.header}><i className="fas fa-gamepad"></i> New Tournaments</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Grid container spacing={16}>
                            {
                                this.state.not_participating.map(tour => <TournamentCard key={tour._id}
                                    isParticipating={false}
                                    player_count={tour.player_count}
                                    load={this.load}
                                    game={tour.game}
                                    enterTournament={this.props.enterTournament}
                                    tournament_id={tour._id} />)
                            }
                        </Grid>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </React.Fragment>
        )
    }
}

class TournamentInSide extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tournament_id: this.props.tournament_id,
            game: {},
            players: [],
            prize1: '',
            prize2: '',
            bet: '',
            capacity: ''
        }
    }
    componentDidMount() {
        this.load()
    }
    load = async () => {
        const res = await JsonQueryAuth('post', `tournament/${this.state.tournament_id}`, {})
        if (res.status = 'ok') {
            const { game, players, prize1, prize2, bet, capacity } = res
            this.setState({
                game, players, prize1, prize2, bet, capacity
            })
        }
    }
    render() {
        return (
            <React.Fragment>
                <Grid container justify='center' alignItems='center' >
                    <Grid item xs={12} md={4} container justify='center' alignItems='center' >
                        <Card style={{ width: '100%', margin: '20px' }}>
                            <CardActionArea>
                                <CardMedia
                                    style={{ height: 200 }}
                                    image={`${HostAddress}gameimg/${this.state.game.image}`}
                                    title={this.state.game.name}
                                />
                                <CardContent style={{ ...MainStyles.paper, color: ColorPalate.greenLight }}>
                                    <h2>{this.state.game.name}</h2>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                        <TournamentPlayers players={this.state.players} />
                    </Grid>
                    <Grid item xs={12} md={8} style={{ padding: 20 }}>
                        <Paper style={{ ...MainStyles.paper, padding: 16 }}>

                        </Paper>
                        <Paper style={{
                            ...MainStyles.paper, padding: 16, height: '60vh',
                            marginTop: 20, overflowX: 'auto',
                            display: 'flex', justifyContent: 'center', alignItems: 'center'
                        }}>
                            <TournamentBracket tournament_id={this.props.tournament_id} />
                        </Paper>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }
}


class TournamentBracket extends Component {
    constructor(props) {
        super(props)
        this.state = {
            bracket: [],
            rounds: []
        }
    }
    componentDidMount() {
        this.load()
    }
    load = async () => {
        const res = await JsonQueryAuth('post', `tournament/bracket/${this.props.tournament_id}`, {})
        console.log(res)
        this.setState({
            bracket: res.bracket.tree,
            rounds: res.bracket.rounds
        })
        window.$("#tournamentBracket").brackets({
            titles: this.state.rounds,
            rounds: this.state.bracket,
            color_title: 'white',
            border_color: '#666',
            color_player: 'red',
            bg_player: '#666',
            color_player_hover: 'white',
            bg_player_hover: ColorPalate.green,
            border_radius_player: '2px',
            border_radius_lines: '4px',
        });
    }
    render() {
        return (
            <React.Fragment>
                <div id='tournamentBracket'></div>
            </React.Fragment>
        );
    }
}

class TournamentPlayers extends Component {
    render() {
        return (
            <React.Fragment>
                <List style={{ ...MainStyles.paper, width: '100%', margin: '20px' }}
                subheader={<ListSubheader component="div" style={{color: ColorPalate.greenLight}}>Perticipating players</ListSubheader>}
                >
                    {this.props.players.map(player => (
                        <ListItem button key={player._id}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar
                                    alt={player.full_name}
                                    src={`${HostAddress}user/${player.folder}/${player.image}`}
                                />
                                <span style={{ textAlign: 'center', color: ColorPalate.green, marginLeft: 10 }}>{player.full_name}</span>
                            </div>
                        </ListItem>
                    ))}
                </List>
            </React.Fragment>
        )
    }
}