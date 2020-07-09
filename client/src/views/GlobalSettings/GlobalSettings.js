import React, { Component } from 'react'
import { connect } from 'react-redux'

import "./GlobalSettings.scss"

export class GlobalSettings extends Component {


    render() {
        return (
            <div >
                GlobalSettings
            </div>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(GlobalSettings)
