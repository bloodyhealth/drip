import React, { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { LocalDate } from '@js-joda/core'

const DateContext = createContext()

export const DateProvider = ({ children }) => {
  const [date, setDate] = useState(LocalDate.now().toString())

  return (
    <DateContext.Provider value={{ date, setDate }}>
      {children}
    </DateContext.Provider>
  )
}

DateProvider.propTypes = {
  children: PropTypes.node,
}

export const useDate = () => {
  const { date, setDate } = useContext(DateContext)
  return { date, setDate }
}
