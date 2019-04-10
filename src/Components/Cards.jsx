import React, { Component } from 'react';
import { ColorPalate } from './MainStyles';

import { JsonQueryAuth, HostAddress } from '../Services/Query';
import { Grid, Button,TextField,Slide } from '@material-ui/core';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import styles from './Cards.module.css';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}
export class ChallengeCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            opponent: this.props.opponent,
            game: this.props.game,
            bet: this.props.bet,
            isChallenger: this.props.isChallenger
        }
    }
    toggleChallenge = () => {
        this.setState({
            isOpen: !this.state.isOpen,
        })
    }
    acceptChallenge = async () => {
        const res = await JsonQueryAuth('POST', 'dashboard/game/challange/accept', { match_id: this.props.id })
        console.log(res);
        if (res.status === 'ok') {
            this.props.load();
            this.toggleChallenge();
        }
        else {
            alert(res.errors[0]);
        }
    }
    cancelChallenge = async () => {
        const res = await JsonQueryAuth('POST', 'dashboard/game/challange/decline', { match_id: this.props.id })
        if (res.status === 'ok') {
            this.props.load();
            this.toggleChallenge();
        }
        else {
            alert(res.errors[0]);
        }
    }

    render() {
        return (
            <React.Fragment>
                <Grid item container xs={12} md={4} justify='center' alignItems='center' style={{ marginBottom: 8 }}>
                    <div className={`${styles.torurmantBet} animated bounceInRight`} onClick={this.toggleChallenge}>
                        <div  className={`${styles.torurmant} ${styles.clearfix}`} >
                            <div  className={`${styles.gameitem} `}>
                                <img src={`${HostAddress}gameimg/${this.state.game.image}`} alt='game'/>
                                <h4>Me</h4>                
                            </div>
                            <div  className={`${styles.gameitem} ${styles.vs}`}>
                            <h4>Bet</h4>
                        </div>
                            <div  className={`${styles.gameitem} `}>
                                <img src={`${HostAddress}${this.state.opponent.image}`} alt='opponent' />
                                <h4>{this.state.opponent.full_name}</h4>
                            </div>
                        </div>
                        <div className={`${styles.torurmantDes}`}>
                             <h4>{this.state.game.name}</h4>
                             <h5>Bet: {this.state.bet} BP</h5>                              
                    </div>
                    </div>
                </Grid>
                <Dialog open={this.state.isOpen} onClose={this.toggleChallenge}>
                    <DialogTitle>I want to</DialogTitle>
                    <DialogContent>
                        Choose the type of action you want.
                    </DialogContent>
                    <DialogActions>
                        {!this.state.isChallenger ? <Button onClick={this.acceptChallenge} style={{ color: 'green', fontWeight: 'bolder' }}>Accept Challenge</Button> : ''}
                        <Button onClick={this.cancelChallenge} style={{ color: 'red', fontWeight: 'bolder' }}>Cancel Challenge</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        )
    }
}



export class MatchCard extends Component {
    redirect = id => async e => {
        this.props.history.push(`/match/${id}`)
    }
    render() {
        const { id, bet, game, opponent } = this.props
        return (
            <Grid item container xs={12} md={4} lg={4} justify='center' alignItems='center' style={{ marginBottom: 8 }} >
                <div className={`${styles.torurmantBet} animated bounceInLeft`} onClick={this.redirect(id)}>
                    <div  className={`${styles.torurmant} ${styles.clearfix}`} >
                        <div  className={`${styles.gameitem} `}>
                            <img src={`${HostAddress}gameimg/${game.image}`} />
                            <h4>Me</h4>
                        </div>
                        <div  className={`${styles.gameitem} ${styles.vs}`}>
                            <h4>Vs</h4>
                        </div>
                        <div className={`${styles.gameitem} `}>
                            <img src={`${HostAddress}${opponent.image}`} />
                            <h4>{opponent.full_name}</h4>
                        </div>
                    </div>
                    <div className={`${styles.torurmantDes}`}>
                        <h4>{game.name}</h4>
                        <h5>BP :- {bet} BP</h5>
                    </div>
                </div>
            </Grid>
        )
    }
}

export class TournamentCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            game: this.props.game,
            isParticipating: this.props.isParticipating,
            player_count: this.props.player_count,
            tournament_id: this.props.tournament_id,
            image:this.props.image,
            current_available:this.props.current_available,
            entry_fee:this.props.entry_fee,
            prize:this.props.prize,
            tournament_name:this.props.tournament_name,
            isguest:this.props.isguest || false
        }
       
    }
    toggleJoin = () => {
        if(!this.state.isguest) {
            if (!this.state.isParticipating)
                this.setState({
                    isOpen: !this.state.isOpen,
                })
            else {
                this.props.enterTournament(this.state.tournament_id)
            }
        } else {
            this.props.onClick();
        }
    }
    viewTournament = (tournament_id) => {
        this.props.enterTournament(tournament_id)
    }
    joinTournament = id => async e => {
        console.log(id)
        const res = await JsonQueryAuth('post', `tournament/join/`, { tournament_id: this.state.tournament_id })
        if (res.status === 'ok') {
            this.props.load()
        } else {
            this.toggleJoin();
            alert("Tournament is not valid");
        }
    }

    render() {

        // if(this.props.custom_fields) {
        //     try {
        //         var custom_fields = JSON.parse(this.props.custom_fields);
        //     } catch(e) {
        //         var custom_fields = [];
        //     }
        // } else {
        //     var custom_fields = [];
        // }
        return (
            <React.Fragment>
                <Grid item container xs={12} md={4} lg={4} justify='center' alignItems='center' style={{ marginBottom: 8 }} >
                    <div className={styles.gameCard} onClick={this.toggleJoin}>
                        <div>
                            <img src={(this.props.image && this.props.image!='') ? `${HostAddress}tournamentimg/${this.props.image}`:`${HostAddress}gameimg/${this.props.game.image}`} style={{width: '100%',maxHeight:135,minHeight:135}} />
                       </div>
                        <div  className={styles.gameCardOn}>
                        <h1>{this.props.tournament_name || this.props.game.name}  </h1>
                        
                        <h3 className={`${styles.priceConsole} ${styles.clearfix}`}>
                            <div className={styles.firstpart}>
                             <strong>Console:- </strong>  {this.props.game.platform ? 'mobile game ' : 'pc game'}
                           </div>
                           <div className={styles.secondpart}>
                                     <strong>Slot:- </strong> {this.props.current_available + '/' +this.props.player_count }
                            </div>
                        </h3>
                        <h3 className={`${styles.priceConsole} ${styles.clearfix}`}>
                            <div className={styles.firstpart}>
                                <strong>Prize:- </strong> {this.props.prize || ' - '} 
                            </div>
                            <div className={styles.secondpart}>
                            <strong>Entry:- </strong>  {this.props.entry_fee || 'Free' }
                            </div>
                        </h3>
                        {/* {custom_fields.map((custom,index) =>
                            <h2 key={custom.field_id}>{custom.label_name} : {custom.field_value }</h2>                        
                        )} */}
                         </div>
                    </div>
                </Grid>
                <Dialog open={this.state.isOpen} onClose={this.toggleJoin}>
                    <DialogTitle>Join Tournament</DialogTitle>
                    <DialogContent>
                        Do you want to join this tournament?
                    </DialogContent>
                    <DialogActions>
                        <Button style={{ color: ColorPalate.green, fontWeight: 'bolder' }} onClick={this.joinTournament(this.props.tournament_id)}>
                            Join
                        </Button>
                        <Button style={{ color: ColorPalate.green, fontWeight: 'bolder' }} onClick={(e) => this.viewTournament(this.props.tournament_id)}>
                            Show Details
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        )
    }
}



export class GameCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            game: this.props.game,
            isAddGame:false,
            contact_string:this.props.game.contact_string
        };;
    }
    toggleGame = () => {
        this.setState({
            isOpen: !this.state.isOpen,
        })
    }
    removeGame = id => async e => {
        console.log(id)
        const res = await JsonQueryAuth('get', `dashboard/game/remove/${id}`)
        if (res.status === 'ok')
            this.props.load()
    }
    toggleAddGame = () => {
        this.toggleGame();
        this.setState({
            isAddGame: !this.state.isAddGame,
        })
    }
    handleChange = name => e => {
        this.setState({
            [name]: e.target.value
        })
    }
    addGameSubmit = async e =>{
        e.preventDefault()
        const {contact_string } = this.state;
        var game_id = this.props.game._id;
        const res = await JsonQueryAuth('post', 'dashboard/game/updateid', { game_id, contact_string})
        if(res.errors) {
            //console.log(res.errors)
        }else if(res.status === 'ok') {
            alert('gameid updated succenssfully')
            this.setState({
                isAddGame: !this.state.isAddGame,
            });
        }else if(res.status === 'fail') {
            alert(res.msg);
        }
    }
    render() {
        let content;
        console.log('-------------');
        console.log(this.props.game);
        content = (
            <form onSubmit={this.addGameSubmit}>
                <div>
                    <TextField
                        autoComplete="off"
                        id="outlined-search"
                        label={this.props.game.requirement}
                        margin="normal"
                        variant="outlined"
                        value={this.state.contact_string}
                        onChange={this.handleChange('contact_string')}
                        style={{ width: window.innerWidth < 600 ? 'auto' : 400 }}
                    />
                </div>
                <Button style={{color: '#157'}} type='submit' onClick={this.addGameSubmit}>
                    Update Id
                </Button>
            </form>
        );
        return (
            <React.Fragment>
                <Grid item container xs={12} md={4} lg={4} justify='center' alignItems='center' style={{ marginBottom: 8 }} >
                    <div className={styles.gameCard} onClick={this.toggleGame}>
                        <div className={styles.gameitem}>
                            <img src={`${HostAddress}gameimg/${this.props.game.image}`} />
                        </div>
                        <div className={styles.gamename}>
                        <h1>{this.props.game.name}</h1>
                        <h2>{this.props.game.platform ? 'mobile game' : 'pc game'}</h2>
                        {this.props.game.contact_string &&
                            <h4> GameId : {this.props.game.contact_string}</h4>
                        }
                        </div>
                    </div>
                </Grid>
                <Dialog open={this.state.isOpen} onClose={this.toggleGame}>
                    <DialogTitle>{this.props.game.name}</DialogTitle>
                    <DialogContent>
                        <h4>Game Type :  {this.props.game.platform ? 'mobile game' : 'pc game'}</h4>
                        <h4>Game id :  {this.props.game.requirement}</h4>
                        <h4>Player Count :  {this.props.game.player_count}</h4>
                    </DialogContent>
                    <DialogActions>
                        <Button style={{ color: 'green', fontWeight: 'bolder' }} onClick={this.toggleAddGame}>
                            Change Id
                        </Button>
                        <Button style={{ color: 'red', fontWeight: 'bolder' }} onClick={this.removeGame(this.props.game._id)}>
                            Remove Game
                        </Button>
                    </DialogActions>
                </Dialog>
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
            </React.Fragment>
        )
    }
}