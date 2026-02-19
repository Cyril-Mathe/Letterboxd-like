import { useState } from "react";

export default function RecommendationsPage() {
    const [categories, setCategories] = useState("guerre", "thriller", "horreur", "science-fiction", "animation", "comédie", "drame");
    return (
        <>
        <button onClick={() => setCategories("guerre")}>Guerre</button>
        <button onClick={() => setCategories("thriller")}>Thriller</button>
        <button onClick={() => setCategories("horreur")}>Horreur</button>
        <button onClick={() => setCategories("science-fiction")}>Science-fiction</button>
        <button onClick={() => setCategories("animation")}>Animation</button>
        <button onClick={() => setCategories("comédie")}>Comédie</button>
        <button onClick={() => setCategories("drame")}>Drame</button>
            <div>
                <div>
                    {categories === "guerre" && <div>Test</div>}
                </div>
                <div>
                    {categories === "thriller" && <div>AA</div>}
                </div>
                <div></div>
                    {categories === "horreur" && <div>BB</div>}
                </div>
                <div>
                    {categories === "science-fiction" && <div>CC</div>}
                </div>
                <div>
                    {categories === "animation" && <div>DD</div>}
                </div>
                <div>
                    {categories === "comédie" && <div>EE</div>}
                </div>
                <div>
                    {categories === "drame" && <div>FF</div>}
                </div>
        </>
    )
}