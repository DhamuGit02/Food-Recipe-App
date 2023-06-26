import LoginReg from "./components/LoginReg"
import Mainpage from "./components/Mainpage"
import RecipeViewPage from "./components/RecipeViewPage"
import FavouritesPage from "./components/FavouritesPage"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ImageAnalysisPage from "./components/ImageAnalysisPage"
import ImageResizerExample from "./Test/ImageResizerExample"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginReg />} />
        <Route path="/mainpage" element={<Mainpage />} />
        <Route path="/favourites" element={<FavouritesPage />} />
        <Route path="/view/:id" element={<RecipeViewPage />} /> 
        <Route path="/image-analysis" element={<ImageAnalysisPage />} />
        {/* <Route path="/" element={<ImageResizerExample/>}/> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
