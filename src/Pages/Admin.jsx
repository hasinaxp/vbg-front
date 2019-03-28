import React, { Component } from 'react'

import { PostQuery, JsonQueryAdmin, HostAddress } from '../Services/Query'

import { Grid, Paper, } from '@material-ui/core'
import { Menu, MenuItem, MenuList, List, ListItem, ListItemText, Avatar,Select,Input,InputLabel } from '@material-ui/core'
import { TextField, Button, LinearProgress,Checkbox } from '@material-ui/core'
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
            case 'assign player':
            panel = <AssignMenu />
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
                                    <ListItemText inset primary="assign player" onClick={this.setActive('assign player')}/>
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
            entry_fee:'',
            balances: Balances,
            games: [],
            tournaments_ongoing: [],
            tournaments_yet_to_start: [],
            game: '',
            player_count: 4,
            balance: 10,
            rules: '',
            tournament_name:'',
            msg_tournament_game_id: '',
            msg_tournament_player_count: '',
            msg_tournament_balance: '',
            msg_tournament_rules: '',
            msg_tournament_entry_fee: '',
            msg_tournament_tournament_name:'',
            tournament_image:'',
            custom_fields:[],
            is_bracket_needed:true
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
            msg_tournament_game_id: '',
            msg_tournament_player_count: '',
            msg_tournament_balance: '',
            msg_tournament_rules: '',
            msg_tournament_entry_fee: ''
        });
    }
    handleChange = name => e => {
        if(name == "is_bracket_needed") {
            this.setState({
                [name]: !this.state.is_bracket_needed
            })
        } else {
            this.setState({
                [name]: e.target.value
            })
        }
    }
    handleChangeCustomFields = (e,name,field_id) => {
        for(var i=0;i<this.state.custom_fields.length;i++) {
            if(this.state.custom_fields[i].field_id == field_id) {
                this.state.custom_fields[i][name] = e.target.value;
            }
        }
        this.setState({
            custom_fields: this.state.custom_fields
        })
    }
    onDrop = picture => {
        this.setState({
            tournament_image: picture,
        });
        console.log(picture)
    }
    onFileUpload = e => {
        this.setState({
            tournament_image: e.target.files[0]
        })
    }
    addTournament = async e => {
        e.preventDefault();
        this.setState({ isCalling: true })
        // const {game, rules, balance, player_count,entry_fee,tournament_image } = this.state
        let fd = new FormData()
        fd.append('image', this.state.tournament_image)
        fd.append('rules', this.state.rules)
        fd.append('balance', this.state.balance)
        fd.append('player_count', this.state.player_count)
        fd.append('entry_fee', this.state.entry_fee)
        fd.append('game_id', this.state.game)
        fd.append('custom_fields',JSON.stringify(this.state.custom_fields))
        fd.append('is_bracket_needed',this.state.is_bracket_needed)
        fd.append('tournament_name',this.state.tournament_name)

        
        const res = await PostQuery('admin/tournament/create', fd)

        // const res = await JsonQueryAdmin('post','admin/tournament/create',{
        //     game_id : game, rules, balance, player_count,entry_fee
        // })
        console.log('form submitted')
        this.setState({ isCalling: false })
        console.log(res);
        this.clearMsg();
        if (res.errors) {
            res.errors.map(err => {
                const fieldName = 'msg_tournament_' + err.param
                this.setState({ [fieldName]: err.msg })
            });
        } else {
            alert("Tournament created successfully");
            this.setState ({
                game: '',
                player_count: 4,
                balance: 0,
                rules: '',
                entry_fee:'',
                tournament_name:''
            });
            this.load();
        }
    }
    addFields = e => {
        this.state.custom_fields.push({field_id: Date.now()});
        this.setState ({
            custom_fields:this.state.custom_fields
        });
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
                                            label="Tournament Name"
                                            value={this.state.tournament_name}
                                            onChange={this.handleChange('tournament_name')}
                                            helperText={this.state.msg_tournament_tournament_name}
                                            error={this.state.msg_tournament_tournament_name.length > 0}
                                        >
                                            
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} md={6} >
                                        <TextField style={{ margin: '1vw', width: '90%' }}
                                            select
                                            label="Select Game"
                                            value={this.state.game}
                                            onChange={this.handleChange('game')}
                                            helperText={this.state.msg_tournament_game_id}
                                            error={this.state.msg_tournament_game_id.length > 0}
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
                                            label="Select Prize"
                                            value={this.state.balance}
                                            onChange={this.handleChange('balance')}
                                            helperText={this.state.msg_tournament_balance}
                                            error={this.state.msg_tournament_balance.length > 0}
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
                                            helperText={this.state.msg_tournament_player_count}
                                            error={this.state.msg_tournament_player_count.length > 0}
                                        >
                                            {this.state.player_counts.map(option => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.text}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} md={6} >
                                        <TextField style={{ margin: '1vw', width: '90%' }}
                                            label="Entry Fee"
                                            value={this.state.entry_fee}
                                            onChange={this.handleChange('entry_fee')}
                                            helperText={this.state.msg_tournament_entry_fee}
                                            error={this.state.msg_tournament_entry_fee.length > 0}
                                        >
                                            
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} md={6} >
                                        <Checkbox 
                                            checked={this.state.is_bracket_needed}
                                            onChange={this.handleChange('is_bracket_needed')}
                                        > 
                                        </Checkbox>Is Bracket Needed                     
                                    </Grid>
                                    <Grid item xs={12} md={12} >
                                        <TextField style={{ margin: '1vw', width: '90%' }}
                                            multiline
                                            label="Rules"
                                            margin="normal"
                                            value={this.state.rules}
                                            onChange={this.handleChange('rules')}
                                            helperText={this.state.msg_tournament_rules}
                                            error={this.state.msg_tournament_rules.length > 0}
                                        />
                                    </Grid>
                                    {this.state.custom_fields.map(field => (
                                        <Grid item xs={12} md={12} key={field.field_id}>
                                            <TextField style={{ margin: '1vw', width: '40%' }}
                                                label="Field Label"
                                                value={field.label_name}
                                                onChange={(e) => this.handleChangeCustomFields(e,'label_name',field.field_id)}
                                            >
                                            </TextField>
                                            <TextField style={{ margin: '1vw', width: '40%' }}
                                                label="Field Value"
                                                value={field.value}
                                                onChange={(e) =>this.handleChangeCustomFields(e,'field_value',field.field_id)}
                                            >
                                            </TextField>
                                        </Grid>
                                    ))}
                                    <Grid item xs={12}>
                                        <Button onClick={(e) => this.addFields(e)} variant='outlined' style={{ margin: '1vw', width: '90%' }}>
                                            <span> <i className="fas fa-plus"></i>Add Custom Fields</span>
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Button style={{ margin: '1vw', width: '90%' }}>
                                            <input type='file'
                                                style={{ width: '100%', opacity: 0, position: 'absolute' }}
                                                onChange={this.onFileUpload} />
                                            <span><i className="fas fa-upload"></i> Upload Tournament Image</span>
                                        </Button> 
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



class AssignMenu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isCalling: false,
            selected_players:[],
            userList:[],
            tournaments_yet_to_start: [],
            tournament_id:'',
            msg_tournament_id: '',
            name : [],
            selected_tournament:{}
        }
    }
    resetForm() {
        this.setState({
            isCalling: false,
            selected_players:[],
            tournaments_yet_to_start: [],
            tournament_id:'',
            msg_tournament_id: '',
            name : [],
            selected_tournament:{}
        });
        this.load();
    }
    componentDidMount() {
       this.load();
       this.loadUsers();
    }
    clearMsg() {
        this.setState({ msg_tournament_id:''});
    }
    addPlayer = async e => {
        e.preventDefault();
        if(this.state.selected_players.length == 0 ){
            alert("Please select players");
            return;
        }
        if(this.state.selected_tournament.player_count < this.state.selected_players.length) {
            alert("Maximum player count for this tournament is "+this.state.selected_tournament.player_count);
            return false;
        }
        this.clearMsg();
        this.setState({ isCalling: true });
        const res = await JsonQueryAdmin('post', `admin/addPlayer`, { tournament_id: this.state.tournament_id,players:this.state.selected_players })
        this.setState({
            isCalling: false
        });
        if (res.errors) {
            res.errors.map(err => {
                const fieldName = 'msg_' + err.param
                this.setState({ [fieldName]: err.msg })
            });
        } else {
            if (res.status === 'ok') {
                alert(res.msg);
                this.resetForm();
            } else {
                
                alert("Tournament is not valid/Capacity exceeds");
            }
        }
    }
    handleChange = name => e => {
        if(name == 'tournament_id') {
            this.setState({selected_players:[],selected_tournament:{}});
            for(var t=0;t<this.state.tournaments_yet_to_start.length;t++) {
                 if(this.state.tournaments_yet_to_start[t]._id == e.target.value) {
                     this.setState({selected_tournament:this.state.tournaments_yet_to_start[t]});
                     if(this.state.tournaments_yet_to_start[t].players.length >0) {
                         this.setState({selected_players:this.state.tournaments_yet_to_start[t].players});
                     }
                    break;
                }
        }
        }
        this.setState({
            [name]: e.target.value
        })
    }
    load = async () => {
        const res = await JsonQueryAdmin('post', 'admin/tournament', {})
        console.log(res)
        if (res.status === 'ok') {

            this.setState({
               tournaments_yet_to_start: res.tournaments_yet_to_start
            })
        }
    }
    loadUsers = async () => {
        const res = await JsonQueryAdmin('get', 'admin/listusers')
        console.log(res)
        this.setState({
            userList: res
        });
        
    }
    getUser = selected => {
        var users = '';
        for(var i=0;i<this.state.userList.length;i++) {
            if(selected.indexOf(this.state.userList[i]._id) > -1 ) {
                users +=  this.state.userList[i].full_name+'('+this.state.userList[i].email+')'+ ' ';
            }
        }
        return users;
    }

    render() {

        return (
            <React.Fragment>
                <Grid container alignItems='center' justify='center'>
                    <Grid item xs={12}>
                        <Paper style={{ margin: '20px', padding: '20px' }}>
                            <h2>Add Player</h2>
                            {this.state.isCalling ? <LinearProgress /> : ''}
                            <form onSubmit={this.addPlayer} >
                           
                                <Grid container alignItems='center' justify='center'>
                                    <Grid item xs={12} md={12} >
                                        <TextField style={{ margin: '1vw', width: '90%' }}
                                            select
                                            label="Select Tournament"
                                            value={this.state.tournament_id}
                                            onChange={this.handleChange('tournament_id')}
                                            helperText={this.state.msg_tournament_id}
                                            error={this.state.msg_tournament_id.length > 0}
                                        >
                                            {this.state.tournaments_yet_to_start.map(option => (
                                                <MenuItem key={option._id} value={option._id}>
                                                    {option.tournament_name || option.game.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                        {this.state.selected_tournament && this.state.selected_tournament._id &&
                                            <ListItem > 
                                                <ListItemText
                                                    primary={<span> {'Current Slot '+this.state.selected_tournament.players.length +' / ' + this.state.selected_tournament.player_count } </span>}
                                                    secondary={<span>{'Game ' + this.state.selected_tournament.game.name}</span>} />
                                            </ListItem>
                                        }
                                    </Grid>
                                    <Grid item xs={12} md={12} >
                                        <ListItem > 
                                                <ListItemText
                                                    primary={<span> {'Select Players' } </span>}
                                                />
                                            </ListItem>
                                        <Select style={{ margin: '1vw', width: '90%' }}
                                            multiple
                                            value={this.state.selected_players}
                                            onChange={this.handleChange('selected_players')}
                                            renderValue={selected => this.getUser(selected)}
                                        >
                                        <MenuItem disabled value="">
                                            <em>Select Players</em>
                                        </MenuItem>
                                            {this.state.userList.map(user => (
                                                <MenuItem key={user._id} value={user._id}>
                                                    <Checkbox checked={this.state.selected_players.indexOf(user._id) > -1}/>
                                                    <ListItemText primary={<span> {user.full_name + "(" +user.email+")"} </span>} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {this.state.selected_players && this.state.selected_players.length > 0 &&
                                            <ListItem > 
                                                <ListItemText
                                                    primary={<span> {'Total Selected '+this.state.selected_players.length } </span>}
                                                />
                                            </ListItem>
                                        }
                                    </Grid>                              
                                    
                                    <Grid item xs={12}>
                                        <Button type='submit' variant='outlined' style={{ margin: '1vw', width: '90%' }}>
                                            <span><i className="fas fa-upload"></i>Assign Player</span>
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
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
        // fd.append('player_count', this.state.game_player_count)
        
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
            if(res.error == 1) {
                alert(res.message);
            } else {
                alert("Game added successfully");
                this.load();
            }
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
                            <form onSubmit={this.addGame} >
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
                                            value="ID"
                                            readonly={true}
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