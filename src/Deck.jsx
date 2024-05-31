import React, {useEffect, useState} from "react";
import Card from "./Card";
import axios from "axios"

const BASE_URL = "https://deckofcardsapi.com/api/deck";


const Deck = () => {
    const [deck, setDeck] = useState(null);
    const [drawn, setDrawn] = useState([]);
    const [isShuffling, setIsShuffling] = useState(false)


    
    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get(`${BASE_URL}/new/shuffle`)
            setDeck(res.data)
        }
        fetchData();
    }, [])




    const draw = async () => {
    try {
        const res = await axios.get(`${BASE_URL}/${deck.deck_id}/draw/`);

        if(res.data.remaining === 0) throw new Error("Deck is Empty!");

        const card = res.data.cards[0];

        setDrawn(d => [
            ...d,
            {
              id: card.code,
              name: card.suit + " " + card.value,
              image: card.image,
            },
          ]);
        } catch (err) {
          alert(err);
        }
    }

    const shuffle = async () => {
        setIsShuffling(true);
        try{
            await axios.get(`${BASE_URL}/${deck.deck_id}/shuffle`)
            setDrawn([]);
        }catch(e){
            alert(e)
        }finally{
            setIsShuffling(false)
        }
    }


    const drawCardButton = () => {
        if(!deck) return null;
        return(
            <button 
                className="draw"
                onClick={draw}
                disabled={isShuffling}>
                DRAW
            </button>
        )
    }

    const shuffleButton = () => {
        if(!deck) return null;
        return(
        <button 
                className="shuffle"
                onClick={shuffle}
                disabled={isShuffling}>
                SHUFFLE
        </button>
        )
    }

    return(
        <main className="Deck">
            {drawCardButton()}
            {shuffleButton()}

            <div className="cards">
                {drawn.map(c => (
                    <Card key={c.id} name={c.name} image={c.image} />
                ))}
            </div>
        </main>
    )

}

export default Deck