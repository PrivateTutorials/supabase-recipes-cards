import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import supabaseClient from "../config/supabaseClient";

const Update = () => {
    const navigate = useNavigate();
    // "id" - name of param from route url
    const {id} = useParams();

    const [title, setTitle] = useState('')
    const [method, setMethod] = useState('')
    const [rating, setRating] = useState('')
    const [formError, setFormError] = useState(null)

    useEffect(() => {
        const fetchSmoothie = async () => {
            const {data, error} = await supabaseClient
                .from('smoothies')
                .select()
                .eq('id', id) // means = WHERE "id" equals. Returns array
                .single();

            if (error) {
                navigate('/', {replace: true}); // replacing this route in the history with Home page
            }
            if (data) {
                const {title, method, rating} = data;

                setTitle(title);
                setMethod(method);
                setRating(rating);
            }
        }

        fetchSmoothie();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !method || !rating) {
            setFormError('Please fill in all fields');
            return;
        }

        const {data, error} = await supabaseClient
            .from('smoothies')
            .update({title, method, rating})
            .eq('id', id)
            .select();

        if (error) {
            console.log(error);
            setFormError('Could not update the smoothie');
        }
        if(data){
            setFormError(null);
            navigate('/');
        }
    }

    return (
        <div className="page update">
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title:</label>
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)}/>

                <label htmlFor="method">Method:</label>
                <textarea id="method" value={method} onChange={(e) => setMethod(e.target.value)}/>

                <label htmlFor="rating">Rating:</label>
                <input type="number" id="rating" value={rating} onChange={(e) => setRating(e.target.value)}/>

                {formError && <p className="error">{formError}</p>}

                <button> Update Smoothie Recipe</button>
            </form>
        </div>
    )
}

export default Update
