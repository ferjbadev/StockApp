import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where, doc, deleteDoc, addDoc, updateDoc, getDoc } from "firebase/firestore";
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

    // 6- Función para eliminar un producto
    const handleDelete = async (id: string) => {
        const confirmed = await MySwal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (confirmed.isConfirmed) {
            const productDoc = doc(db, "products", id);
            await deleteDoc(productDoc);
            getProducts(); // Refrescamos la lista después de eliminar
            MySwal.fire("Deleted!", "The product has been removed.", "success");
        }
    };

    // 7- Función para editar un producto
    const handleEdit = async (id: string) => {
        const productRef = doc(db, "products", id);
        const productDoc = await getDoc(productRef); // Cambiado a getDoc
        const productData = productDoc.data();

        if (productData) {
            const { value: formValues } = await MySwal.fire({
                title: 'Edit Product',
                html:
                    `<input id="name" class="swal2-input" placeholder="Name" value="${productData.name}">` +
                    `<input id="price" type="number" class="swal2-input" placeholder="Price" value="${productData.price}">` +
                    `<input id="stock" type="number" class="swal2-input" placeholder="Stock" value="${productData.stock}">`,
                focusConfirm: false,
                preConfirm: () => {
                    return {
                        name: (document.getElementById('name') as HTMLInputElement).value,
                        price: parseFloat((document.getElementById('price') as HTMLInputElement).value),
                        stock: parseInt((document.getElementById('stock') as HTMLInputElement).value, 10),
                    }
                },
                customClass: {
                    input: 'swal2-input'
                }
            });

            if (formValues) {
                try {
                    await updateDoc(productRef, formValues);
                    await getProducts(); // Refrescamos la lista después de actualizar
                    MySwal.fire('Success!', 'Product has been updated.', 'success');
                } catch (error) {
                    MySwal.fire('Error!', 'There was an error updating the product.', 'error');
                }
            }
        }
    };

    // 8- Función para agregar un nuevo producto
    const handleCreate = async () => {
        const { value: formValues } = await MySwal.fire({
            title: 'Create New Product',
            html:
                `<input id="name" class="swal2-input" placeholder="Name">` +
                `<input id="price" type="number" class="swal2-input" placeholder="Price">` +
                `<input id="stock" type="number" class="swal2-input" placeholder="Stock">`,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    name: (document.getElementById('name') as HTMLInputElement).value,
                    price: parseFloat((document.getElementById('price') as HTMLInputElement).value),
                    stock: parseInt((document.getElementById('stock') as HTMLInputElement).value, 10),
                }
            },
            customClass: {
                input: 'swal2-input'
            }
        });

        if (formValues) {
            try {
                await addDoc(productsCollection, formValues);
                await getProducts(); // Refrescamos la lista después de agregar
                MySwal.fire('Success!', 'Product has been added.', 'success');
            } catch (error) {
                MySwal.fire('Error!', 'There was an error adding the product.', 'error');
            }
        }
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
                                {/* Usamos flex para agrupar todo en una fila */}
                                <div className="flex items-center justify-between gap-x-4">
                                    {/* Nombre del producto */}
                                    <h2 className="text-lg font-bold">{product.name}</h2>

                                    {/* Precio del producto */}
                                    <span className="text-lg font-bold">${product.price}</span>

                                    {/* Stock del producto */}
                                    <span className="text-sm text-gray-500">
                                        Stock: {product.stock > 0 ? product.stock : "Sold Out"}
                                    </span>

                                    {/* Botones de Editar y Borrar */}
                                    <div className="flex gap-x-2">
                                        <button
                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                                            onClick={() => handleEdit(product.id)}>
                                            Edit
                                        </button>

                                        <button
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
                                            onClick={() => handleDelete(product.id)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Botón para crear un nuevo producto */}
            <div className="flex justify-center mt-6">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                    onClick={handleCreate}>
                    Create
                </button>
            </div>
        </div>
    );
};

export default Show;
