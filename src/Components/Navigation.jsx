import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { MainStyles, ColorPalate } from './MainStyles';

import { JsonQueryAuth, HostAddress, getCookie } from '../Services/Query'

import { AppBar, Toolbar } from '@material-ui/core';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Icon } from '@material-ui/core';
import { IconButton } from '@material-ui/core'
import { Sort, Dashboard, Person, AccountBalanceWallet, FeaturedPlayListTwoTone } from '@material-ui/icons';
import { Grid, Typography, Fab, Button } from '@material-ui/core';
import { GridList, GridListTile, GridListTileBar } from '@material-ui/core';
import { TextField, Avatar, MenuItem } from '@material-ui/core';
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import Slide from '@material-ui/core/Slide';

import styles from './Navigation.module.css';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

const ChallengeBets = [
    { text: 'Free', value: 0 },
    { text: '10 BP', value: 10 },
    { text: '20 BP', value: 20 },
    { text: '50 BP', value: 50 },
    { text: '100 BP', value: 100 },
    { text: '500 BP', value: 500 },
]


const Logo = () =>
    (<img
        src={require('../img/icons/vbg1.png')}
        style={MainStyles.logo}
        alt="VBG"
    >
    </img>);


export class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showGameBtn : false, 
            isOpen: false,
            image: require('../img/default.jpg'),
            name: 'palyer',
            balance: 0,
            data: {}
        }
        this.toggleDrawer = this.toggleDrawer.bind(this);
    }
    toggleDrawer() {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }
    load = async () => {
        const res = await JsonQueryAuth('POST', 'info/getUser', { x: 10 });
        const image = `${HostAddress}user/${res.folder}/${res.image}`
        const name = res.full_name
        const balance = res.balance
        this.setState({
            name: name,
            image: image,
            balance: balance,
            showGameBtn : this.props.active !== 'wallet' && this.props.active !== 'history'
        })
    }
    componentDidMount() {
        this.load();
    }
    render() {
        return (
            <React.Fragment>
                <AppBar position='sticky' style={MainStyles.nav}>
                    <Toolbar>
                        <IconButton
                            style={MainStyles.menuButton}
                            color="inherit" aria-label="Menu"
                            onClick={this.toggleDrawer}>
                            <Sort style={{ transform: 'scale(1.2)' }} />
                        </IconButton>
                        <Logo />
                    </Toolbar>
                    {
                        this.state.showGameBtn? <GameBtn load={this.props.load} /> : ''
                    }
                </AppBar>
                <Drawer open={this.state.isOpen} onClose={this.toggleDrawer}>
                    <SideMenu
                        active={this.props.active}
                        image={this.state.image}
                        name={this.state.name}
                        balance={this.state.balance}
                    />
                </Drawer>
            </React.Fragment>
        );
    }
}

class GameBtn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            stage: 'game',
            bets: ChallengeBets,
            nameHint: '',
            bet: 0,
            games: [],
            game: '',
            opponents: [],
            opponent: {
                _id: '',
                name: '',
                image: require('../img/default.jpg')
            },
            self: {
                _id: '',
                name: '',
                image: require('../img/default.jpg')
            }
        }
        this.toggleChallenge = this.toggleChallenge.bind(this);
    }
    toggleChallenge() {
        this.setState({
            isOpen: !this.state.isOpen,
            stage: 'game'
        })
    }
    handleChange = name => async event => {
        this.setState({
            [name]: event.target.value,
        });
        if (name === 'nameHint') {
            this.search(event.target.value)
        }
    } 
    async componentDidMount() {
        const res = await JsonQueryAuth('POST', 'info/getGames', {})
        this.setState({
            games: res
        });
    }
    search = async (name) => {
        const res = await JsonQueryAuth('POST', 'info/getChallangerList', { name: name, game_id: this.state.game })
        const opponents = res.list.filter(x => x._id !== getCookie('logauti'))
        this.setState({
            opponents: opponents,
            stage: 'search',
        })
    }
    selectOpponent = id => async  e => {
        const res = await JsonQueryAuth('POST', 'info/getChallangerList', { name: this.state.nameHint, game_id: id })
        const opponents = res.list.filter(x => x._id !== getCookie('logauti'))
        this.setState({
            opponents: opponents,
            self: res.list.filter(x => x._id === getCookie('logauti'))[0],
            stage: 'search',
            game: id
        })
    }
    openChallange = op => async e => {
        this.setState({
            opponent: op,
            stage: 'challenge'
        })
    }
    challenge = async e => {
        const { opponent, bet, game, self } = this.state;
        const res = await JsonQueryAuth('POST', 'dashboard/game/challange', {
            challenger: self._id,
            challenged: opponent._id,
            balance: bet,
            game_id: game
        });
        if (res.status === 'ok') {
            this.toggleChallenge();
            this.props.load()
        } else {
            alert(res.errors[0]);
        }
    }
    render() {
        let dialogContent, dialogTitle;
        switch (this.state.stage) {
            case 'game':
                dialogTitle = 'Select Game';
                dialogContent = (
                    <React.Fragment>
                        <GridList cellHeight={200} style={MainStyles.gridList}>
                            {this.state.games.map(g => (
                                <GridListTile key={g._id} onClick={this.selectOpponent(g._id)} cols={window.innerWidth < 600 ? 2 : 1}>
                                    <img src={`${HostAddress}gameimg/${g.image}`} alt={'data.name'} />
                                    <GridListTileBar
                                        title={g.name}
                                        subtitle={<span>Platform: {g.platform === 0 ? 'mobile' : 'PC'}</span>}
                                    />
                                </GridListTile>
                            ))
                            }
                        </GridList>
                    </React.Fragment>
                )
                break;
            case 'search':
                dialogTitle = 'Search Opponent';
                dialogContent = (
                    <React.Fragment>
                        <div>
                            <TextField
                                autoComplete="off"
                                id="outlined-search"
                                label="Search Opponent"
                                type="search"
                                margin="normal"
                                variant="outlined"
                                onChange={this.handleChange('nameHint')}
                                style={{ width: window.innerWidth < 600 ? 'auto' : 400 }}
                            />
                        </div>
                        <div>
                            <List style={{ height: 300, overflowY: 'scroll' }}>
                                {this.state.opponents.map(op => (
                                    <ListItem key={op._id} onClick={this.openChallange(op)}>
                                        <Avatar alt="Remy Sharp" src={`${HostAddress}${op.image}`} />
                                        <ListItemText primary={op.full_name} />
                                    </ListItem>
                                ))}
                            </List>
                        </div>
                    </React.Fragment>
                )
                break;
            case 'challenge':
                dialogTitle = 'Challenge';
                dialogContent = (
                    <React.Fragment>
                        <Grid container justify='center' alignItems='center' >
                            <Grid item xs={12}>
                                <Grid container spacing={16} justify="center" alignItems="center">
                                    <Grid item xs={5} style={MainStyles.centerContainer}>
                                        <Avatar 
                                            alt={this.state.self.full_name}
                                            src={`${HostAddress}${this.state.self.image}`}
                                            style={{ width: window.innerWidth < 600 ? 100 : 200, height: window.innerWidth < 600 ? 100 : 200 }} />
                                        <span style={{ textAlign: 'center', color:'#aaa' }}>{this.state.self.full_name}</span>
                                    </Grid>
                                    <Grid item xs={2} style={{ textAlign: 'center', color: ColorPalate.greenLight, fontSize: '1.6rem' }} className='animated heartBeat infinite'>
                                        <span > VS </span>
                                    </Grid>
                                    <Grid item xs={5} style={MainStyles.centerContainer}>
                                        <Avatar
                                            alt="Remy Sharp"
                                            src={`${HostAddress}${this.state.opponent.image}`}
                                            style={{ width: window.innerWidth < 600 ? 100 : 200, height: window.innerWidth < 600 ? 100 : 200 }} />
                                        <span style={{ textAlign: 'center', color:'#aaa' }}>{this.state.opponent.full_name}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="standard-select-bets"
                                    select
                                    label="Select Bet"
                                    value={this.state.bet}
                                    style={{ width: '100%', marginTop: 20 }}
                                    onChange={this.handleChange('bet')}
                                >
                                    {this.state.bets.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.text}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} style={MainStyles.centerContainer}>
                                <Button
                                    style={{ marginTop: 30, width: '100%', padding: 20, fontSize: '1.3rem', color: ColorPalate.greenLight }}
                                    onClick={this.challenge}
                                >
                                    <i className="fas fa-gamepad"></i>{'\u00A0'}Challenge
                                </Button>
                            </Grid>
                        </Grid>
                    </React.Fragment>
                )
                break;
        }
        return (
            <div style={MainStyles.gameBtn}>
                <Fab style={{ backgroundColor: '#00c853' }} onClick={this.toggleChallenge} className='animated rubberBand'>
                    <img src={require('../img/icons/sword.svg')} alt="B" style={{ width: 30 }} />
                </Fab>
                <Dialog
                    open={this.state.isOpen}
                    onClose={this.toggleChallenge}
                    TransitionComponent={Transition}
                    keepMounted>
                    <DialogTitle>{dialogTitle}</DialogTitle>
                    <DialogContent>
                    <div>
                    {dialogContent}
                    </div>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}


const SideMenu = ({ active, image, name, balance }) => {
    return (
        <div style={MainStyles.sideNav}>
            <div className={styles.NavProfileCard}>
                <div>
                    <img src={image} alt="Player" />
                </div>
                <div>
                    <h2>{name}</h2>
                    <span>Balance : {balance} bp</span>
                </div>
            </div>
            <List style={MainStyles.sideNavList}>
                <Link to='/dashboard' style={{ textDecoration: 'none', color: ColorPalate.greenLight }}>
                    <ListItem button >
                        <ListItemIcon style={{ color: active === 'dashboard' ? ColorPalate.greenLight : ColorPalate.green }}>
                            <Dashboard />
                        </ListItemIcon>
                        <ListItemText inset
                            primary={<span style={{
                                color:
                                    active === 'dashboard' ? ColorPalate.greenLight : ColorPalate.green
                            }}>
                                Dashboard</span>} />
                    </ListItem>
                </Link>
                <Link to='/tournament' style={{ textDecoration: 'none', color: ColorPalate.greenLight }}>
                    <ListItem button>
                        <ListItemIcon style={{ color: active === 'tournament' ? ColorPalate.greenLight : ColorPalate.green }}>
                            <Icon className="fas fa-trophy" style={{ marginLeft: -2, transform: 'scale(0.79)' }} />
                        </ListItemIcon>
                        <ListItemText inset
                            primary={<span style={{
                                color:
                                    active === 'tournament' ? ColorPalate.greenLight : ColorPalate.green
                            }}>
                                Tournament</span>} />
                    </ListItem>
                </Link>
                <Link to='/leaderboard' style={{ textDecoration: 'none', color: ColorPalate.greenLight }}>
                    <ListItem button>
                        <ListItemIcon style={{ color: active === 'leaderboard' ? ColorPalate.greenLight : ColorPalate.green }}>
                            <Icon className="fab fa-fort-awesome" style={{ marginLeft: 2, transform: 'scale(0.79)' }} />
                        </ListItemIcon>
                        <ListItemText inset
                            primary={<span style={{
                                color:
                                    active === 'leaderboard' ? ColorPalate.greenLight : ColorPalate.green
                            }}>
                                Leaderboard</span>} />
                    </ListItem>
                </Link>
                <Divider />
                <Link to='/wallet' style={{ textDecoration: 'none', color: ColorPalate.greenLight }}>
                    <ListItem button>
                        <ListItemIcon style={{ color: active === 'wallet' ? ColorPalate.greenLight : ColorPalate.green }}>
                            <AccountBalanceWallet />
                        </ListItemIcon>
                        <ListItemText inset
                            primary={<span style={{
                                color:
                                    active === 'wallet' ? ColorPalate.greenLight : ColorPalate.green
                            }}>
                                Wallet</span>} />
                    </ListItem>
                </Link>
                <Link to='/history' style={{ textDecoration: 'none', color: ColorPalate.greenLight }}>
                    <ListItem button>
                        <ListItemIcon style={{ color: active === 'history' ? ColorPalate.greenLight : ColorPalate.green }}>
                            <Icon className="fas fa-scroll" style={{ marginLeft: -2, transform: 'scale(0.79)' }} />
                        </ListItemIcon>
                        <ListItemText inset
                            primary={<span style={{
                                color:
                                    active === 'history' ? ColorPalate.greenLight : ColorPalate.green
                            }}>
                                History</span>} />
                    </ListItem>
                </Link>
                <Link to='/profile' style={{ textDecoration: 'none', color: ColorPalate.greenLight }}>
                    <ListItem button>
                        <ListItemIcon style={{ color: active === 'profile' ? ColorPalate.greenLight : ColorPalate.green }}>
                            <Person />
                        </ListItemIcon>
                        <ListItemText inset
                            primary={<span style={{
                                color:
                                    active === 'profile' ? ColorPalate.greenLight : ColorPalate.green
                            }}>
                                Profile</span>} />
                    </ListItem>
                </Link>
                <Divider />
                <Link to='/logout' style={{ textDecoration: 'none', color: ColorPalate.greenLight }}>
                    <ListItem button>
                        <ListItemIcon style={{ color: ColorPalate.green }}>
                            <Icon className="fas fa-sign-out-alt" style={{ marginLeft: 2, transform: 'scale(0.79)' }} />
                        </ListItemIcon>
                        <ListItemText inset
                            primary={<span style={{ color: ColorPalate.green }}>
                                Tournament</span>} />
                    </ListItem>
                </Link>
            </List>
        </div>
    );
}
