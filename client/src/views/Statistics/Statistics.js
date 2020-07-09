import React, { Component } from 'react'
import { connect } from 'react-redux'

import "./Statistics.scss"

export class Statistics extends Component {


    render() {
        return (
            <div >
                Statistics
            </div>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Statistics)
