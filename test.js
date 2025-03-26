// In your ControlFormModal component

// Add state for frequency-specific fields
const [frequencyOptions, setFrequencyOptions] = useState([]);
const [frequencyDetailsSchema, setFrequencyDetailsSchema] = useState({});

// Update your useEffect that fetches category details
useEffect(() => {
    const fetchCategoryDetails = async () => {
        if (!formData.category_id) return;

        try {
            setCategoryDetailsLoading(true);
            const details = await categoryDetailsService.getCategoryDetails(formData.category_id);
            setCategoryDetails(details);

            // Extract frequency options and schema
            const categoryWithFrequency = details.find(d => d.frequency_options);
            if (categoryWithFrequency) {
                setFrequencyOptions(categoryWithFrequency.frequency_options || []);
                setFrequencyDetailsSchema(categoryWithFrequency.frequency_details_schema || {});
            }

            // Initialize form values
            const defaultValues = {};
            if (Array.isArray(details)) {
                details.forEach(field => {
                    defaultValues[field.field_name] = field.default_value || '';
                });
            }

            setFormData(prev => ({
                ...prev,
                categoryValues: defaultValues
            }));
        } catch (error) {
            console.error('Error fetching category details:', error);
            setCategoryDetails([]);
        } finally {
            setCategoryDetailsLoading(false);
        }
    };

    fetchCategoryDetails();
}, [formData.category_id]);

// Add a handler for frequency changes
const handleFrequencyTypeChange = (e) => {
    const newFrequencyType = e.target.value;

    // Update the frequency type
    setFormData(prev => ({
        ...prev,
        frequency_type: newFrequencyType,
        // Reset the frequency config when type changes
        frequency_config: {}
    }));
};

// Add a handler for frequency details fields
const handleFrequencyFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
        ...prev,
        frequency_config: {
            ...prev.frequency_config,
            [name]: fieldValue
        }
    }));
};