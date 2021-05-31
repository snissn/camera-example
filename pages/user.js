import React, { Component, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { setupAccounts, w3, contractws } from '../helpers/Web3Helper'


function zip(arr1, arr2, out = {}) {
  arr1.map((val, idx) => {
    out[val] = arr2[idx]
  })
  return out
}

  import ViewPicture from '../components/Picture/View.js'
  import ViewCamera from '../components/Camera/View.js'

export default (props) => {
  const router = useRouter()

  const [address, setAddress] = useState('')



    const [messages_Picture_count, set_messages_Picture_count] = useState(0)
    const [messages_Picture, set_messages_Picture] = useState(null)


    const [messages_Camera_count, set_messages_Camera_count] = useState(0)
    const [messages_Camera, set_messages_Camera] = useState(null)



  useEffect(() => {
      if(router.query.address){
        setAddress(router.query.address)
      }
    console.log('hi',router.query)
   } )


  async function setUpListeners() {
      contractws.events.allEvents(
        'allEvents',
        {
          fromBlock: 'latest',
        },
        async function (err, data) {
          await fetchMessages()
        },
      )
    }

    async function fetchMessages() {
      if(address == ''){return}
      var messages_Picture_count = await contractws.methods.get_Picture_user_length(address).call()
      set_messages_Picture_count ( messages_Picture_count )

      if(messages_Picture_count > 0 ){
        const offset_Picture = messages_Picture_count - 1
        var messages = await contractws.methods.get_last_Picture_user_N(address,1, offset_Picture).call()
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

        set_messages_Picture( msg)
      }
      var messages_Camera_count = await contractws.methods.get_Camera_user_length(address).call()
      set_messages_Camera_count ( messages_Camera_count )

      if(messages_Camera_count > 0 ){
        const offset_Camera = messages_Camera_count - 1
        var messages = await contractws.methods.get_last_Camera_user_N(address,1, offset_Camera).call()
        var value = []
        var keys = []
          keys.push(`timestamp`)
          value.push(messages[0][0])          
          keys.push(`sender`)
          value.push(messages[1][0])          
          keys.push(`name`)
          value.push(messages[2][0])          

        var msg = zip(keys,value)

        set_messages_Camera( msg)
      }
  }

  useEffect(() => {
     setUpListeners()
  })

  useEffect(() => {
   

  
     fetchMessages()

  },[address])

  return( <div className="container">
    
  
      <div>Picture</div>
      <div>Camera</div>

        <nav className="panel is-primary">
          <p className="panel-heading">
              <span className="bd-snippet-tag bd-is-example"><a className="has-text-white" href="/Picture">Picture</a> </span>
              <span className="tag">{messages_Picture_count}</span>
          </p>
          <div className="panel-block">
          {
            messages_Picture && (
              <ViewPicture data={ messages_Picture } />
            )
          }
          </div>
        </nav>
        <nav className="panel is-primary">
          <p className="panel-heading">
              <span className="bd-snippet-tag bd-is-example"><a className="has-text-white" href="/Camera">Camera</a> </span>
              <span className="tag">{messages_Camera_count}</span>
          </p>
          <div className="panel-block">
          {
            messages_Camera && (
              <ViewCamera data={ messages_Camera } />
            )
          }
          </div>
        </nav>
    
   </div>)
}
