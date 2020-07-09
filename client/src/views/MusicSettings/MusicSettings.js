import React, { Component } from 'react'
import { connect } from 'react-redux'

import "./MusicSettings.scss"

export class MusicSettings extends Component {


    render() {
        return (
            <div >
                MusicSettings
            </div>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(MusicSettings)
