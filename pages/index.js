import React, { Component } from 'react'
import TimeAgo from 'react-timeago'
import User from '../components/User.js'

import { setupAccounts, w3, contractws } from '../helpers/Web3Helper'

  import ViewPicture from '../components/Picture/View.js'
  import ViewCamera from '../components/Camera/View.js'

function zip(arr1, arr2, out = {}) {
  arr1.map((val, idx) => {
    out[val] = arr2[idx]
  })
  return out
}

export default class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      messages_Picture_count: 0,
      messages_Picture: null,
      messages_Camera_count: 0,
      messages_Camera: null,
    }
  }

  async setUpListeners() {
    var that = this
    contractws.events.allEvents(
      'allEvents',
      {
        fromBlock: 'latest',
      },
      async function (err, data) {
        await that.fetchMessages()
      },
    )
  }

  async componentDidMount() {
    setupAccounts()
    await this.fetchMessages()
    await this.setUpListeners()
  }

  async fetchMessages() {
      var messages_Picture_count = await contractws.methods.get_Picture_list_length().call()
      this.setState({ messages_Picture_count: messages_Picture_count })

      if(messages_Picture_count > 0 ){
        const offset_Picture = messages_Picture_count - 1
        var messages = await contractws.methods.get_last_Picture_N(1, offset_Picture).call()

        var value = []
        var keys = []
          keys.push(`timestamp`)
          value.push(messages[0][0])          
          keys.push(`sender`)
          value.push(messages[1][0])          
          keys.push(`image`)
          value.push(messages[2][0])          
          keys.push(`caption`)
          value.push(messages[3][0])          

        var msg = zip(keys,value)

        this.setState({ messages_Picture: msg })
      }
      var messages_Camera_count = await contractws.methods.get_Camera_list_length().call()
      this.setState({ messages_Camera_count: messages_Camera_count })

      if(messages_Camera_count > 0 ){
        const offset_Camera = messages_Camera_count - 1
        var messages = await contractws.methods.get_last_Camera_N(1, offset_Camera).call()

        var value = []
        var keys = []
          keys.push(`timestamp`)
          value.push(messages[0][0])          
          keys.push(`sender`)
          value.push(messages[1][0])          
          keys.push(`name`)
          value.push(messages[2][0])          

        var msg = zip(keys,value)

        this.setState({ messages_Camera: msg })
      }
  }

  render() {
    return (
      <div className="container">
        <nav className="panel is-primary">
          <p className="panel-heading">
              <span className="bd-snippet-tag bd-is-example"><a className="has-text-white" href="/Picture">Picture</a> </span>
              <span className="tag">{this.state.messages_Picture_count}</span>
          </p>
          <div className="panel-block">
          {
            this.state.messages_Picture && (
              <ViewPicture data={ this.state.messages_Picture } />
            )
          }
          </div>
        </nav>
        <nav className="panel is-primary">
          <p className="panel-heading">
              <span className="bd-snippet-tag bd-is-example"><a className="has-text-white" href="/Camera">Camera</a> </span>
              <span className="tag">{this.state.messages_Camera_count}</span>
          </p>
          <div className="panel-block">
          {
            this.state.messages_Camera && (
              <ViewCamera data={ this.state.messages_Camera } />
            )
          }
          </div>
        </nav>
      </div>
    )
  }
}
