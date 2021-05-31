import React, { useState, useEffect } from 'react'
import { auth } from '../../lib/db'
import ImageUpload from '../ImageUpload.js'

import { contract, w3 } from '../../helpers/Web3Helper'

export default function Send() {

    const [name, setname] = useState() 
  

  const [errorMessage, setErrorMessage] = useState()
  const [sendStatus, setSendStatus] = useState()
  const [user, setUser] = useState(false)

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user)
    })
  }, [])

  const mySubmitHandler = async (event) => {
    event.preventDefault()
    let fail = false;
    if (name === '') {
      setErrorMessage('Your name cannot be empty')
      fail = true;
    } 
    if(fail){

    }
    else {
      setSendStatus('Sending')
      contract.methods
        .new_Camera(name) 
        .estimateGas()
        .then((gasEstimate) => {
          contract.methods
            .new_Camera(name) 
            .send({ gas: gasEstimate  })
            .then(() => {
              setSendStatus('')
                  setname("")
            })
        })
    }
  }
  if (user) {
    return (
      <form className="p-6" onSubmit={mySubmitHandler}>







        <div className="field is-grouped">
          <p className="control is-expanded">
            <input
              autoComplete="off"
              className="input"
              placeholder="Type your name here..."
              type="text"
              name="name"
              value={ name    }
              onChange={(event) => setname(event.target.value)}
              disabled={sendStatus === 'Sending'}
            />
          </p>

          <p className="control">
            <input
              className={
                sendStatus === 'Sending'
                  ? 'button is-info is-bold'
                  : 'button is-warning has-text-white is-bold'
              }
              type="submit"
              value={sendStatus === 'Sending' ? 'Sharing...' : 'Share'}
            />
          </p>
          <p>{errorMessage && errorMessage}</p>
        </div>



      </form>
    )
  } else {
    return (
      <section className="hero is-warning mb-6">
        <div className="hero-body">
          <div className="container">
            <h3 className="title has-text-centered is-5">Please sign in to create a Camera</h3>
          </div>
        </div>
      </section>
    )
  }
}
