import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
 
  const points = new Uint8Array(anecdotes.length);
  const [votes, setVotes] = useState(points)
  const [selected, setSelected] = useState(0)
  const [mostVoted, setMostVoted]= useState(0)

  const giveRandomAnecdote = () => {
      return(
        setSelected(Math.floor( Math.random() * anecdotes.length))
      )
    }

  const voteForAnecdote = () => {
    const copyofvotes = [...votes]
    copyofvotes[selected] = copyofvotes[selected] + 1
    if (copyofvotes[selected] + 1 > votes[mostVoted]) {
        setMostVoted(selected)
    }
      console.log("most voted", mostVoted)
      console.log("votes", votes)
    return(
        setVotes(copyofvotes)
    )
  }

    const Button = ({text, handleClick}) => {
        return (
            <div>
            <button onClick={handleClick}>
            {text}
            </button>
            </div>
        )
    }
    
    const Header = ({text}) => {
        return (
            <div>
            <h1> {text} </h1>
            </div>
        )
    }

  return (
    <div>
      <Header text="Anecdote of the day" />
      {anecdotes[selected]}
      <div>
      has {votes[selected]} votes
      </div>
      <Button text="vote" handleClick={voteForAnecdote} />
      <Button text="random anecdote" handleClick={giveRandomAnecdote} />
      <Header text="Anecdote with most votes" />
      {anecdotes[mostVoted]}
      <div>
      has {votes[mostVoted]} votes
      </div>
      </div>
  )
}

export default App
