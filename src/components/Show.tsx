import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore"; // Importamos `query` y `where`
import { db } from "../firebase/firebase";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const Show = () => {
    // 1- Configuración de hooks
    const [products, setProducts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    // 2- Colección de productos en Firestore
    const productsCollection = collection(db, "products");

    // 3- Función para mostrar los productos (incluye búsqueda)
    const getProducts = async (searchTerm = "") => {
        let q;

        // Si hay un término de búsqueda, creamos una consulta
        if (searchTerm) {
            q = query(productsCollection, where("name", ">=", searchTerm), where("name", "<=", searchTerm + "\uf8ff"));
        } else {
            // Si no hay término de búsqueda, obtenemos todos los productos
            q = productsCollection;
        }

        const data = await getDocs(q);
        setProducts(
            data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
    };

    // 4- Efecto para cargar productos
    useEffect(() => {
        getProducts(); // Cargamos todos los productos inicialmente
    }, []);

    // 5- Manejar cambios en el input de búsqueda
    const handleSearchChange = (e: any) => {
        setSearchTerm(e.target.value);
        getProducts(e.target.value); // Actualizamos la lista con cada cambio
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-6 text-center text-gray-900">Product List</h1>
            </div>

            {/* Input de búsqueda */}
            <div className="max-w-md mx-auto mb-4">
                <label className="bg-white rounded-full p-3 flex items-center">
                    <input
                        type="text"
                        className="grow bg-white px-4 py-2 rounded-full"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={handleSearchChange} // Actualizamos el valor del input
                    />
                    <svg
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                            fillRule="evenodd"
                            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                            clipRule="evenodd" />
                    </svg>
                </label>
            </div>

            {/* Lista de productos */}
            <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="card shadow-md">
                            <div className="card-body">
                                <h2 className="card-title">{product.name}</h2>
                                <div className="card-actions justify-between">
                                    <span className="text-lg font-bold">${product.price}</span>
                                    <span className="text-sm text-gray-500">
                                        Stock: {product.stock > 0 ? product.stock : "Product Out of Stock"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Show;
