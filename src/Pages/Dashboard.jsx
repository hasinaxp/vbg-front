import React, { Component } from 'react';
import { MainStyles, myTheme } from '../Components/MainStyles';
import { MuiThemeProvider } from '@material-ui/core'

import { JsonQueryAuth, HostAddress, getCookie } from '../Services/Query'
import { Navigation } from '../Components/Navigation';
import { MatchCard, ChallengeCard, GameCard } from '../Components/Cards';

import { Grid, Typography, Button } from '@material-ui/core';
import { GridList, GridListTile, GridListTileBar } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary } from '@material-ui/core';
import { Dialog, DialogTitle, DialogContent} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Slide from '@material-ui/core/Slide';
import './Dashboard.css'

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isgameSelect: false,
            isAddGame: false,
            addGames: [],
            challenges: [],
            gameList: [],
            games: [],
            matches: [],
            tournamentMatches: [],
            game_id: '',
            game_requirement: '',
            contact_string: ''
        }
    }
    componentDidMount() {
        document.body.classList.remove('body-a')
        this.load()
    }

    handleChange = name => e => {
        this.setState({
            [name]: e.target.value
        })
    }
    load = async () => {
        const res = await JsonQueryAuth('POST', 'dashboard/', {});
        let { gamePocket, gameList, challenges, matches, feeds } = res;
        challenges = challenges.map(ch => {
            return {
                _id: ch._id,
                opponent: ch.challenger._id === getCookie('logauti') ? ch.challenged : ch.challenger,
                game: ch.game,
                bet: ch.balance,
                isChallenger: ch.challenger._id === getCookie('logauti')
            }
        });
        matches = matches.map(ch => {
            return {
                _id: ch._id,
                opponent: ch.challenger._id === getCookie('logauti') ? ch.challenged : ch.challenger,
                game: ch.game,
                bet: ch.balance,
                isTournament: ch.is_tournament
            }
        });
        this.setState({
            challenges: challenges,
            matches: matches.filter(m => !m.isTournament),
            tournamentMatches: matches.filter(m => m.isTournament),
            games: gamePocket,
            gameList: gameList
        });
        console.log(this.state.games);
    }
    toggleAddGame = () => {
        this.setState({
            isAddGame: !this.state.isAddGame,
            isgameSelect: true,
        })
    }
    gameSelect = (id, r) => e => {
        this.setState({
            isgameSelect: false,
            game_id: id,
            game_requirement: r
        })
    }
    addGameSubmit = async e =>{
        e.preventDefault()
        const { game_id, contact_string } = this.state
        const res = await JsonQueryAuth('post', 'dashboard/game/add', { game_id, contact_string})
        if(res.errors) {
            //console.log(res.errors)
        }else if(res.status === 'ok') {
            //alert('game added succenssfully')
            this.toggleAddGame()
            this.load()
        }else if(res.status === 'fail') {
            alert(res.msg);
        }
    }
    

    render() {
        let content;
        if (this.state.isgameSelect) {
            content = (<GridList cellHeight={200} style={MainStyles.gridList}>
                {this.state.gameList.map(g => (
                    <GridListTile key={g._id}
                        cols={window.innerWidth < 600 ? 2 : 1}
                        onClick={this.gameSelect(g._id, g.requirement)}>
                        <img src={`${HostAddress}gameimg/${g.image}`} alt={'data.name'} />
                        <GridListTileBar
                            title={g.name}
                            subtitle={<span>Platform: {g.platform === 0 ? 'mobile' : 'PC'}</span>}
                        />
                    </GridListTile>
                ))
                }
            </GridList>)
        } else {
            content = (
                <form onSubmit={this.addGameSubmit}>
                    <div>
                        <TextField
                            autoComplete="off"
                            id="outlined-search"
                            label={this.state.game_requirement}
                            margin="normal"
                            variant="outlined"
                            onChange={this.handleChange('contact_string')}
                            style={{ width: window.innerWidth < 600 ? 'auto' : 400 }}
                        />
                    </div>
                    <Button style={{color: '#157'}} type='submit'>
                        add Game
                    </Button>
                </form>
            )
        }

        return (
            <MuiThemeProvider theme={myTheme}>
            <div className='Dashboard Page'>
                <Navigation active='dashboard' load={this.load} />
                <section className='ContainerCenter'>
                    <ExpansionPanel style={MainStyles.expansion} defaultExpanded>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon style={MainStyles.header} />}>
                            <Typography style={MainStyles.header}><i className="fas fa-puzzle-piece"></i> Challenges</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails >
                            <Grid container spacing={16}>
                                {this.state.challenges.map(clng => <ChallengeCard key={clng._id}
                                    bet={clng.bet}
                                    game={clng.game}
                                    opponent={clng.opponent}
                                    isChallenger={clng.isChallenger}
                                    id={clng._id}
                                    load={this.load}
                                />)}
                            </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel style={MainStyles.expansion} defaultExpanded>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon style={MainStyles.header} />}>
                            <Typography style={MainStyles.header}><i className="fas fa-gamepad"></i> Challenge Matches</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Grid container spacing={16}>
                                {this.state.matches.map(m => <MatchCard key={m._id}
                                    bet={m.bet}
                                    game={m.game}
                                    opponent={m.opponent}
                                    id={m._id}
                                    history={this.props.history}
                                />)}
                            </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel style={MainStyles.expansion} defaultExpanded>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon style={MainStyles.header} />}>
                            <Typography style={MainStyles.header}><i className="fas fa-gamepad"></i> Tournament Matches</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Grid container spacing={16}>
                                {this.state.tournamentMatches.map(m => <MatchCard key={m._id}
                                    bet={m.bet}
                                    game={m.game}
                                    opponent={m.opponent}
                                    image={m.image}
                                    id={m._id}
                                    image={m.image}
                                    history={this.props.history}
                                />)}
                            </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel style={MainStyles.expansion} defaultExpanded>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon style={MainStyles.header} />}>
                            <Typography style={MainStyles.header}><i className="fas fa-dice"></i> Game Librery</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Grid container spacing={16}>
                                {this.state.games.map(game => <GameCard key={game._id} game={game} load={this.load} />)}
                                <Grid item xs={12}>
                                    <Button style={{ ...MainStyles.header, width: '100%' }} onClick={this.toggleAddGame}>
                                        Add game
                                    </Button>
                                </Grid>
                            </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel style={MainStyles.expansion} defaultExpanded>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon style={MainStyles.header} />}>
                            <Typography style={MainStyles.header}><i className="fab fa-pushed"></i> Feeds</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                            sit amet blandit leo lobortis eget.
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </section>
                <Dialog
                    open={this.state.isAddGame}
                    onClose={this.toggleAddGame}
                    TransitionComponent={Transition}
                    keepMounted>
                    <DialogTitle>Games</DialogTitle>
                    <DialogContent>
                        <div>
                            {content}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            </MuiThemeProvider>
        );
    }
};