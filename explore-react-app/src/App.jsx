
import './App.css'

function App() {
  
  return (
    <>
    <h1>Rashed</h1>
    <About></About>
    <Education></Education>
    <Employee name="Rashed" age="20" dept="Cse"></Employee>
    <Employee name="Mojammel" age="20" dept="EEE"></Employee>
    <Employee name="Mercy" age="34" dept="BBA"></Employee>
    <Employee name="Fatema" age="29" dept="IPE"></Employee>
  
    </>
  )
}
function About(){
  return(
    <>
    <h1>Rashedul alam</h1>
    <p>American international uni</p>
    </>
    
  )
}
function Education(){

  const edu = {
   border : 'solid',
   borderRadius: '15px',
   color :'red'
  }
  return(
    <>
    <h1 style={edu}>Education</h1>
    <p>American Internation University-Bangladesh</p>
    <p>CGPA : 3.75</p>
    </>

   
  )
}

function Employee(info)
{
  return(
    <div style={{
      border : 'red solid 2px',
      borderRadius : '15px',
      fontSize : '10px',
      marginTop : '10px'
    }}>
      <h1>Name : {info.name} </h1>
      <h1>Age : {info.age}</h1>
      <h1>Department : {info.dept}</h1>
    </div>
  )
}
export default App
