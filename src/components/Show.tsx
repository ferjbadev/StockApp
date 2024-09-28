import { useState, useEffect } from "react";
import { collection, getDocs, query, where, doc, deleteDoc, addDoc, updateDoc, getDoc, limit } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Search } from "lucide-react";

const MySwal = withReactContent(Swal); // Instancia de la librería de alertas

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
}

const Show = () => {
    // 1- Configuración de hooks
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    // 2- Colección de productos en Firestore
    const productsCollection = collection(db, "products");

    // 3- Función para mostrar los productos en la lista
    const getProducts = async (searchTerm = "") => {
        setLoading(true);
        try {
            let q;
            if (searchTerm) {
                const normalizedSearchTerm = searchTerm.toLowerCase(); // Normalizamos el término de búsqueda
                q = query(
                    productsCollection,
                    where("keywords", "array-contains", normalizedSearchTerm) // Buscamos coincidencia en palabras clave
                );
            } else {
                q = query(productsCollection, limit(12));
            }

            const data = await getDocs(q);
            const productsList = data.docs.map((doc) => ({
                ...(doc.data() as Product),
                id: doc.id
            }));
            setProducts(productsList);
        } catch (error) {
            MySwal.fire("Error!", "There was an error fetching the products.", "error");
        } finally {
            setLoading(false);
        }
    };




    // 4- useEffect para mostrar los productos
    useEffect(() => {
        getProducts(); // Mostramos todos los productos
    }, []);

    // 5- Manejar cambios en el input de búsqueda
    const handleSearchChange = (e: any) => {
        setSearchTerm(e.target.value);
        getProducts(e.target.value); // Actualizamos la lista con cada cambio
    };

    const generateKeywords = (name: string) => {
        const keywords = [];
        const splitName = name.toLowerCase().split(" ");
        let currentWord = "";

        // Generamos palabras clave a partir de cada palabra individual
        for (const word of splitName) {
            currentWord = "";
            for (let i = 0; i < word.length; i++) {
                currentWord += word[i];
                keywords.push(currentWord); // Se agrega cada subcadena a la lista
            }
        }

        // Agregamos las combinaciones de palabras completas (por ejemplo: "product name")
        for (let i = 0; i < splitName.length; i++) {
            let currentCombination = "";
            for (let j = i; j < splitName.length; j++) {
                currentCombination += (j === i ? "" : " ") + splitName[j];
                keywords.push(currentCombination);
            }
        }

        return keywords;
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
        const productDoc = await getDoc(productRef);
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
                    const name = (document.getElementById('name') as HTMLInputElement).value;
                    return {
                        name,
                        normalized_name: name.toLowerCase(),
                        keywords: generateKeywords(name), // Actualizamos las palabras clave
                        price: parseFloat((document.getElementById('price') as HTMLInputElement).value),
                        stock: parseInt((document.getElementById('stock') as HTMLInputElement).value, 10),
                    }
                },
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
                const name = (document.getElementById('name') as HTMLInputElement).value;
                return {
                    name,
                    normalized_name: name.toLowerCase(),
                    keywords: generateKeywords(name), // Guardamos las palabras clave generadas
                    price: parseFloat((document.getElementById('price') as HTMLInputElement).value),
                    stock: parseInt((document.getElementById('stock') as HTMLInputElement).value, 10),
                }
            },
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

            {/* Botón para crear un nuevo producto */}
            <div className="flex justify-center mt-8 mb-8">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out"
                    onClick={handleCreate}
                >
                    Create New Product
                </button>
            </div>

            {/* Input de búsqueda */}
            <div className="max-w-md mx-auto mb-6">
                <div className="relative">
                    <input
                        type="text"
                        className="w-full bg-white text-black placeholder-black px-5 py-3 pr-12 rounded-full border border-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition duration-300 ease-in-out"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                </div>
            </div>

            {loading ? (
                <p className="text-center font-bold text-lg text-black text-3xl">Loading Products...</p>
            ) : (
                // Lista de productos
                <div className="container mx-auto bg-gray-100 rounded-lg shadow px-4 py-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                        {products.map((product) => (
                            <div key={product.id} className="card shadow-md">
                                <div className="card-body">
                                    {/* Usamos flex para agrupar todo en una fila */}
                                    <div className="flex items-start gap-x-4">
                                        {/* Agrupamos Nombre, Precio y Stock */}
                                        <div className="flex flex-col">
                                            {/* Nombre del producto */}
                                            <h2 className="text-lg font-bold text-black mb-2">{product.name}</h2>
                                            {/* Precio */}
                                            <p className="text-gray-700">Price: ${product.price}</p>
                                            {/* Stock */}
                                            <p className="text-gray-700">Stock: {product.stock}</p>
                                        </div>
                                    </div>

                                    {/* Botones de Editar y Eliminar */}
                                    <div className="flex justify-end gap-4 mt-4">
                                        <button
                                            className="bg-green-400 hover:bg-green-500 text-black font-semibold px-4 py-2 rounded-full"
                                            onClick={() => handleEdit(product.id)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-400 hover:bg-red-500 text-black font-semibold px-4 py-2 rounded-full"
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Show;
