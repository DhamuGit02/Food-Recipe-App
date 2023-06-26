import Dropdown from 'react-bootstrap/Dropdown'
import 'bootstrap/dist/css/bootstrap.min.css'

const cusisines = ["African",
    "Asian",
    "American",
    "British",
    "Cajun",
    "Caribbean",
    "Chinese",
    "Eastern European",
    "European",
    "French",
    "German",
    "Greek",
    "Indian",
    "Irish",
    "Italian",
    "Japanese",
    "Jewish",
    "Korean",
    "Latin American",
    "Mediterranean",
    "Mexican",
    "Middle Eastern",
    "Nordic",
    "Southern",
    "Spanish",
    "Thai",
    "Vietnamese"]
function CustomDropDown({ cuisine, setCuisine, setSearchType }) {
    return (
        <>
            <Dropdown>
                <Dropdown.Toggle id="dropdown-button-dark-example1" variant="secondary" style={{ width: 300, textAlign: "start", height: 50 }}>
                    {cuisine == null ? "Select Cuisine" : cuisine}
                </Dropdown.Toggle>

                <Dropdown.Menu variant="dark" style={{ maxHeight: '400px', overflowY: 'scroll', width: 300 }}>
                    {
                        cusisines.map((cuisine, index) => (<Dropdown.Item key={index} onClick={(e) => {
                            setCuisine(e.target.textContent)
                            setSearchType('cuisine')
                        }}
                        >{cuisine}</Dropdown.Item>))
                    }
                </Dropdown.Menu>
            </Dropdown>
        </>
    )
}

export default CustomDropDown