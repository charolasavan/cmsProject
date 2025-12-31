// import React, { useEffect, useState } from 'react'
// import { Form } from 'react-bootstrap';
// import api from "api/apiClient";
// import CategoryProductView from '../Components/CategoryProductView'

// function SideCategory() {
//     const [categories, setCategories] = useState([]);
//     const [searchProduct, setSearchProduct] = useState({
//         category_id: '',
//     })



//     const fetchCategories = async () => {
//         try {
//             const { data } = await api.get('/category/');
//             setCategories(data);
//         } catch (err) {
//             console.error('Fetch categories error:', err);
//         }
//     };
//     const handleSearch = async (e) => {
//         setSearchProduct((prev) => ({
//             ...prev,
//             'category_id': e.target.value,
//         }));
//     }
//     const renderOptions = (items, depth = 0) =>
//         items.flatMap(({ category_id, category_name, children = [] }) => [
//             <li key={category_id} value={category_id}>
//                 {`${'-'.repeat(depth)} ${category_name}`}
//             </li>
//             ,
//             ...renderOptions(children, depth + 1),
//         ]);


//     useEffect(() => {
//         fetchCategories()
//     }, [])

//     return (
//         <div className="list-products">

//             <Form.Group className='category-list'>
//                 <Form.Label>All Products</Form.Label>
//                 <ul
//                     name="category_id"
//                     value={searchProduct.category_id}
//                     onClick={handleSearch}
//                 >
//                     {renderOptions(categories)}
//                 </ul>
//             </Form.Group>
//             {/* {console.log(sewarchProduct)} */}
//             <CategoryProductView searchProduct={searchProduct} />
//         </div>


//     )
// }

// export default SideCategory


import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import api from "api/apiClient";
import CategoryProductView from '../Components/CategoryProductView';

function SideCategory() {
    const [categories, setCategories] = useState([]);
    const [searchProduct, setSearchProduct] = useState({
        category_id: '',
    });

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/category/');
            setCategories(data);
        } catch (err) {
            console.error('Fetch categories error:', err);
        }
    };

    const handleSearch = (categoryId) => {
        setSearchProduct({
            category_id: categoryId,
        });
    };

    const renderOptions = (items, depth = 0) =>
        items.map(({ category_id, category_name, children = [] }) => (
            <React.Fragment key={category_id}>
                <li
                    onClick={() => handleSearch(category_id)}
                    style={{ cursor: 'pointer' }}
                >
                    {`${'-'.repeat(depth)} ${category_name}`}
                </li>
                {children.length > 0 && renderOptions(children, depth + 1)}
            </React.Fragment>
        ));

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="list-products">
            <Form.Group className="category-list">
                <Form.Label>All Products</Form.Label>

                <ul>
                    {/* ✅ ALL PRODUCTS */}
                    <li
                        onClick={() => handleSearch('')}
                        style={{ cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        All Products
                    </li>

                    {renderOptions(categories)}
                </ul>
            </Form.Group>

            <CategoryProductView searchProduct={searchProduct} />
        </div>
    );
}

export default SideCategory;
