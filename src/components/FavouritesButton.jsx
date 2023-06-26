import '../styles/FavouritesButton.css'
import {useState} from 'react'
import { toast, Slide } from 'react-toastify';
import axios from 'axios';
function FavouritesButton({recipe}) {
    const [favBtnClick, setFavBtnClick] = useState(false)
    const handleFavBtnClick = async (event) => {
        setFavBtnClick(true)
        try {
            const res = await axios.put(`/api/add-to-favourites`, {
                uid: localStorage.getItem('uid'),
                id: recipe.id,
                title: recipe.title,
                time: recipe.time,
                image:`https://spoonacular.com/recipeImages/${recipe.id}-240x150.jpg`
            })
            if(res.data.value && res.status === 200) {
                toast.success('Recipe added to favourites', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition:Slide
                })
            } 
            else if (!res.data.value && res.status === 200) {
                toast.warning('Recipe already in favourites', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition:Slide
                })
            }
        } catch (error) {
            toast.error('Network Error', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition:Slide
            })
            console.log(error)   
        }
    }
    return (
        <label class="container">
            <input checked={favBtnClick} type="checkbox" onClick={handleFavBtnClick}/>
            <div class="checkmark">
                <svg viewBox="0 0 256 256">
                    <rect fill="none" height="256" width="256"></rect>
                    <path d="M224.6,51.9a59.5,59.5,0,0,0-43-19.9,60.5,60.5,0,0,0-44,17.6L128,59.1l-7.5-7.4C97.2,28.3,59.2,26.3,35.9,47.4a59.9,59.9,0,0,0-2.3,87l83.1,83.1a15.9,15.9,0,0,0,22.6,0l81-81C243.7,113.2,245.6,75.2,224.6,51.9Z" stroke-width="20px" stroke="#FFF" fill="none"></path></svg>
            </div>
        </label>
    )
}

export default FavouritesButton