//import {useEffect, useState} from 'react'
import {useEffect} from 'react'
import {useWorkoutsContext} from '../hooks/useWorkoutsContext'
import WorkoutDetails from '../components/WorkoutsDetails'
import WorkoutForm from '../components/WorkoutForm'
import { useAuthContext } from '../hooks/useAuthContext'

const Home = ()=>{
  //const [workouts,setWorkouts] = useState(null)
  const {workouts,dispatch} = useWorkoutsContext()
  const {user} = useAuthContext()

  useEffect(()=>{
    const fetchWorkouts = async ()=>{
      const response = await fetch('/api/workouts',{
        headers:{
          'Authorization': `Bearer ${user.token}`
        }
      })
      const json = await response.json()

      if(response.ok){
        //setWorkouts(json)
        dispatch({type:'SET_WORKOUTS', payload:json})
      } 
    }

    if(user){
      fetchWorkouts()
    }
  },[dispatch,user])

    return(
        <div className="home">
          <div className="workouts">
            {workouts && workouts.map(workout=>(
              //<p key={workout._id}>{workout.title}</p>
              <WorkoutDetails key={workout._id} workout={workout}/>
            ))}
          </div>
          <WorkoutForm/>
        </div>
    )
}

export default Home