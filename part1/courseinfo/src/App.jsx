const Header = (props) => {
  return (
    <div>
      <h1>{props.course.name}</h1>
    </div>
  )
}

const Content = (props) => {
  const partElement = props.parts.map((part, index) => {
    return (
      <Part key={index} name={part.name} exercise={part.exercises}/>
    )
  })

  return (
    <div>
      {partElement}
    </div>
  )
}
const Total = (props) => {
  let total = 0;

  props.parts.forEach(p => {
    total += p.exercises;
  })

  return (
    <div>
      <p>Number of exercises {total}</p>
    </div>
  )
}

const Part = (props) => {
  return (
    <p>{props.name} {props.exercise}</p>
  )
}


const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ],
  }

  return (
    <div>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App