
import './App.css'
import ToDo from './todo.jsx'
import Singer  from './Singer.jsx'
import Employee from './employee.jsx'   



function App() {
  const singer = ["Mahfuz","tahsan","Rashed"]
  const employee = [
    { name: 'rashed', age: 20 },
    { name: 'Mojameml', age: 25 },
    { name: 'Mercy', age: 28 }
  ];


  return (
    <>
    {/* <EidSalami name="Rashed" age="20"></EidSalami>
    <EidSalami name="Mojammel" age="25"></EidSalami>
    <EidSalami name="Mercy" age="66"></EidSalami>
    <EidSalami name="GG" age="55"></EidSalami>
    <ToDo name="Function not available" age = "20" isDone ={true}></ToDo>
    <ToDo name="Function  available" age = "20" isDone ={false}></ToDo> */}

    {
      singer.map(singer => <Singer singer={singer}></Singer>)
    }

    {
      employee.map(emp => <Employee key={emp.name} name={emp.name} age={emp.age} />)
    }



    


     
    </>
  )
}

function EidSalami ({name,age}) {
  // return(
  //   <div style={{
  //     border : 'solid red 2px',
  //     borderRadius : '20px',
  //     fontSize : '5px',
  //     padding : '5px',
  //     textAlign : 'center'
  //   }}>
  //     <h1>Name :{name} </h1>
  //     <h1>Age :{age} </h1>
  //   </div>
  // )
}

export default App
