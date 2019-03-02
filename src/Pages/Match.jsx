import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { MainStyles, ColorPalate, myTheme } from '../Components/MainStyles';

import { JsonQueryAuth, PostQueryAuth, HostAddress, getCookie } from '../Services/Query'
import openSocket from 'socket.io-client';

import { Grid, Paper } from '@material-ui/core'
import { TextField, Button, Fab } from '@material-ui/core'
import { Card, CardActionArea, CardMedia, CardContent } from '@material-ui/core'
import { List, ListItem, ListItemText, Avatar } from '@material-ui/core'
import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core'

const socket = openSocket('http://localhost:3000');

function LoadChats(chat_id, cb) {
    const responseUrl = "msgcame" + chat_id;
    socket.on(responseUrl, data => {
        cb(data)
    })
}

export class Match extends Component {
    constructor(props) {
        super(props)
        const urlFragments = window.location.href.split('/');
        const match_id = urlFragments[urlFragments.length - 1];
        this.state = {
            match_id: match_id,
            bet: '',
            challenger: {},
            challenged: {},
            game: {},
            time: '',
            sender: '',
            state: '',
            chat_id: '',
            contact_string: '',
            chatVisible: false,
            is_c : 0,
            isAdmitDefeat : false,
            isClaimVectory : false
        }
    }
    componentDidMount() {
        this.load()
    }
    load = async e => {

        const res = await JsonQueryAuth('post', `match/m/${this.state.match_id}`, {})
        if (res.status === 'ok') {
            const { game, challenger, challenged, chat_id, sender, contact_string, time, bet } = res;
            const myId = getCookie('logauti')
            let is_c = 0
            if(myId === challenger._id) is_c = 1
            this.setState({
                game, challenger, challenged, chat_id, sender, contact_string, time, bet, is_c, chatVisible: true
            })
        }
    }
    toggleAdmitDefeat = () => {
        this.setState({
            isAdmitDefeat : !this.state.isAdmitDefeat
        })
    }
    toggleClaimVictory = () => {
        this.setState({
            isClaimVectory : !this.state.isClaimVectory
        })
    }
    claimVictory = async e => {
        e.preventDefault()
        const imageFile = e.target.files[0]
        let x = imageFile.name.split('.');
        x = x[x.length - 1]
        let fd = new FormData()
        fd.append('image', imageFile, `${this.state.match_id}.${x}`)
        fd.append('m_id', this.state.match_id)
        fd.append('is_c', this.state.is_c)
        const res = await PostQueryAuth('match/claimVectory', fd)
        if (res.status === 'ok') {
            this.toggleClaimVictory()
        }
    }
    admitDefeat = async () => {
        const data = {
            m_id : this.state.match_id,
            is_c : this.state.is_c
        }
        const res = await JsonQueryAuth('post', 'match/admitDefeat', data)
        if(res.status === 'ok') {
            this.props.history.push('/dashboard')
        }
    }

    render() {
        return (
            <React.Fragment>
                <MuiThemeProvider theme={myTheme}>
                    <div className='Match Page'>
                        <Grid container justify='center' alignItems='center' >
                            <Grid item xs={12} md={4} container justify='center' alignItems='center' >
                                <Card style={{ width: '100%', margin: '20px' }}>
                                    <CardActionArea>
                                        <CardMedia
                                            style={{ height: 200 }}
                                            image={`${HostAddress}gameimg/${this.state.game.image}`}
                                            title={this.state.game.name}
                                        />
                                        <CardContent style={{ ...MainStyles.paper, color: ColorPalate.greenLight }}>
                                            <h2>{this.state.game.name}</h2>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                                <List style={{ ...MainStyles.paper, width: '100%', margin: '20px' }}>
                                    <ListItem button >
                                        <ListItemText
                                            primary={<span style={{ color: ColorPalate.green, fontSize: '1.4rem' }}> Match Id </span>}
                                            secondary={<span style={{ color: ColorPalate.greenLight, fontSize: '1.2rem' }}> {this.state.match_id}</span>} />
                                    </ListItem>
                                    <ListItem button >
                                        <ListItemText
                                            primary={<span style={{ color: ColorPalate.green, fontSize: '1.4rem' }}> Opponent's  Contact</span>}
                                            secondary={<span style={{ color: ColorPalate.greenLight, fontSize: '1.2rem' }}> {this.state.contact_string} </span>} />
                                    </ListItem>
                                    <Link to={`/profileOther/${this.state.challenged._id}`} style={{ textDecoration: 'none', color: ColorPalate.greenLight }}>
                                    <ListItem button>
                                        <Avatar
                                            alt="Remy Sharp"
                                            src={`${HostAddress}user/${this.state.challenger.folder}/${this.state.challenger.image}`}
                                            style={{ width: 50, height: 50 }} />
                                        <ListItemText
                                            primary={<span style={{ color: ColorPalate.green, fontSize: '1.4rem' }}> Challenger </span>}
                                            secondary={<span style={{ color: ColorPalate.greenLight, fontSize: '1.2rem' }}> {this.state.challenger.full_name} </span>} />
                                    </ListItem>
                                    </Link>
                                    <Link to={`/profileOther/${this.state.challenged._id}`} style={{ textDecoration: 'none', color: ColorPalate.greenLight }}>
                                    <ListItem button>
                                        <Avatar
                                            alt="Remy Sharp"
                                            src={`${HostAddress}user/${this.state.challenged.folder}/${this.state.challenged.image}`}
                                            style={{ width: 50, height: 50 }} />
                                        <ListItemText
                                            primary={<span style={{ color: ColorPalate.green, fontSize: '1.4rem' }}> challenged </span>}
                                            secondary={<span style={{ color: ColorPalate.greenLight, fontSize: '1.2rem' }}> {this.state.challenged.full_name} </span>} />
                                    </ListItem>
                                    </Link>
                                    <ListItem button>
                                        <ListItemText
                                            primary={<span style={{ color: ColorPalate.green, fontSize: '1.4rem' }}> bet </span>}
                                            secondary={<span style={{ color: ColorPalate.greenLight, fontSize: '1.2rem' }}>{this.state.bet}  BP</span>} />
                                    </ListItem>
                                </List>
                            </Grid>
                            <Grid item xs={12} md={8} style={{ padding: 20 }}>
                                <Paper style={{ ...MainStyles.paper, padding: 16 }}>
                                    <h2 style={{ color: ColorPalate.green }}>Evaluation</h2>
                                    <Button variant='outlined'  onClick={this.toggleClaimVictory} style={{ width: '40%', margin: '2.5%', padding: 16, color: ColorPalate.greenLight }}>Clain Victory</Button>
                                    <Button variant='outlined' onClick={this.toggleAdmitDefeat} style={{ width: '40%', margin: '2.5%', padding: 16, color: ColorPalate.greenLight }}>Admit Defeat</Button>
                                </Paper>
                                <Paper style={{ ...MainStyles.paper, padding: 16, height: '60vh', marginTop: 20 }}>
                                    <h2 style={{ color: ColorPalate.green }}>Chat</h2>{
                                        this.state.chatVisible ?
                                            <ChatBox chat_id={this.state.chat_id} chat_id={this.state.chat_id} sender={this.state.sender} />
                                            : ''}
                                </Paper>
                            </Grid>
                        </Grid>
                    </div>
                    <Dialog
                        open={this.state.isClaimVectory}
                        onClose={this.toggleClaimVictory}
                        keepMounted>
                        <DialogTitle>UPLOAD SCREENSHOT</DialogTitle>
                        <DialogContent>
                            <div>
                                <form encType="multipart/form-data">
                                    <Button style={{ margin: '1vw', width: '90%' }}>
                                        <input type='file'
                                            style={{ width: '100%', opacity: 0, position: 'absolute' }}
                                            onChange={this.claimVictory} />
                                        <span><i className="fas fa-upload"></i> upload screenShot</span>
                                    </Button>
                                </form>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Dialog open={this.state.isAdmitDefeat} onClose={this.toggleAdmitDefeat} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">ADMIT DEFEAT</DialogTitle>
                        <DialogContent>
                        <DialogContentText>
                            Do you really want to admit defeat?
                        </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={this.admitDefeat} color='primary'>
                            Ok
                        </Button>
                        <Button onClick={this.toggleAdmitDefeat} color='secondary'>
                            Cancel
                        </Button>
                        </DialogActions>
                    </Dialog>
                </MuiThemeProvider>
            </React.Fragment>
        )
    }
}

class ChatBox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            chat_id: this.props.chat_id,
            messages: [],
            message: ''
        }
        this.chatbox = React.createRef()
    }

    componentDidMount() {
        this.load();
    }
    handleChange = name => e => {
        this.setState({
            [name]: e.target.value
        })
    }
    load = async () => {
        LoadChats(this.state.chat_id, (data) => {
            this.setState({
                messages: data.chat.log
            })
            const chatbox = this.chatbox.current
            if(chatbox !== null && chatbox !== undefined)
            chatbox.scrollTop = chatbox.scrollHeight
        })
        socket.emit('chatResponse', {
            chatId: this.state.chat_id
        })
    }
    sendMsg = async e => {
        e.preventDefault();
        if (this.state.message.length > 0) {
            socket.emit('chatRequest', {
                chatId: this.props.chat_id,
                col: 1,
                sender: this.props.sender,
                text: this.state.message
            })
            this.setState({
                message: ''
            })
        }
    }

    render() {
        return (
            <div>
                <Grid container>
                    <Grid item xs={12}>
                        <div ref={this.chatbox} style={{width: '100%', height: '40vh',overflowY: 'scroll', overflowX:'hidden'}}>
                        <div>
                        {this.state.messages.map(msg => {

                                return (
                                    <div key={msg._id} style={{margin: 10, display:'flex', width:'100%'
                                     }}>
                                     <div style={this.props.sender === msg.name._id? {width: '10%'} : {}}></div>
                                        <Avatar
                                            alt="Remy Sharp"
                                            src={`${HostAddress}user/${msg.name.folder}/${msg.name.image}`}
                                            style={{ width: 50, height: 50 }} />
                                        <div className='msgBubble' style={{width:'80%'}}>
                                            <h4 style={{}}>{msg.name.full_name}</h4>
                                            <h5 style={{}}>{msg.text}</h5>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <form onSubmit={this.sendMsg} className='kami'>
                            <TextField className='kal' style={{ width: window.innerWidth < 600 ? '76%' : '84%' }}
                                label='message'
                                margin='dense'
                                value={this.state.message}
                                onChange={this.handleChange('message')}
                                helperText={'write message'}

                            />
                            <Fab type='submit' style={{ fontSize: 24, color: ColorPalate.greenLight, backgroundColor: '#444' }}>
                                <i className="fas fa-paper-plane"></i>
                            </Fab>
                        </form>
                    </Grid>
                </Grid>
            </div>
        )
    }

}