// src/components/common/CategorySelector.js or similar
const CategorySelector = ({ value, onChange }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoriesService.getCategories();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) return <div>Loading categories...</div>;

    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
            <option value="" disabled>Select a category</option>
            {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                    {cat.category} - {cat.subcategory}
                </option>
            ))}
        </select>
    );
};