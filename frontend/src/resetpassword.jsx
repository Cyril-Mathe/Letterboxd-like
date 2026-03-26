import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "@tanstack/react-router";

export default function Resetpassword() {
    const [form, setForm] = useState({ mot_de_passe: "" });
    const [error, setError] = useState({});
    
    const { id } = useParams();
    const navigate = useNavigate();

    const handleChangePost = (event) => {
        const { name, value } = event.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };

    const handlePostSubmit = async (event) => {
        event.preventDefault();

        let formError = {};
        if (!form.mot_de_passe) {
            formError.mot_de_passe = "Champs requis";
        }

        if (Object.keys(formError).length > 0) {
            setError(formError);
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:3000/api/v1/reset-password/${id}`,
                form
            );

            if (response.status === 200 || response.status === 201) {
                alert("Votre mot de passe a été changé avec succès");
                navigate({ to: "/login" });
            }
        } catch (err) {
            console.error(
                "Une erreur est survenue lors du changement de mot de passe",
                err.message
            );
        }
    };

    return (
        <div>
            <form onSubmit={handlePostSubmit}>
                <input
                    className="w-full p-3 mb-2 bg-[#f5f5f5] border border-gray-200 rounded-lg focus:outline-none"
                    name="mot_de_passe"
                    placeholder="Votre nouveau mot de passe"
                    value={form.mot_de_passe}
                    onChange={handleChangePost}
                />
                {error.mot_de_passe && (
                    <p className="text-red-500 text-sm">
                        {error.mot_de_passe}
                    </p>
                )}
                <button
                    type="submit"
                    className="bg-blue-500 text-black px-4 py-2 rounded"
                >
                    Changer le mot de passe
                </button>
            </form>
        </div>
    );
}