import {useState} from 'react'
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useAuthContext } from '../hooks/useAuthContext'

const WorkoutForm = ()=>{
	const {dispatch} = useWorkoutsContext()
    const [title,setTitle] = useState('')
    const [reps,setReps] = useState('')
    const [load,setLoad] = useState('')
    const [error,setError] = useState(null)
		const [emptyFields,setEmptyFields] = useState([])
		const {user} = useAuthContext()
    
		const handleSummit = async(e)=>{
			e.preventDefault()

			if(!user){
				setError('You must be logged in.')
				return
			}

			const workout = {title,reps,load}
			const response = await fetch('/api/workouts',{
				method: 'POST',
				body: JSON.stringify(workout),
				headers:{
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${user.token}`
				}
			})

			const json = await response.json()

			if(!response.ok){
				setError(json.error)
				setEmptyFields(json.emptyFields)
			}

			if(response.ok){
				setTitle('')
				setReps('')
				setLoad('')
				setError(null)
				setEmptyFields([])
				console.log('New workout added',json)
				dispatch({type:'CREATE_WORKOUT',payload:json})
			}
		}

    return(
        <form className="create" onSubmit={handleSummit}>
					<h3>Add a new workout</h3>

					<label>Excersise Title:</label>
					<input 
						type="text"
						onChange={e=>setTitle(e.target.value)}
						value={title}
						className={emptyFields.includes('title') ? 'error' : ''}
					/>

					<label>Reps:</label>
					<input
						type="number"
						onChange={e=>setReps(e.target.value)}
						value={reps}
						className={emptyFields.includes('reps') ? 'error' : ''}
					/>

					<label>Load (Kg):</label>
					<input 
						type="number"
						onChange={e=>setLoad(e.target.value)} 
						value={load}
						className={emptyFields.includes('load') ? 'error' : ''}
					/>

					<button>Add workout</button>
					{error && <div className="error">{error}</div> }
        </form>
    )
}

export default WorkoutForm