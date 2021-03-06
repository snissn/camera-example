import React from 'react'
import View from './View.js'
import Pagination from 'bulma-pagination-react';

import { w3, contractws } from '../../helpers/Web3Helper'
function zip(arr1, arr2, out = {}) {
  arr1.map((val, idx) => {
    out[val] = arr2[idx]
  })
  return out
}

const blendstyle = {
  color: 'white',
}

export default class PublicMessages extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      publicMessages: {
        data: [],
        loaded:false
      },
      total: 0,
      currentPage: 1
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
        await that.fetch()
      },
    )
  }

  async fetch() {
    const response = await this.getPublicMessages()
    this.setState({ publicMessages: { data: response,loaded:true } })
  }

  async componentDidMount() {
    await this.fetch()
    await this.setUpListeners()
  }

  async getPublicMessages() {
    var messages_count = await contractws.methods
      .get_Camera_list_length()
      .call()
console.log(messages_count)
    this.setState({ total: messages_count })

      if(messages_count == 0 ){
        return []
      }
      const COUNT = 2
      const offset = COUNT * (this.state.currentPage - 1)
      const count = Math.min(COUNT, Math.abs(messages_count - offset))
      
      let ret = []
   
      var messages = await contractws.methods.get_last_Camera_N(count, offset).call()
console.log(messages);
      for(var i = messages[0].length-1; i>-1 ; i--){
        var value = []
        for(var key in messages){
          value.push(messages[key][i])
        }
        value.push(i)
        var keys = []
  keys.push(`timestamp`)
  keys.push(`sender`)
  keys.push(`name`)
keys.push(`id`)
        var msg = zip(keys,value)

        ret.push(msg)
      }
     
    return ret
  }

  changePage(pageNumber) {
    this.setState({ currentPage: pageNumber })
    this.componentDidMount()
  }

  render() {
    if (this.state.publicMessages.data.length == 0) {
      if(this.state.publicMessages.loaded){
        return (

<div>
  <span className='sr-only'>
    No Camera yet
  </span>
</div>

)
      }
      return (
<div>
  <span className='sr-only'>
    Loading...
  </span>
</div>
)
    }

    return (
<div>
  {this.state.publicMessages.data.map((data, index) => (
  <View key={index} data={data} />
  ))}

  <Pagination
  pages={Math.ceil(this.state.total / 2)}
  currentPage={this.state.currentPage}
  onChange={page => this.changePage(page)}
  />
</div>
)
  }
}