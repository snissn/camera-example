import React, { Component, useEffect, useState } from 'react'
import Add from '../components/Picture/Add'
import Index from '../components/Picture/Index'

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
