const Total = ({ parts }) => {
  const calculateTotal = parts.reduce((sum,part) => sum + part.exercises, 0)

  return (
    <b>
      total of {calculateTotal} exercises
    </b>
  )
}

export default Total