import Part from './Part'
const Content = ({ parts }) => {

  let partsList = parts.map(part => <Part key={part.id} part={part} />)

  return (
    <div>
      {partsList}
    </div>
  )
}

export default Content