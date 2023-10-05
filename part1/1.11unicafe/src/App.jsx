import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] =useState(0)
  
  const increaseGoodByOne = () => {
    console.log('hello')
    setGood(good + 1)
    setTotal(total+1)
  }

  const increaseNeutralByOne = () => {
    setNeutral(neutral+ 1)
    setTotal(total+1)
  }
  
  const increaseBadByOne = () => {
    setBad(bad + 1)
    setTotal(total+1)
  }

  return (
    <div>
      <Header text="Give feedback" />
      
      <Button text='good' handleClick={increaseGoodByOne} />
      <Button text="neutral" handleClick={increaseNeutralByOne} />
      <Button text="bad" handleClick={increaseBadByOne} />
      
      <Statistics good={good} neutral={neutral} bad={bad} total={total} />

    </div>
  )
}


const Header = ({text}) => {
  console.log('hello from header', text)
  return (
    <div>
    <h1> {text} </h1>
    </div>
  )
}

const StatisticsLine = ({text, value}) => {
  console.log('display update')
  return (
    <div>
    {text}
    {value}
    </div>
  )
}

const Button = ({text, handleClick}) => {
  console.log(text, 'button pressed')
  return (
    <button onClick={handleClick}>
    {text}
    </button>
  )
}

const Statistics = ({good, neutral, bad, total}) => {
    if (total === 0) {
        return (
        <div>
        <Header text='statistics' />
        <p> No feedback given </p>
        </div>
        )
    }
    return ( 
        <div>
        <Header text='statistics' />

        <StatisticsLine text='good ' value={good} />
        <StatisticsLine text='neutral ' value={neutral} />
        <StatisticsLine text='bad ' value={bad} />
        <StatisticsLine text='all ' value={total} />
        <StatisticsLine text='average ' value={(good-bad)/total} />
        <StatisticsLine text='positive ' value={good/total*100 +"%"} />
        </div>

    )
}


const Average = () => {
  return (
    <StatisticsLine text='average ' value={(good-bad)/total} />
  )
}

const Positive = () => {
  return (
    <StatisticsLine text='positive ' value={good/total*100 +"%"} />
  )
}

export default App
