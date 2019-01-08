import React, { Component } from 'react';

import { Navigation } from '../Components/Navigation';

export class Wallet extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <div className='Wallet Page'>
                <Navigation active='wallet'/>
            </div>
        )
    }
}