import React, { Component } from 'react';
import { MainStyles } from './MainStyles';

import { JsonQueryAuth, HostAddress } from '../Services/Query';
import { Paper, Grid, Avatar, Card, CardMedia, Button } from '@material-ui/core';
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core';
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
        const res = await JsonQueryAuth('POST', 'dashboard/game/challange/accept',{ match_id : this.props.id })
        console.log(res);
        if(res.status === 'ok' ) {
            this.props.load();
            this.toggleChallenge();
        }
        else {
            alert(res.errors[0]);
        }
    }
    cancelChallenge = async () => {
        const res = await JsonQueryAuth('POST', 'dashboard/game/challange/decline',{match_id : this.props.id})
        if(res.status === 'ok' ) {
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
                    <div className={styles.bCard} onClick={this.toggleChallenge}>
                        <div>
                            <img src={`${HostAddress}gameimg/${this.state.game.image}`} />
                            <h1>{this.state.game.name}</h1>
                            <h2>Bet: {this.state.bet} BP</h2>
                            <h2>{this.state.opponent.full_name}</h2>
                        </div>
                        <div>
                            <img src={`${HostAddress}${this.state.opponent.image}`} />
                        </div>
                    </div>
                </Grid>
                <Dialog open={this.state.isOpen} onClose={this.toggleChallenge}>
                    <DialogTitle>I want to</DialogTitle>
                    <DialogContent>
                        {!this.state.isChallenger ? <Button onClick={this.acceptChallenge} style={{color: 'green', fontWeight: 'bolder'}}>Accept Challenge</Button> : ''}
                        <Button onClick={this.cancelChallenge} style={{color: 'red', fontWeight: 'bolder'}}>Cancel Challenge</Button>
                    </DialogContent>
                </Dialog>
            </React.Fragment>
        )
    }
}

export const MatchCard = ({bet, game, opponent}) =>  {
    return (
        <Grid item container xs={12} md={4} lg={3} justify='center' alignItems='center' style={{ marginBottom: 8 }} >
            <div className={styles.cCard}>
                <div>
                    <img src={`${HostAddress}gameimg/${game.image}`} />
                </div>
                <div>
                    <img src={`${HostAddress}${opponent.image}`}  />
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
                        this is my lifr
                    </DialogContent>
            </Dialog>
            </React.Fragment>
        )
    }
}