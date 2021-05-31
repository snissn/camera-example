import React, { Component, useEffect, useState } from 'react'
import Add from '../components/Camera/Add'
import Index from '../components/Camera/Index'

import { setupAccounts } from '../helpers/Web3Helper'

export default (props) => {
  useEffect(() => {
    setupAccounts()
  }, [])

  return (
    <div className="container">
      <Add />
      <Index />
    </div>
  )
}
