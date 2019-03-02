import React, { Component } from 'react';
import { ColorPalate } from './MainStyles';

import { JsonQueryAuth, HostAddress } from '../Services/Query';
import { Grid, Button } from '@material-ui/core';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import styles from './Cards.module.css';



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
                    <div className={`${styles.bCard} animated bounceInRight`} onClick={this.toggleChallenge}>
                        <div>
                            <img src={`${HostAddress}gameimg/${this.state.game.image}`} alt='game'/>
                            <h1>{this.state.game.name}</h1>
                            <h2>Bet: {this.state.bet} BP</h2>
                            <h2>{this.state.opponent.full_name}</h2>
                        </div>
                        <div>
                            <img src={`${HostAddress}${this.state.opponent.image}`} alt='opponent' />
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
            <Grid item container xs={12} md={4} lg={3} justify='center' alignItems='center' style={{ marginBottom: 8 }} >
                <div className={`${styles.cCard} animated bounceInLeft`} onClick={this.redirect(id)}>
                    <div>
                        <img src={`${HostAddress}gameimg/${game.image}`} />
                    </div>
                    <div>
                        <img src={`${HostAddress}${opponent.image}`} />
                    </div>
                    <div>
                        <h1> VS </h1>
                        <h2>{opponent.full_name}</h2>
                        <br />
                        <h3>{game.name}</h3>
                        <h3>{bet} BP</h3>
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
            tournament_id: this.props.tournament_id

        }
    }
    toggleJoin = () => {
        if (!this.state.isParticipating)
            this.setState({
                isOpen: !this.state.isOpen,
            })
        else {
            console.log(this.state.tournament_id)
            this.props.enterTournament(this.state.tournament_id)
        }
    }
    joinTournament = id => async e => {
        console.log(id)
        const res = await JsonQueryAuth('post', `tournament/join/`, { tournament_id: this.state.tournament_id })
        if (res.status === 'ok')
            this.props.load()
    }

    render() {
        return (
            <React.Fragment>
                <Grid item container xs={12} md={4} lg={4} justify='center' alignItems='center' style={{ marginBottom: 8 }} >
                    <div className={styles.gameCard} onClick={this.toggleJoin}>
                        <div>
                            <img src={`${HostAddress}gameimg/${this.props.game.image}`} />
                        </div>
                        <h1>{this.props.game.name}  </h1>
                        <h2>{this.props.game.platform ? 'mobile game' : 'pc game'} ({this.props.player_count} players)</h2>
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

        }
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

    render() {
        return (
            <React.Fragment>
                <Grid item container xs={12} md={4} lg={4} justify='center' alignItems='center' style={{ marginBottom: 8 }} >
                    <div className={styles.gameCard} onClick={this.toggleGame}>
                        <div>
                            <img src={`${HostAddress}gameimg/${this.props.game.image}`} />
                        </div>
                        <h1>{this.props.game.name}</h1>
                        <h2>{this.props.game.platform ? 'mobile game' : 'pc game'}</h2>
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
                        <Button style={{ color: 'green', fontWeight: 'bolder' }}>
                            Change Id
                        </Button>
                        <Button style={{ color: 'red', fontWeight: 'bolder' }} onClick={this.removeGame(this.props.game._id)}>
                            Remove Game
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        )
    }
}