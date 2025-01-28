import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "../styles/Edicion.css"


const EditarElemento = () => {
    const { id } = useParams(); // Obtiene el ID de la URL
    // const [editingItem, setEditingItem] = useState(null);
    const [itemData, setItemData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:4000/propiedades?expedienteId=${id}`);
                if (!response.ok) throw new Error("Error al obtener los datos.");
                const data = await response.json();
                setItemData(data);
            } catch (err) {
                console.error(err);
            }
        };

        if (id) fetchData();
    }, [id]);

    if (!itemData) return <p>No se encontraron datos para este elemento.</p>;

    return (
        <div>
            <h1>Editar Elemento</h1>
            {/* Renderiza el formulario con los datos obtenidos */}
            <form>
                {Object.keys(itemData).map((key) => (
                    <div key={key}>
                        <label>{key}</label>
                        <input
                            type="text"
                            value={itemData[key]}
                            onChange={(e) =>
                                setItemData({ ...itemData, [key]: e.target.value })
                            }
                        />
                    </div>
                ))}
                <button type="submit">Guardar Cambios</button>
            </form>
        </div>
    );
};

export default EditarElemento;