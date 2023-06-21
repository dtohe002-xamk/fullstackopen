const Header = ({ courseName }) => {
    return (
      <>
        <h3>{courseName}</h3>
      </>
    )
  }
  
  const Part = (props) => {
    return (
      <>
        <p>{props.name} {props.exercises}</p>
      </>
    )
  }
  
  const Content = ({ parts }) => {
    return (
      <>
        {parts.map(parts =>
          <Part key={parts.id} 
                name={parts.name} 
                exercises={parts.exercises} 
          />
        )}
      </>
    )
  }
  
  const Total = ({ parts }) => {
    const exercisesSum = parts.reduce( (s, p) => (s + p.exercises), 0)
  
    return (
      <>
        <b>
          Total of {exercisesSum} exercises 
        </b>
      </>
    )
  }
  
  const Course = ( props ) => {
    return (
      <div>
        <Header courseName={props.name} />
        <Content parts={props.parts} />
        <Total parts={props.parts} />
      </div>
    )
  }

  export default Course