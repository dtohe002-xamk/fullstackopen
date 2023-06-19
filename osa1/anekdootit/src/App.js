import { useState } from 'react'

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const getRandomInt = (max) => {
  return Math.floor(Math.random() * max)
}

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const DisplayVoteCount = ({ value }) => {
  return (
    <div>
      has {value} votes
    </div>
  )
}

const DisplayVotes = (props) => {
  if (props.selected != null) {
    return (
      <div>
        <h1>{props.text}</h1>
        {props.anecdotes[props.selected]}
        <DisplayVoteCount value={props.votes} />
      </div>
    )
  }
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(new Uint8Array(7))
  
  // track the most voted entry to avoid the cumbersome iteration of the points array
  const [mostVoted, setMostVoted] = useState(null)
  const [mostVotes, setMostVotes] = useState(0)

  const nextAnecdote = () => setSelected(getRandomInt(7))

  const checkMostVotes = (value) => {
    if (value > mostVotes) {
      setMostVotes(value)
      setMostVoted(selected)      
    }
  }

  const voteSelected = () => {
    let pointsCopy = [...points]
    pointsCopy[selected] += 1
    checkMostVotes(pointsCopy[selected])
    setPoints(pointsCopy)
  }

  return (
    <div>
      <DisplayVotes 
        text="Anecdote of the day" 
        anecdotes={anecdotes} selected={selected} votes={points[selected]}
      />
      <Button handleClick={voteSelected} text="vote" />
      <Button handleClick={nextAnecdote} text="next anecdote" />
      <DisplayVotes 
        text ="Anecdote with most votes"
        anecdotes={anecdotes} selected={mostVoted} votes={mostVotes}
      />
    </div>
  )
}

export default App
