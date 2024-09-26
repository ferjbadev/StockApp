import React, { useState, useEffect } from "react";
import { collection, getDocs, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Search } from "lucide-react";

const MySwal = withReactContent(Swal);
const Show = () => {
    // 1- Configuracion de hooks
    const [products, setProducts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('')

    // 2- Funcion para conectar a la base de datos
    const productsCollection = collection(db, "products")

    // 3- Funcion para mostrar todos los productos
    const getProducts = async () => {
        const data = await getDocs(productsCollection);
        setProducts(
            data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        )
        console.log(products)
    }

    // 4- Funcion para elimininar un producto
    const deleteProduct = async (id: number, doc: any) => {
        const productDoc = doc(db, "products", id);
        await deleteDoc(productDoc);
        getProducts();
    }

    // 5- funcion para SweetAlert

    // 6- usamos useEffect para mostrar todos los productos
    useEffect(() => {
        getProducts();
    }, [])
    // -7 Buscador de productos
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">Product List</h1>
            </div>

            <div className="mb-4 relative">
                <input
                    type="text"
                    placeholder="Search for products..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
    )
}

export default Show