import React, { Component } from 'react';

import { Navigation } from '../Components/Navigation';

export class Tournament extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <div className='Tournament Page'>
                <Navigation active='tournament'/>
            </div>
        )
    }
}