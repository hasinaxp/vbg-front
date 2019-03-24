import React, { Component } from 'react';
import { MainStyles, ColorPalate, myTheme } from '../Components/MainStyles';
import { MuiThemeProvider } from '@material-ui/core'

import { JsonQueryAuth, HostAddress } from '../Services/Query'
import { Navigation } from '../Components/Navigation';
import { TournamentCard } from '../Components/Cards';

import SwipeableViews from 'react-swipeable-views';
import { Grid, Typography } from '@material-ui/core';
import { Paper, Card, CardMedia, CardContent, CardActionArea } from '@material-ui/core';
import { Tab, Tabs, AppBar } from '@material-ui/core';
import { Avatar } from '@material-ui/core';
import { List, ListItem, ListSubheader, } from '@material-ui/core';
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
    load = () => {
        //do nothing
    }
    render() {
        return (
            <MuiThemeProvider theme={myTheme}>
            <div className='Tournament Page'>
                <Navigation active='tournament' load={this.load} />
                <section className='ContainerCenter'>
                    {
                        this.state.isInTournament ? <TournamentInSide tournament_id={this.state.tournament_id} /> :
                            <TournamentOutSide enterTournament={this.enterTournament} />
                    }
                </section>
            </div>
            </MuiThemeProvider>
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
                                    image={tour.image}
                                    current_available={tour.players.length}
                                    entry_fee={tour.entry_fee}
                                    custom_fields={tour.custom_fields}
                                    prize={tour.balance}
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
                                    image={tour.image}
                                    load={this.load}
                                    game={tour.game}
                                    current_available={tour.players.length}
                                    entry_fee={tour.entry_fee}
                                    custom_fields={tour.custom_fields}
                                    prize={tour.balance}
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
            rules: [],
            capacity: '',
            tabId: 0,
            image:'',
            custom_fields:[],
            is_bracket_needed:false
        }
    }
    componentDidMount() {
        this.load()
    }
    load = async () => {
        const res = await JsonQueryAuth('post', `tournament/${this.state.tournament_id}`, {})
        if (res.status = 'ok') {
            const { game, players, prize1, prize2, bet, capacity,image,is_bracket_needed} = res
            let rules = res.rules.split('\n')
            this.setState({
                game, players, prize1, prize2, bet, capacity, rules,image,is_bracket_needed
            });
            if(res.custom_fields) {
                try {
                    let custom_fields = JSON.parse(res.custom_fields);
                    this.setState({custom_fields:custom_fields});
                } catch(e) {
                }  
            }
        }
    }
    changeTab = (event, value) => {
        this.setState({ tabId: value })
    }
    handleChangeIndex = (index) => {
        // if(index >= 0 && index <= 1)
        this.setState({ tabId: index })
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
                                    image={(this.state.image && this.state.image!='') ? `${HostAddress}tournamentimg/${this.state.image}`:`${HostAddress}gameimg/${this.state.game.image}`}
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
                        <Paper style={{ ...MainStyles.paper }}>
                            <AppBar position="static" style={{ backgroundColor: '#444' }}>
                                <Tabs value={this.state.tabId} onChange={this.changeTab} indicatorColor='primary' textColor='primary'>
                                    <Tab value={0} label="INFO" style={{ color: this.state.tabId === 0 ? ColorPalate.greenLight : ColorPalate.green }} />
                                    <Tab value={1} label="RULES" style={{ color: this.state.tabId === 1 ? ColorPalate.greenLight : ColorPalate.green }} />
                                    
                                    {this.state.custom_fields.map((custom,index) => 
                                        <Tab key={custom.field_id} value={index + 2} label={custom.label_name} style={{ color: this.state.tabId === custom.field_id ? ColorPalate.greenLight : ColorPalate.green }} />
                                    )}
                                </Tabs>
                            </AppBar>
                            <SwipeableViews
                                index={this.state.tabId}
                                onChangeIndex={this.handleChangeIndex}
                            >
                            <Grid container style={{padding: 8}}>
                                <Grid item xs={12} md={5} style={{color: ColorPalate.greenLight}}>Tournament Id</Grid>
                                <Grid item xs={12} md={7} style={{color: ColorPalate.green}}>{this.state.tournament_id}</Grid>
                                <Grid item xs={12} md={5} style={{color: ColorPalate.greenLight}}>Entry Fee</Grid>
                                <Grid item xs={12} md={7} style={{color: ColorPalate.green}}>{this.state.bet} bp</Grid>
                                <Grid item xs={12} md={5} style={{color: ColorPalate.greenLight}}>First Prize</Grid>
                                <Grid item xs={12} md={7} style={{color: ColorPalate.green}}>{this.state.prize1} bp</Grid>
                                <Grid item xs={12} md={5} style={{color: ColorPalate.greenLight}}>Second Prize</Grid>
                                <Grid item xs={12} md={7} style={{color: ColorPalate.green}}>{this.state.prize2} bp</Grid>
                                <Grid item xs={12} md={5} style={{color: ColorPalate.greenLight}}>Tournament Capacity</Grid>
                                <Grid item xs={12} md={7} style={{color: ColorPalate.green}}>{this.state.capacity}</Grid>
                                <Grid item xs={12} md={5} style={{color: ColorPalate.greenLight}}>Joined players</Grid>
                                <Grid item xs={12} md={7} style={{color: ColorPalate.green}}>{this.state.players.length}</Grid>
                            </Grid>
                            <div style={{color: ColorPalate.green, padding: 8}}>
                            {this.state.rules.map( (r, i) => (<div key={i}>{r}</div>))}
                            </div>
                            {this.state.custom_fields.map((custom,index) => 
                                <div style={{color: ColorPalate.green, padding: 8}}>
                                {custom.field_value}
                                </div>
                             )}
                               
                            </SwipeableViews>
                        </Paper>
                        {this.state.is_bracket_needed !=false &&
                        <Paper style={{
                            ...MainStyles.paper, padding: 16, height: '60vh',
                            marginTop: 20, overflowX: 'auto',
                            display: 'flex', justifyContent: 'center', alignItems: 'center'
                        }}>
                        
                            <TournamentBracket tournament_id={this.props.tournament_id} />
                        
                        </Paper>
                        }
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
                    subheader={<ListSubheader component="div" style={{ color: ColorPalate.greenLight }}>Perticipating players</ListSubheader>}
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