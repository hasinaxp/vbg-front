import React,{ Component } from 'react'
import BracketStyle from './Bracket.module.css'

const StyleSheet = {
    bracketContainer : {
        width : '90%',
        height : '40vh',
        overflow : 'scroll',
        display: 'flex',
        alignItems : 'center'
    },
    column : {
        width: '300px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent : 'space-between',
        alignItems : 'center'
    },
    bracket : {
        flex: 1,
        width: '100%',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems : 'center',
    },
    match : {
        backgroundColor : '#555',
        color: '#bbb',
        width: 100,
        height: 50,
        boxShadow: '0px 0px 10px 1px #222',
    }
}

export class TournamentBracket extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data : [
                [{x: 1, y :2}, {x:3 , y :2}, {x:3 , y :2}, {x:3 , y :2}],
                [{x:2 , y :3}, {x:3 , y :2}],
                [{x:2 , y :2}]
            ]
        }
    }
    render() {
        return(
        <div style={StyleSheet.bracketContainer}>
           {/*  <div style={{position: "relative", zIndex: 1}}>
            <div > 
            </div>
            

            </div>*/}
            {
                this.state.data.map( (round, j) => {
                    return(
                        <div style={StyleSheet.column} key={Math.random() * 10000 }>
                            {
                                round.map( (match, i) => {
                                    return(
                                        <div style={StyleSheet.bracket}>
                                            <div style={StyleSheet.match} className={BracketStyle.Prev}>
                                            {match.x} : {match.y}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                })
            }
            <Bracket />
        </div>
        )
    }
}

class Bracket extends Component {
    render() {
        return(
            <div className={BracketStyle.bracket}>

            </div>
        )
    }
}