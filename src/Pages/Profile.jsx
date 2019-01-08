import React, { Component } from 'react';
import { MainStyles, ColorPalate } from '../Components/MainStyles';

import { Navigation } from '../Components/Navigation';

import { Paper, Grid, } from '@material-ui/core';
import { Card, CardMedia, CardActionArea, CardContent, CardActions, Typography, Button, Divider, CircularProgress } from '@material-ui/core';


export class Profile extends Component {
    render() {
        return (
            <div className='Profile Page'>
                <Navigation active='profile' />
                <section className='ContainerCenter'>
                    <Paper className='Block' style={MainStyles.block}>
                        <h1><i className="fas fa-users"></i> Profile</h1><br />
                        <Grid container spacing={16}>
                            <Grid item xs={12} md={3}>
                                <ProfileCard image={require('../img/default.jpg')} name='spandan' />
                            </Grid>
                            <Grid item xs={12} md={9}>
                                <InfoCard />
                            </Grid>
                        </Grid>
                    </Paper>
                    <Paper className='Block' style={MainStyles.block}>
                        <h1><i className="fas fa-cogs"></i> Profile Settings</h1>
                    </Paper>
                </section>
            </div>
        );
    }
};

export class OtherProfile extends Component {
    render() {
        return (
            <div className='Profile Page'>
                <Navigation />
                <section>

                </section>
            </div>
        );
    }
}

const ProfileCard = ({ image, name, isOwn }) =>
    (
        <Card style={{ background: '#333' }}>
            <CardActionArea>
                <CardMedia
                    style={{ height: 200 }}
                    image={image}
                    title={name}
                />
                <CardContent style={{ height: 20 }}>
                    <Typography gutterBottom variant="h5" component="h1" style={{ color: ColorPalate.greenLight, fontSize: '1.2rem' }}>
                        {name}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions >
                <Button size="small" color="primary" style={{ color: ColorPalate.green, fontSize: '0.6rem' }}>
                    Edit Image
                </Button>
                <Button size="small" color="primary" style={{ color: ColorPalate.green, fontSize: '0.6rem' }}>
                    Edit Name
                </Button>
            </CardActions>
        </Card>
    );
const InfoCard = ({ info, parcents }) => {

    let Info = {
        email: 'chocoboyxp@gmail.com',
        Balance: '900 BP',
        level: 4,
        leader_points: 1023,
        total_winning: '0 BP',
        total_wins: '4',
        total_matches: '8'
    }
    let Percents = {
        next_level: 26,
        win_persentage: 50
    }

    Info = Object.entries(Info);
    //Percents = Object.entries(Percents);

    return (
        <Paper style={{ backgroundColor: '#444', padding: 16, color: ColorPalate.greenLight }}>
            <Grid container>
                {Info.map(inf => (
                    <Grid item container xs={12} key={inf[0]}>
                        <Grid item xs={12} md={5} style={MainStyles.heading}>{`${inf[0].replace(/_/g, " ")} :`}</Grid>
                        <Grid item xs={12} md={7} style={MainStyles.text}>{inf[1]}</Grid>
                    </Grid>
                ))}
                <Divider />
                <br />
                <Grid item container xs={12} space={12} justify='center' alignItems='center'>
                    <Grid item xs={6}>
                    <CircularProgress thickness={12}
                     variant="static" 
                     value={Percents.win_persentage} 
                     size='80%' 
                     style={{color:
                     ColorPalate.greenLight}}/>
                    </Grid>
                    <Grid item xs={6}>
                    <CircularProgress thickness={16}
                     variant="static" 
                     value={Percents.next_level} 
                     size='80%'style={{color: 
                      ColorPalate.greenLight}}/>
                    </Grid>
                    <Grid item xs={6}>
                    <span>win: { Percents.win_persentage }%</span>
                    </Grid>
                    <Grid item xs={6}>
                    <span>next level: {Percents.next_level}%</span>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
}
