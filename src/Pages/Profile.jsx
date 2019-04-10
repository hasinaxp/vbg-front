import React, { Component } from 'react';
import { MainStyles, ColorPalate, myTheme } from '../Components/MainStyles';
import { MuiThemeProvider } from '@material-ui/core'
import {  GameCard } from '../Components/Cards';

import { JsonQueryAuth, HostAddress, PostQueryAuth } from '../Services/Query'

import { Navigation } from '../Components/Navigation';

import { Paper, Grid, LinearProgress, TextField } from '@material-ui/core';
import { Card, CardMedia, CardActionArea, CardContent, CardActions, Typography, Button, Divider, CircularProgress } from '@material-ui/core';
import { Dialog, DialogTitle, DialogContent} from '@material-ui/core';

export class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isDataAvailable: false,
            user: '',
            image: require('../img/default.jpg'),
            name: '',
            match: {},
            level: {},
            isChangePassword : false,
            password : '',
            new_password: '',
            msg_password : '',
            msg_new_password: '',
            games:[]
        }
    }
    handleChange = name => e => {
        this.setState({
            [name]: e.target.value
        })
    } 

    componentDidMount() {
        this.load()
    }
    load = async e => {
        const res = await JsonQueryAuth('post', 'profile', {});
        if (res.status === 'ok') {
            this.setState({
                isDataAvailable: true,
                user: res.user,
                name: res.user.full_name,
                image: `${HostAddress}user/${res.user.folder}/${res.user.image}`,
                match: res.match,
                level: res.level
            });
            const res1 = await JsonQueryAuth('POST', 'info/getGames', {})
            this.setState({
                games: res1
            });
        }
    }
    toggleChangePassword = () => {
        this.setState({
            isChangePassword : !this.state.isChangePassword
        })
    }
    clearMsg = () => {
        this.setState({
            msg_password: '',
            msg_new_password: ''
        });
    }
    changePassword = async e => {
        e.preventDefault()
        this.clearMsg()
        const { password, new_password } = this.state
        const res = await JsonQueryAuth('post', 'profile/update/password', { password, new_password })
        if (res.errors) {
            res.errors.map(err => {
                const fieldName = 'msg_' + err.param;
                this.setState({ [fieldName]: err.msg });
                return err
            });
        }
        if(res.status === 'ok' ) {
            this.load()
            this.setState({
              password : '',
              new_password: ''  
            })
            this.toggleChangePassword()
        }
    }

    render() {
        return (
            <MuiThemeProvider theme={myTheme}>
            <div className='Profile Page'>
                <Navigation active='profile' load={this.load} />
                <section className='ContainerCenter'>
                    <Paper className='Block' style={MainStyles.block}>
                        <h1><i className="fas fa-users"></i> Profile</h1><br />
                        <Grid container spacing={16}>
                            <Grid item xs={12} md={3}>
                                <ProfileCard
                                    load={this.load}
                                    image={this.state.image}
                                    name={this.state.name}
                                    isJenuine={true} />
                            </Grid>
                            <Grid item xs={12} md={9}>
                                {
                                    this.state.isDataAvailable ? <InfoCard match={this.state.match} level={this.state.level} user={this.state.user} isJenuine={true}/> : ''
                                }
                            </Grid>
                        </Grid>
                    </Paper>
                    <Paper className='Block' style={MainStyles.block}>
                        <h1><i className="fas fa-dice"></i>Game Library</h1>
                        <br />
                        <Grid container spacing={16}>
                                {this.state.games.map(game => <GameCard key={game._id} game={game} load={this.load} />)} 
                        </Grid>
                    </Paper>
                    <Paper className='Block' style={MainStyles.block}>
                        <h1><i className="fas fa-cogs"></i> Profile Settings</h1>
                        <br />
                        <Button style={{color: ColorPalate.green}} onClick={this.toggleChangePassword}>
                        <i className="fas fa-unlock"></i> change password
                        </Button>
                    </Paper>
                </section>
                <Dialog
                    open={this.state.isChangePassword}
                    onClose={this.toggleChangePassword}
                    keepMounted>
                    <DialogTitle>Change password</DialogTitle>
                    <DialogContent>
                        <div>
                            <form onSubmit={this.changePassword}>
                                {//this.changeImageProgress ? <LinearProgress /> : ''
                                }
                                <TextField style={{ margin: '1vw', width: '90%' }}
                                    label="Old Password"
                                    margin="normal"
                                    type='password'
                                    value={this.state.password}
                                    onChange={this.handleChange('password')}
                                    helperText={this.state.msg_password}
                                    error={this.state.msg_password.length > 0}
                                />
                                <TextField style={{ margin: '1vw', width: '90%' }}
                                    label="New Password"
                                    margin="normal"
                                    value={this.state.new_password}
                                    onChange={this.handleChange('new_password')}
                                    helperText={this.state.msg_new_password}
                                    error={this.state.msg_new_password.length > 0}
                                />
                                <Button type='submit' variant='outlined' style={{ margin: '1vw', width: '90%' }}>
                                    <span><i className="fas fa-upload"></i> Change Password</span>
                                </Button>
                            </form>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            </MuiThemeProvider>
        );
    }
};

export class OtherProfile extends Component {
    constructor(props) {
        super(props)
        const urlFragments = window.location.href.split('/');
        const user_id = urlFragments[urlFragments.length - 1];
        this.state = {
            isDataAvailable: false,
            user_id : user_id,
            user: '',
            image: require('../img/default.jpg'),
            name: '',
            match: {},
            level: {},
        }
    }

    componentDidMount() {
        this.load()
    }
    load = async e => {
        const res = await JsonQueryAuth('post', `profile/${this.state.user_id}`, {});
        if (res.status === 'ok') {
            this.setState({
                isDataAvailable: true,
                user: res.user,
                name: res.user.full_name,
                image: `${HostAddress}user/${res.user.folder}/${res.user.image}`,
                match: res.match,
                level: res.level
            })
            
        }
    }

    render() {
        return (
            <div className='Profile Page'>
                <Navigation active='profile' load={this.load} />
                <section className='ContainerCenter'>
                    <Paper className='Block' style={MainStyles.block}>
                        <h1><i className="fas fa-users"></i> Profile</h1><br />
                        <Grid container spacing={16}>
                            <Grid item xs={12} md={3}>
                                <ProfileCard
                                    load={this.load}
                                    image={this.state.image}
                                    name={this.state.name}
                                    isJenuine={false} />
                            </Grid>
                            <Grid item xs={12} md={9}>
                                {
                                    this.state.isDataAvailable ? <InfoCard match={this.state.match} level={this.state.level} user={this.state.user} isJenuine={false}/> : ''
                                }
                            </Grid>
                        </Grid>
                    </Paper>
                </section>
            </div>
        );
    }
}

class ProfileCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isChangeImage: false,
            isChangeName: false,
            changeImageProgress: false,
            cahangeNameProgress: false,
            newName: '',
            msg_name: ''
        }
    }
    handleChange = name => e => {
        this.setState({
            [name]: e.target.value
        })
    }
    toggleChangeImage = () => {
        this.setState({
            isChangeImage: !this.state.isChangeImage
        })
    }
    toggleChangeName = () => {
        this.setState({
            isChangeName: !this.state.isChangeName,
            msg_name: ''
        })
    }
    changeImage = async e => {
        this.setState({
            changeImageProgress: true
        })
        const imageFile = e.target.files[0]
        let fd = new FormData()
        fd.append('image', imageFile, 'image.jpg')
        const res = await PostQueryAuth('profile/update/image', fd)
        if (res.status === 'ok') {
            this.setState({
                changeImageProgress: false
            })
            window.location.reload()
        }
    }
    changeName = async e => {
        e.preventDefault()
        this.setState({
            changeNameProgress: true
        })
        const res = await JsonQueryAuth('post','profile/update/name', {name : this.state.newName})
        if(res.errors) {
            this.setState({
                msg_name : res.errors[0].msg
            })
        }
        if (res.status === 'ok') {
            this.setState({
                changeNameProgress: false,
                newName : '',
                msg_name : ''
            })
            this.props.load()
            this.toggleChangeName()
        }
    }

    render() {
        return (
            <React.Fragment>
                <Card style={{ background: '#333' }}>
                    <CardActionArea>
                        <CardMedia
                            style={{ height: 200 }}
                            image={this.props.image}
                            title={this.props.name}
                        />
                        <CardContent style={{ height: 20 }}>
                            <Typography gutterBottom variant="h5" component="h1" style={{ color: ColorPalate.greenLight, fontSize: '1.2rem' }}>
                                {this.props.name}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    {this.props.isJenuine ?
                        <CardActions >

                            <Button size="small"
                                color="primary"
                                onClick={this.toggleChangeImage}
                                style={{ color: ColorPalate.green, fontSize: '0.6rem' }}>
                                Edit Image
                    </Button>
                            <Button size="small"
                                color="primary"
                                onClick={this.toggleChangeName}
                                style={{ color: ColorPalate.green, fontSize: '0.6rem' }}>
                                Edit Name
                    </Button>
                        </CardActions>
                        : ''
                    }
                </Card>
                <Dialog
                    open={this.state.isChangeImage}
                    onClose={this.toggleChangeImage}
                    keepMounted>
                    <DialogTitle>Change Image</DialogTitle>
                    <DialogContent>
                        <div>
                            <form encType="multipart/form-data">
                                {this.changeImageProgress ? <LinearProgress /> : ''}
                                <Button style={{ margin: '1vw', width: '90%' }}>
                                    <input type='file'
                                        style={{ width: '100%', opacity: 0, position: 'absolute' }}
                                        onChange={this.changeImage} />
                                    <span><i className="fas fa-upload"></i> Upload new profile Image</span>
                                </Button>
                            </form>
                        </div>
                    </DialogContent>
                </Dialog>
                <Dialog
                    open={this.state.isChangeName}
                    onClose={this.toggleChangeName}
                    keepMounted>
                    <DialogTitle>Change Name</DialogTitle>
                    <DialogContent>
                        <div>
                            <form onSubmit={this.changeName} encType="multipart/form-data">
                                {this.cahangeNameProgress ? <LinearProgress /> : ''}
                                <TextField style={{ margin: '1vw', width: '90%' }}
                                    label="New Name"
                                    margin="normal"
                                    value={this.state.newName}
                                    onChange={this.handleChange('newName')}
                                    helperText={this.state.msg_name}
                                    error={this.state.msg_name.length > 0}
                                />
                                <Button type='submit' variant='outlined' style={{ margin: '1vw', width: '90%' }}>
                                    <span><i className="fas fa-upload"></i> change Name</span>
                                </Button>
                            </form>
                        </div>
                    </DialogContent>
                </Dialog>
            </React.Fragment>
        );
    }
}

const InfoCard = ({ match, level, user, isJenuine }) => {
    let Info = {
        email: user.email,
        Balance: user.balance,
        level: level.m_level,
        leader_points: user.leader_point,
        next_level: level.m_next,
        total_winning: user.total_bp_win,
        total_wins: match.m_win,
        total_matches: match.m_match
    }
    if(!isJenuine)
        Info = {
            level: level.m_level,
        leader_points: user.leader_point,
        next_level: level.m_next,
        total_winning: user.total_bp_win,
        total_wins: match.m_win,
        total_matches: match.m_match
        }
    let Percents = {
        next_level: level.m_levelExpPercent,
        win_persentage: match.m_average
    }

    Info = Object.entries(Info);
    //Percents = Object.entries(Percents);

    return (
        <Paper style={{ backgroundColor: '#444', padding: 16, color: ColorPalate.greenLight }}>
            <Grid container>
            
                {Info.map(inf => (
                    <Grid item container xs={12}>
                        <Grid item xs={12} md={5} style={MainStyles.heading}>{`${inf[0].replace(/_/g, " ")} :`}</Grid>
                        <Grid item xs={12} md={7} style={MainStyles.text}>{inf[1]}</Grid>
                    </Grid>
                ))}
                <Divider />
                <br />
                <Grid item container xs={12} space={12} justify='center' alignItems='center'>
                    <Grid item xs={6}>
                        <CircularProgress thickness={12} className='animated jackInTheBox'
                            variant="static"
                            value={Percents.win_persentage}
                            size='80%'
                            style={{
                                color:
                                    ColorPalate.greenLight
                            }} />
                    </Grid>
                    <Grid item xs={6}>
                        <CircularProgress thickness={16} className='animated jackInTheBox'
                            variant="static"
                            value={Percents.next_level}
                            size='80%' style={{
                                color:
                                    ColorPalate.greenLight
                            }} />
                    </Grid>
                    <Grid item xs={6}>
                        <span>win: {Percents.win_persentage}%</span>
                    </Grid>
                    <Grid item xs={6}>
                        <span>next level: {Percents.next_level}%</span>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
}
