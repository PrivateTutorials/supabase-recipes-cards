import {useState} from "react";
import supabase from "../config/supabaseClient";
import {useNavigate} from "react-router-dom";

const Create = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState('')
    const [method, setMethod] = useState('')
    const [rating, setRating] = useState('')
    const [formError, setFormError] = useState(null)

    const submitForm = async (e) => {
        e.preventDefault();
        if (!title || !method || !rating) {
            setFormError('Please fill in all fields');
            return;
        }

        const {data, error} = await supabase
            .from('smoothies')
            .insert([{title, method, rating}]) // always array
            .select();

        if (error) {
            console.log(error);
            setFormError('Could not save new smoothie')
        }

        if (data) {
            setFormError(null);
            navigate('/'); // redirect to Home page on success
        }
    }

    return (
        <div className="page create">
            <form onSubmit={submitForm}>
                <label htmlFor="title">Title:</label>
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)}/>

                <label htmlFor="method">Method:</label>
                <textarea id="method" value={method} onChange={(e) => setMethod(e.target.value)}/>

                <label htmlFor="rating">Rating:</label>
                <input type="number" id="rating" value={rating} onChange={(e) => setRating(e.target.value)}/>

                <button> Create Smoothie Recipe</button>

                {formError && <p className="error">{formError}</p>}
            </form>
        </div>
    )
}

export default Create
