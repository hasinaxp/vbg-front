import {createMuiTheme} from '@material-ui/core'

const colors = {
    blackLight: '#334',
    greenLight: '#76ff03',
    green: '#aaa',
}

export const myTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            light: '#bbb',
            main: colors.greenLight,
            dark: '#76ff03'
         },
         secondary: {
           main: colors.greenLight,
         },
         textColor: "#bdbdbd",
      },
    typography: { 
        useNextVariants: true
     },
     appBar: {
        "textColor": "#33691e"
    },
    card: {
        "titleColor": "rgba(118, 255, 3, 0.87)",
        "subtitleColor": "rgba(224, 224, 224, 0.54)"
    },
    overlay: {
        "backgroundColor": "rgba(0, 0, 0, 0.87)"
    },
    paper: {
        backgroundColor: "rgba(33, 33, 33, 0.66)"
    },
})

export const ColorPalate = colors;


export const  MainStyles = {
    nav: {
        backgroundColor: colors.blackLight,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
        color: colors.greenLight
    },
    logo: {
        width: 140
    },
    sideNav: {
        width: 240,
        height: '100%',
        color: colors.greenLight,
        backgroundColor: colors.blackLight,
    },
    sideNavList: {
        backgroundColor: colors.blackLight,
        padding: 8,
        color: colors.greenLight,
    },
    block: {
        backgroundColor: 'rgba(0, 0, 10, 0.1)',
        color: colors.greenLight,
    },
    heading: {
        color: colors.greenLight,
        padding: 8,
        fontSize: '1.3rem',
        fontWeight: 'bolder'
    },
    text: {
        color: colors.green,
        padding: 8,
        fontSize: '1.2rem',
    },
    paper: {
        backgroundColor: colors.blackLight
    },
    boxChallenger: {
        height: window.innerWidth < 600 ? 70 : 100,
        width: window.innerWidth < 600 ? 70: 100,
    },
    boxGame : {
        height: '140px',
        clipPath: 'polygon(0% 0%, 60% 0, 60% 100%, 31% 71%, 0 100%)',
       
    },
    expansion: {
        padding: 10,
        backgroundColor: 'rgba(0, 0, 10, 0.2)',
        color: colors.green,
    },
    header: {
        fontSize: '1.3rem',
        fontWeight: 'bolder',
        color: colors.greenLight
    },
    gameBtn: {
        position: 'absolute',
        zIndex: 4,
        top: window.innerWidth < 600 ?'84vh' : '90vh',
        right: window.innerWidth < 600 ? 20 : 40,
        transform: 'scale(1.2)'
    },
    gridList: {
        minWidth: 500,
        maxHeight: 450,
    },
    centerContainer: {
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column'
    },
}

