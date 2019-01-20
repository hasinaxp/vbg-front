import React, { Component } from 'react'

import { PostQuery, JsonQueryAdmin, HostAddress } from '../Services/Query'

import { Grid, Paper, } from '@material-ui/core'
import { Menu, MenuItem, MenuList, List, ListItem, ListItemText, Avatar } from '@material-ui/core'
import { TextField, Button, LinearProgress } from '@material-ui/core'
import ImageUploader from 'react-images-upload'


export class Admin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            active : 'games'
        }
    }
    setActive = name => e => {
        this.setState({
            active : name
        })
    }


    render() {

        let panel
        switch(this.state.active) {
            case 'games':
            panel = <GameMenu />
            break;
            case 'tournaments':
            panel = <TournamentMenu />
            break;
        }

        return (
            <React.Fragment>
                <Grid container style={{ minHeight: '100vh' }}>
                    <Grid item container md={3}>
                        <Paper style={{ width: '100%' }}>
                            <MenuList >
                                <MenuItem >
                                    <ListItemText inset primary="games" onClick={this.setActive('games')}/>
                                </MenuItem>
                                <MenuItem >
                                    <ListItemText inset primary="tournaments" onClick={this.setActive('tournaments')}/>
                                </MenuItem>
                                <MenuItem >
                                    <ListItemText inset primary="descitions" />
                                </MenuItem>
                                <MenuItem >
                                    <ListItemText inset primary="Inbox" />
                                </MenuItem>
                            </MenuList>
                        </Paper>
                    </Grid>
                    <Grid item container md={9}>
                        {panel}
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }
}

const PlayerCounts = [
    { text: '4', value: 4 },
    { text: '8', value: 8 },
    { text: '16', value: 16 },
    { text: '32', value: 32 },
]
const Balances = [10, 20, 50, 100, 200, 500]

class TournamentMenu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isCalling: false,
            player_counts: PlayerCounts,
            balances: Balances,
            games: [],
            tournaments_ongoing: [],
            tournaments_yet_to_start: [],
            game: '',
            player_count: 4,
            balance: 0,
            rules: '',
            msg_game: '',
            msg_player_count: 4,
            msg_balance: 0,
            msg_rules: ''
        }
    }
    componentDidMount() {
        this.load()
    }
    load = async () => {
        const res = await JsonQueryAdmin('post', 'admin/tournament', {})
        console.log(res)
        if (res.status === 'ok') {

            this.setState({
                games: res.games.map(g => {
                    return {
                        text: g.name,
                        value: g._id
                    }
                }),
                tournaments_ongoing: res.tournaments_ongoing,
                tournaments_yet_to_start: res.tournaments_yet_to_start
            })
        }
    }
    clearMsg = () => {
        this.setState({
            msg_game: '',
            msg_player_count: 4,
            msg_balance: 0,
            msg_rules: ''
        });
    }
    handleChange = name => e => {
        this.setState({
            [name]: e.target.value
        })
    }
    addTournament = async e => {
        e.preventDefault();
        this.setState({ isCalling: true })
        const {game, rules, balance, player_count } = this.state
        const res = await JsonQueryAdmin('post','admin/tournament/create',{
            game_id : game, rules, balance, player_count
        })
        console.log('form submitted')
        this.setState({ isCalling: false })
        console.log(res);
        this.clearMsg();
        if (res.errors) {
            res.errors.map(err => {
                const fieldName = 'msg_game_' + err.param
                this.setState({ [fieldName]: err.msg })
            });
        } else {
            this.setState ({
                game: '',
                player_count: 4,
                balance: 0,
                rules: '',
            })
            this.load()
        }
    }

    render() {
        return (
            <React.Fragment>
                <Grid container alignItems='center' justify='center'>
                    <Grid item xs={12}>
                        <Paper style={{ margin: '20px', padding: '20px' }}>
                            <h2>Add Tournament</h2>
                            {this.state.isCalling ? <LinearProgress /> : ''}
                            <form onSubmit={this.addTournament} encType="multipart/form-data">
                                <Grid container alignItems='center' justify='center'>
                                    <Grid item xs={12} md={6} >
                                        <TextField style={{ margin: '1vw', width: '90%' }}
                                            select
                                            label="Select Game"
                                            value={this.state.game}
                                            onChange={this.handleChange('game')}
                                        >
                                            {this.state.games.map(option => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.text}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} md={6} >
                                        <TextField style={{ margin: '1vw', width: '90%' }}
                                            select
                                            label="Select Bet"
                                            value={this.state.balance}
                                            onChange={this.handleChange('balance')}
                                        >
                                            {this.state.balances.map(option => (
                                                <MenuItem key={option} value={option}>
                                                    {option} bp
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} md={6} >
                                        <TextField style={{ margin: '1vw', width: '90%' }}
                                            select
                                            label="Player Count"
                                            value={this.state.player_count}
                                            onChange={this.handleChange('player_count')}
                                        >
                                            {this.state.player_counts.map(option => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.text}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} md={12} >
                                        <TextField style={{ margin: '1vw', width: '90%' }}
                                            multiline
                                            label="Rules"
                                            margin="normal"
                                            value={this.state.rules}
                                            onChange={this.handleChange('rules')}
                                            helperText={this.state.msg_rules}
                                            error={this.state.msg_rules.length > 0}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button type='submit' variant='outlined' style={{ margin: '1vw', width: '90%' }}>
                                            <span><i className="fas fa-upload"></i> Add Tournament</span>
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper style={{ margin: '20px', padding: '20px' }}>
                            <h2>Tournament List</h2>
                            <List style={{ width: '100%', margin: '20px', height: '32vh', overflowY: 'scorll' }}>

                                {
                                    this.state.tournaments_yet_to_start.map(g => (
                                        <ListItem button key={g._id}>
                                            <Avatar style={{ height: '60px', width: '60px' }}>
                                                <img src={`${HostAddress}gameimg/${g.game.image}`} style={{ height: '100%' }} />
                                            </Avatar>
                                            <ListItemText
                                                primary={<span> {g.game.name} ({g.player_count} players) </span>}
                                                secondary={<span> {g.game.platform ? 'mobile game' : 'pc game'} </span>} />
                                        </ListItem>
                                    ))
                                }
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }
}







const PlatformSelection = [
    { text: 'mobile', value: 0 },
    { text: 'pc', value: 1 }
]

class GameMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCalling: false,
            platform_values: PlatformSelection,
            games: [],
            game_name: '',
            game_platform: 0,
            game_requirement: '',
            game_image: '',
            game_player_count: 1,
            msg_game_name: '',
            msg_game_platform: '',
            msg_game_requirement: '',
            msg_game_image: '',
        }
    }
    clearMsg = () => {
        this.setState({
            msg_game_name: '',
            msg_game_platform: '',
            msg_game_requirement: '',
        });
    }
    handleChange = name => e => {
        this.setState({
            [name]: e.target.value
        })
    }
    onDrop = picture => {
        this.setState({
            game_image: picture,
        });
        console.log(picture)
    }
    onFileUpload = e => {
        this.setState({
            game_image: e.target.files[0]
        })
    }
    load = async () => {
        const res = await JsonQueryAdmin('post', 'admin/game', {})
        this.setState({
            games: res.games
        })
        console.log(res.games)
    }
    componentDidMount() {
        this.load()
    }
    addGame = async e => {
        e.preventDefault();
        this.setState({ isCalling: true })
        let fd = new FormData()
        fd.append('image', this.state.game_image, 'chris.jpg')
        fd.append('name', this.state.game_name)
        fd.append('platform', this.state.game_platform)
        fd.append('requirement', this.state.game_requirement)
        fd.append('player_count', this.state.game_player_count)
        const res = await PostQuery('admin/game/add', fd)
        console.log('form submitted')
        this.setState({ isCalling: false })
        console.log(res);
        this.clearMsg();
        if (res.errors) {
            res.errors.map(err => {
                const fieldName = 'msg_game_' + err.param
                this.setState({ [fieldName]: err.msg })
            });
        } else {
            this.load()
        }
    }

    render() {
        return (
            <React.Fragment>
                <Grid container alignItems='center' justify='center'>
                    <Grid item xs={12}>
                        <Paper style={{ margin: '20px', padding: '20px' }}>
                            <h2>Add Game</h2>
                            {this.state.isCalling ? <LinearProgress /> : ''}
                            <form onSubmit={this.addGame} encType="multipart/form-data">
                                <Grid container alignItems='center' justify='center'>
                                    <Grid item xs={12} md={6} >
                                        <TextField style={{ margin: '1vw', width: '90%' }}
                                            label="Game Name"
                                            margin="normal"
                                            value={this.state.gameName}
                                            onChange={this.handleChange('game_name')}
                                            helperText={this.state.msg_game_name}
                                            error={this.state.msg_game_name.length > 0}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6} >
                                        <TextField style={{ margin: '1vw', width: '90%' }}
                                            label="Game Reqirement"
                                            margin="normal"
                                            value={this.state.gameName}
                                            onChange={this.handleChange('game_requirement')}
                                            helperText={this.state.msg_game_requirement}
                                            error={this.state.msg_game_requirement.length > 0}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6} >
                                        <TextField style={{ margin: '1vw', width: '90%' }}
                                            id="standard-select-bets"
                                            select
                                            label="Select Platform"
                                            value={this.state.game_platform}
                                            onChange={this.handleChange('game_platform')}
                                        >
                                            {this.state.platform_values.map(option => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.text}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Button style={{ margin: '1vw', width: '90%' }}>
                                            <input type='file'
                                                style={{ width: '100%', opacity: 0, position: 'absolute' }}
                                                onChange={this.onFileUpload} />
                                            <span><i className="fas fa-upload"></i> Upload Game Image</span>
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button type='submit' variant='outlined' style={{ margin: '1vw', width: '90%' }}>
                                            <span><i className="fas fa-upload"></i> Add Game</span>
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper style={{ margin: '20px', padding: '20px' }}>
                            <h2>Game List</h2>
                            <List style={{ width: '100%', margin: '20px', height: '32vh', overflowY: 'scorll' }}>

                                {
                                    this.state.games.map(g => (
                                        <ListItem button key={g._id}>
                                            <Avatar style={{ height: '60px', width: '60px' }}>
                                                <img src={`${HostAddress}gameimg/${g.image}`} style={{ height: '100%' }} />
                                            </Avatar>
                                            <ListItemText
                                                primary={<span> {g.name} </span>}
                                                secondary={<span> {g.platform ? 'mobile game' : 'pc game'} </span>} />
                                        </ListItem>
                                    ))
                                }
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }
}