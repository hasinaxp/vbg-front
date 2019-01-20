import React, { Component } from 'react';
import { MainStyles, ColorPalate } from '../Components/MainStyles';

import { JsonQueryAuth, HostAddress } from '../Services/Query'
import openSocket from 'socket.io-client';

import { Grid, Paper } from '@material-ui/core'
import { TextField, Button, Fab } from '@material-ui/core'
import { Card, CardActionArea, CardMedia, CardContent } from '@material-ui/core'
import { List, ListItem, ListItemText, Avatar } from '@material-ui/core'
import { createMuiTheme, Theme, MuiThemeProvider } from '@material-ui/core'

const myTheme = createMuiTheme({
    palette: {
        type: 'dark',
    },
})

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
        }
    }
    load = async e => {

        const res = await JsonQueryAuth('get', `match/${this.state.match_id}`)
        if (res.status === 'ok') {
            const { match_id, game, challenger, challenged, chat_id, sender, contact_string, time, bet } = res;
            this.setState({
                game, challenger, challenged, chat_id, sender, contact_string, time, bet, chatVisible: true
            })
        }
    }
    componentDidMount() {
        this.load()
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
                                    <ListItem button>
                                        <Avatar
                                            alt="Remy Sharp"
                                            src={`${HostAddress}user/${this.state.challenger.folder}/${this.state.challenger.image}`}
                                            style={{ width: 50, height: 50 }} />
                                        <ListItemText
                                            primary={<span style={{ color: ColorPalate.green, fontSize: '1.4rem' }}> Challenger </span>}
                                            secondary={<span style={{ color: ColorPalate.greenLight, fontSize: '1.2rem' }}> {this.state.challenger.full_name} </span>} />
                                    </ListItem>
                                    <ListItem button>
                                        <Avatar
                                            alt="Remy Sharp"
                                            src={`${HostAddress}user/${this.state.challenged.folder}/${this.state.challenged.image}`}
                                            style={{ width: 50, height: 50 }} />
                                        <ListItemText
                                            primary={<span style={{ color: ColorPalate.green, fontSize: '1.4rem' }}> challenged </span>}
                                            secondary={<span style={{ color: ColorPalate.greenLight, fontSize: '1.2rem' }}> {this.state.challenged.full_name} </span>} />
                                    </ListItem>
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
                                    <Button variant='outlined' style={{ width: '40%', margin: '2.5%', padding: 16, color: ColorPalate.greenLight }}>Clain Victory</Button>
                                    <Button variant='outlined' style={{ width: '40%', margin: '2.5%', padding: 16, color: ColorPalate.greenLight }}>Admit Defeat</Button>
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
        console.log(this.state.chat_id)
        LoadChats(this.state.chat_id, (data) => {
            this.setState({
                messages: data.chat.log
            })
            const chatbox = this.chatbox.current
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