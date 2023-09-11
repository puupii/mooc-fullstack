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

const Display = ({text, currentCount}) => {
  console.log('display update')
  return (
    <div>
    {text}
    {currentCount}
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

        <Display text='good ' currentCount={good} />
        <Display text='neutral ' currentCount={neutral} />
        <Display text='bad ' currentCount={bad} />
        <Display text='all ' currentCount={total} />
        <Display text='average ' currentCount={(good-bad)/total} />
        <Display text='positive ' currentCount={good/total*100 +"%"} />
        </div>

    )
}

const Average = () => {
  return (
    <Display text='average ' currentCount={(good-bad)/total} />
  )
}

const Positive = () => {
  return (
    <Display text='positive ' currentCount={good/total*100 +"%"} />
  )
}

export default App
