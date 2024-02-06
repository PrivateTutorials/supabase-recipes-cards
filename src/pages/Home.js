import supabase from "../config/supabaseClient";
import {useEffect, useState} from "react";
import {SmoothieCard} from "../components/SmoothieCard";

const Home = () => {
    const [fetchError, setFetchError] = useState(null);
    const [smoothies, setSmoothies] = useState(null);
    const [orderBy, setOrderBy] = useState('created_at'); // column name in supabase table

    useEffect(() => {
        // new async f() here, because we shouldn't make useEffect async itself
        const fetchSmoothies = async () => {
            const {data, error} = await supabase
                .from('smoothies')
                .select() // empty parameter - means select ALL
                .order(orderBy, {ascending: false})

            if (error) {
                setFetchError('Could not fetch smoothies');
                setSmoothies(null); // if we previously had any value to smoothies
                console.log(error);
            }

            if(data) {
                setSmoothies(data);
                setFetchError(null);
            }
        }

        fetchSmoothies();
    }, [orderBy]);

    const handleDelete = (id) => {
        setSmoothies(previousSmoothies => {
            return previousSmoothies.filter(smoothie => smoothie.id !== id);
        });
    }

    return (
        <div className="page home">
            {fetchError && <p>{fetchError}</p>}
            {smoothies && (
                <div className="smoothies">

                   <div className="order-by">
                       <p>Order by:</p>
                       <button onClick={() => setOrderBy('created_at')}>Time Created</button>
                       <button onClick={() => setOrderBy('title')}>Title</button>
                       <button onClick={() => setOrderBy('rating')}>Rating</button>
                   </div>

                    <div className="smoothie-grid">
                        {smoothies.map(smoothie => (
                            <SmoothieCard key={smoothie.id} smoothie={smoothie} onDelete={handleDelete}/>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Home
