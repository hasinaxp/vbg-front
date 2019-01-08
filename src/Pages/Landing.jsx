import React, { Component } from 'react';
import { MainStyles, ColorPalate } from '../Components/MainStyles';

import { JsonQuery, SetCookie } from '../Services/Query'
import { Router } from 'react-router-dom'

import { Grid, Drawer, TextField, LinearProgress } from '@material-ui/core';
import { Button } from '@material-ui/core';
//import TouchRipple from '@material-ui/core/ButtonBase/TouchRipple';

import './Landing.css';


class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            full_name: '',
            email: '',
            password: '',
            confirm: '',
            isCalling: false,
            msg_full_name: '',
            msg_email: '',
            msg_password: '',
            msg_confirm: '',
        }
    }
    clearMsg = () => {
        this.setState({
            msg_full_name: '',
            msg_email: '',
            msg_password: '',
            msg_confirm: '',
        });
    }
    handleChange = name => event => {
        this.setState({ [name]: event.target.value })
    }
    register = async e => {
        e.preventDefault();
        this.setState({ isCalling: true })
        const { full_name, email, password, confirm } = this.state;
        if (full_name === '' || full_name === undefined) {

        }
        console.log('form submitted')
        const res = await JsonQuery('post', 'sign/register', { full_name, email, password, confirm });
        this.setState({ isCalling: false })
        console.log(res);
        this.clearMsg();
        if (res.errors) {
            res.errors.map(err => {
                const fieldName = 'msg_' + err.param;
                this.setState({ [fieldName]: err.msg });
            });
        } else {
            alert(`registration successful`)
        }
    }

    render() {
        return (
            <div style={{ width: '80vw', height: '100%', display: 'grid', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ margin: '2vw' }}>
                    <h1>Register</h1>
                    {this.state.isCalling ? <LinearProgress /> : ''}
                    <form onSubmit={this.register}>
                        <Grid container >
                            <Grid item xs={12} md={6} >
                                <TextField style={{ margin: '1vw', width: '90%' }}
                                    id="standard-name"
                                    label="Name"
                                    margin="normal"
                                    value={this.state.full_name}
                                    onChange={this.handleChange('full_name')}
                                    helperText={this.state.msg_full_name}
                                    error={this.state.msg_full_name.length > 0}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} >
                                <TextField style={{ margin: '1vw', width: '90%' }}
                                    id="standard-email"
                                    label="Email Id"
                                    margin="normal"
                                    value={this.state.email}
                                    onChange={this.handleChange('email')}
                                    helperText={this.state.msg_email}
                                    error={this.state.msg_email.length > 0}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField style={{ margin: '1vw', width: '90%' }}
                                    id="standard-password"
                                    label="Password"
                                    margin="normal"
                                    type='password'
                                    value={this.state.password}
                                    onChange={this.handleChange('password')}
                                    helperText={this.state.msg_password}
                                    error={this.state.msg_password.length > 0}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} >
                                <TextField style={{ margin: '1vw', width: '90%' }}
                                    id="standard-confirm-password"
                                    label="Confirm Password"
                                    margin="normal"
                                    type='password'
                                    value={this.state.confirm}
                                    onChange={this.handleChange('confirm')}
                                    helperText={this.state.msg_confirm}
                                    error={this.state.msg_confirm.length > 0}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} >
                                <Button type='submit' style={{ padding: 14, color: '#2af', }}>
                                    Register
                        </Button>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </div>
        )
    }
}
class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            isCalling: false,
            msg_email: '',
            msg_password: '',
        }
    }
    clearMsg = () => {
        this.setState({
            msg_email: '',
            msg_password: ''
        });
    }
    handleChange = name => event => {
        this.setState({ [name]: event.target.value })
    }
    signIn = async e => {
        e.preventDefault();
        this.setState({ isCalling: true })
        const { email, password } = this.state;
        console.log('form submitted')
        const res = await JsonQuery('post', 'sign/login', { email, password });
        this.setState({ isCalling: false })
        console.log(res);
        this.clearMsg();
        if (res.errors) {
            res.errors.map(err => {
                const fieldName = 'msg_' + err.param;
                this.setState({ [fieldName]: err.msg });
            });
        } else {
            SetCookie('logauti', res.id);
            SetCookie('logautx', this.state.email);
            SetCookie('logauty', res.connection_string);
            this.props.history.push('/dashboard')
        }
    }
    render() {
        return (
            <div style={{ height: '80vh', display: 'grid', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ margin: '2vw' }}>
                    <h1>Sign In</h1>
                    {this.state.isCalling ? <LinearProgress /> : ''}
                    <form onSubmit={this.signIn}>
                        <Grid container >
                            <Grid item xs={12} md={6} >
                                <TextField style={{ margin: '1vw', width: '90%' }}
                                    id="standard-email"
                                    label="Email Id"
                                    margin="normal"
                                    value={this.state.email}
                                    onChange={this.handleChange('email')}
                                    helperText={this.state.msg_email}
                                    error={this.state.msg_email.length > 0}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField style={{ margin: '1vw', width: '90%' }}
                                    id="standard-password"
                                    label="Password"
                                    margin="normal"
                                    type='password'
                                    value={this.state.password}
                                    onChange={this.handleChange('password')}
                                    helperText={this.state.msg_password}
                                    error={this.state.msg_password.length > 0}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} >
                                <Button type='submit' style={{ padding: 14, color: '#2af', }}>
                                    Sign In
                        </Button>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </div>
        )
    }
}
export class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRegister: false,
            isSignIn: false
        }
    }
    toggleRegister = () => {
        this.setState({
            isRegister: !this.state.isRegister
        })
    }
    toggleSignIn = () => {
        this.setState({
            isSignIn: !this.state.isSignIn
        })
    }
    redrt = async () => {
       // const res = await JsonQueryAuth('POST', 'info/getUser', { });
    }
    componentDidMount() {
        document.body.className="body-a" 
    }
    render() {
        return (
            <React.Fragment>
                <div className='body1'>
                    <Drawer open={this.state.isRegister} onClose={this.toggleRegister}>
                        <Register />
                    </Drawer>
                    <Drawer anchor="top" open={this.state.isSignIn} onClose={this.toggleSignIn}>
                        <SignIn history={this.props.history} />
                    </Drawer>
                    <div className='Page'>
                        <div id="title" className="slide header">
                            <div>
                                <Grid container alignItems='center' justify='center'>
                                    <Grid item xs={12}>
                                        <h1 style={{ color: ColorPalate.greenLight, fontSize: '2.4rem' }}>Virtual Battle Ground</h1>
                                        <h1 style={{ color: '#bbb', fontSize: '1.4rem' }}>Start making money through competetive gaming</h1>
                                    </Grid>
                                    <br /><br />
                                    <Grid item xs={12} spacing={16} container alignItems='center' justify='center'>
                                        <Grid item xs={12} md={6} container alignItems='center' justify='center'>
                                            <Button style={{ color: ColorPalate.greenLight }}
                                                onClick={this.toggleRegister}
                                            ><div className="boton">

                                                    <svg viewBox="0 0 290 70" width="100%" heigth="100%" >
                                                        <line className="L-T" x1="0" y1="-15" x2="0" y2="20" />
                                                        <line className="L-B" x1="0" y1="50" x2="0" y2="85" />

                                                        <line className="R-T" x1="290" y1="-15" x2="290" y2="20" />
                                                        <line className="R-B" x1="290" y1="50" x2="290" y2="85" />

                                                        <line className="T-L" x1="-125" y1="0" x2="20" y2="0" />
                                                        <line className="T-R" x1="270" y1="0" x2="415" y2="0" />

                                                        <line className="B-R" x1="270" y1="70" x2="415" y2="70" />
                                                        <line className="B-L" x1="-125" y1="70" x2="20" y2="70" />
                                                    </svg>
                                                    <span>Register</span>
                                                </div>
                                            </Button>
                                        </Grid>
                                        <Grid item xs={12} md={6} container alignItems='center' justify='center'>
                                            <Button style={{ color: ColorPalate.greenLight }}
                                                onClick={this.toggleSignIn}
                                            ><div className="boton"
                                            >

                                                    <svg viewBox="0 0 290 70" width="100%" heigth="100%" >
                                                        <line className="L-T" x1="0" y1="-15" x2="0" y2="20" />
                                                        <line className="L-B" x1="0" y1="50" x2="0" y2="85" />

                                                        <line className="R-T" x1="290" y1="-15" x2="290" y2="20" />
                                                        <line className="R-B" x1="290" y1="50" x2="290" y2="85" />

                                                        <line className="T-L" x1="-125" y1="0" x2="20" y2="0" />
                                                        <line className="T-R" x1="270" y1="0" x2="415" y2="0" />

                                                        <line className="B-R" x1="270" y1="70" x2="415" y2="70" />
                                                        <line className="B-L" x1="-125" y1="70" x2="20" y2="70" />
                                                    </svg>
                                                    <span>Sign In</span>
                                                </div>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>

                        <div id="slide1" className="slide">
                            <div className="title-x">
                                <h1>How It Works</h1>
                                <p>Compete in gaming tournaments and head-to-head challenges with gamers of every skill level on Mobile, Playstation, Xbox and PC. Participate in free-to-play or cash tournaments and Win Big at Virtual Battle Ground.</p>
                            </div>
                        </div>

                        <div id="slide2" className="slide">
                            <div className="title">
                                <h1>Participate in Live Tournaments To Earn More</h1>
                                <p>Lorem ipsum dolor sit amet, in velit iudico mandamus sit, persius dolorum in per, postulant mnesarchum cu nam. Malis movet ornatus id vim, feugait detracto est ea, eam eruditi conceptam in. Ne sit explicari interesset. Labores perpetua cum at. Id viris docendi denique vim.</p>
                            </div>

                            <img src={require('../img/8ball.jpg')} />
                            <img src={require('../img/chess.jpg')} />
                        </div>

                        <div id="slide3" className="slide">
                            <Grid container spacing={16}>
                                <Grid item xs={12} md={6}>
                                    <div className="title-y">
                                        <h1>CREATE ACCOUNT</h1>
                                        <p>Login to Virtual Battle Ground and Add money to wallet</p>
                                    </div>

                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <div className="title-y">
                                        <h1>FIND YOUR GAME</h1>
                                        <p>Search among the Listd game and add to your play list</p>
                                    </div>

                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <div className="title-y">
                                        <h1>CHALLENGE OTHERS</h1>
                                        <p>Search for ohter players and challenge them for free or bet</p>
                                    </div>

                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <div className="title-y">
                                        <h1>WIN AND EARN</h1>
                                        <p>beat other players in tournaments and matches to earn credits.</p>
                                    </div>

                                </Grid>
                            </Grid>

                        </div>

                        <div id="slide4" className="slide header">
                            <h1>The End</h1>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}