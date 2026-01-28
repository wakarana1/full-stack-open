import { useState } from 'react'

const FeedbackSection = (props) => {
  return (
    <div>
      <FeedbackHeader />
      <Button title='good' onClick={props.handleGoodClick} />
      <Button title='neutral' onClick={props.handleNeutralClick} />
      <Button title='bad' onClick={props.handleBadClick} />
    </div>
  )
}

const FeedbackHeader = () => {
  return (
    <div>
      <h1>give feedback</h1>
    </div>
  )
}

const Button = ({title, onClick}) => {
  return (
    <button onClick={onClick}>{title}</button>
  )
}

const calculatePositivePercentage = (goodCount, total) => {
  return goodCount > 0 ? (goodCount / total) * 100 : goodCount
}

const Statistics = ({good, neutral, bad}) => {
  let total = good + neutral + bad

  if (total === 0) {
    return (
      <div>
        <h1>statistics</h1>
        <p>
          No feedback given
        </p>
      </div>
    )
  }

  let goodPoints = good * 1
  let badPoints = bad * -1
  let average = (goodPoints + badPoints) / total || 0
  let positivePercentage = `${calculatePositivePercentage(good, total)} %`

  return (
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine title={'good'} value={good} />
          <StatisticLine title={'neutral'} value={neutral} />
          <StatisticLine title={'bad'} value={bad} />
          <StatisticLine title={'all'} value={total} />
          <StatisticLine title={'average'} value={average} />
          <StatisticLine title={'positive'} value={positivePercentage} />
        </tbody>
      </table>
    </div>
  )
}

const StatisticLine = ({title, value}) => {
  return (
      <tr>
        <td>
          {title}
        </td>
        <td>
          {value}
        </td>
      </tr>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
  }

  return (
    <div>
      <FeedbackSection
        handleGoodClick={handleGoodClick}
        handleNeutralClick={handleNeutralClick}
        handleBadClick={handleBadClick}
      />

      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
      />
    </div>
  )
}

export default App