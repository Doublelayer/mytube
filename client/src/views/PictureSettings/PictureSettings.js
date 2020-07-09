import React, { Component } from 'react'
import { connect } from 'react-redux'

import "./PictureSettings.scss"

export class PictureSettings extends Component {


    render() {
        return (
            <div >
                PictureSettings
            </div>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(PictureSettings)
