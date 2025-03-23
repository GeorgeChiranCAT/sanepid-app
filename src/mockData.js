// src/mockData.js

// Mock user data
export const users = {
    client_user: {
        id: '1',
        name: 'John Smith',
        email: 'john@example.com',
        role: 'client_user',
        location: { id: '1', name: 'Restaurant Alpha' }
    },
    client_admin: {
        id: '2',
        name: 'Jane Doe',
        email: 'jane@example.com',
        role: 'client_admin',
        locations: [
            { id: '1', name: 'Restaurant Alpha' },
            { id: '2', name: 'Restaurant Beta' },
            { id: '3', name: 'Restaurant Gamma' }
        ]
    },
    sanepid_user: {
        id: '3',
        name: 'Robert Johnson',
        email: 'robert@example.com',
        role: 'sanepid_user',
        locations: [
            { id: '1', name: 'Restaurant Alpha' },
            { id: '2', name: 'Restaurant Beta' },
            { id: '3', name: 'Restaurant Gamma' },
            { id: '4', name: 'Restaurant Delta' }
        ]
    }
};

// Mock locations data
export const locations = [
    { id: '1', name: 'Restaurant Alpha' },
    { id: '2', name: 'Restaurant Beta' },
    { id: '3', name: 'Restaurant Gamma' },
    { id: '4', name: 'Restaurant Delta' },
    { id: '5', name: 'Restaurant Epsilon' }
];

// Mock controls data
export const controls = [
    {
        id: '1',
        name: 'Refrigerator nr 1 (temp +2)',
        category: 'Fridge/Freezer/Temperature',
        categoryType: 'Refrigerator',
        status: 'done',
        expiresAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        completedBy: 'John Smith',
        location: 'Restaurant Alpha'
    },
    {
        id: '2',
        name: 'Refrigerator nr 2 (temp +5)',
        category: 'Fridge/Freezer/Temperature',
        categoryType: 'Refrigerator',
        status: 'pending',
        expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
        location: 'Restaurant Alpha'
    },
    {
        id: '3',
        name: 'Freezer nr 1 (temp -18)',
        category: 'Fridge/Freezer/Temperature',
        categoryType: 'Freezer',
        status: 'missed',
        expiresAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        location: 'Restaurant Alpha'
    },
    {
        id: '4',
        name: 'Freezer nr 2 (temp -15)',
        category: 'Fridge/Freezer/Temperature',
        categoryType: 'Freezer',
        status: 'missed',
        expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        location: 'Restaurant Alpha'
    },
    {
        id: '5',
        name: 'Goods receipt',
        category: 'Goods receipt',
        categoryType: 'Goods receipt',
        status: 'pending',
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        location: 'Restaurant Alpha'
    },
    {
        id: '6',
        name: 'Heat treatment of food',
        category: 'Production',
        categoryType: 'Heat treatment of food',
        status: 'done',
        expiresAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        completedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        completedBy: 'John Smith',
        location: 'Restaurant Alpha'
    },
    {
        id: '7',
        name: 'Pest control',
        category: 'Annual',
        categoryType: 'Pest control',
        status: 'done',
        expiresAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        completedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        completedBy: 'Jane Doe',
        location: 'Restaurant Alpha'
    },
    {
        id: '8',
        name: 'Audit-self monitoring program',
        category: 'Annual',
        categoryType: 'Audit-self monitoring',
        status: 'pending',
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
        location: 'Restaurant Alpha'
    },
    {
        id: '9',
        name: 'Maintenance review',
        category: 'Annual',
        categoryType: 'Maintenance review',
        status: 'pending',
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
        location: 'Restaurant Alpha'
    }
];

// Get expired controls for the Expired tab
export const expiredControls = controls.filter(control =>
    control.status === 'missed' ||
    (control.status === 'pending' && new Date(control.expiresAt) < new Date())
);

// Mock documents content
export const documentsContent = [
    {
        id: '1',
        title: 'Introduction to Food Safety',
        content: `
      <h1>Introduction to Food Safety</h1>
      <p>Food safety is a scientific discipline describing handling, preparation, and storage of food in ways that prevent food-borne illness. This includes a number of routines that should be followed to avoid potentially severe health hazards.</p>
      <p>The tracks within this certification program are all built with food safety in mind and contain important guidelines that must be followed to ensure compliance with health regulations.</p>
    `
    },
    {
        id: '2',
        title: 'Temperature Control Guidelines',
        content: `
      <h1>Temperature Control Guidelines</h1>
      <p>Temperature control is one of the most important aspects of food safety. Proper temperature management prevents bacterial growth and ensures food remains safe for consumption.</p>
      <h2>Cold Storage Requirements</h2>
      <ul>
        <li>Refrigerators: Keep at or below +5°C (41°F)</li>
        <li>Freezers: Keep at or below -18°C (0°F)</li>
      </ul>
      <h2>Cooking Temperatures</h2>
      <ul>
        <li>Poultry: 74°C (165°F)</li>
        <li>Ground meat: 71°C (160°F)</li>
        <li>Whole cuts of beef, pork, lamb: 63°C (145°F)</li>
      </ul>
      <p>Always use a calibrated food thermometer to check temperatures.</p>
    `
    },
    {
        id: '3',
        title: 'Cleaning and Sanitizing Procedures',
        content: `
      <h1>Cleaning and Sanitizing Procedures</h1>
      <p>Proper cleaning and sanitizing is critical to prevent cross-contamination and ensure a safe food environment.</p>
      <h2>Six Steps to Proper Cleaning and Sanitizing</h2>
      <ol>
        <li>Scrape or remove food bits from the surface</li>
        <li>Wash the surface with detergent</li>
        <li>Rinse with clean water</li>
        <li>Apply sanitizer</li>
        <li>Allow the sanitizer to remain on surface for specified time</li>
        <li>Allow to air dry</li>
      </ol>
      <p>Always follow the sanitizer manufacturer's instructions for concentration and contact time.</p>
    `
    },
    {
        id: '4',
        title: 'Pest Control Management',
        content: `
      <h1>Pest Control Management</h1>
      <p>Effective pest control is essential in food establishments to prevent contamination and maintain compliance with health codes.</p>
      <h2>Integrated Pest Management Approach</h2>
      <ul>
        <li><strong>Prevention:</strong> Seal entry points, maintain cleanliness</li>
        <li><strong>Monitoring:</strong> Regular inspections and documentation</li>
        <li><strong>Identification:</strong> Proper pest identification for targeted control</li>
        <li><strong>Control:</strong> Implement appropriate control methods</li>
        <li><strong>Evaluation:</strong> Review effectiveness and adjust as needed</li>
      </ul>
      <p>Always work with licensed pest control professionals for chemical treatments.</p>
    `
    }
];

// Mock HACCP analysis data
export const haccpAnalysis = [
    {
        hazard: 'Bacterial Growth in Cold Foods',
        preventiveActions: 'Monitor refrigerator and freezer temperatures regularly. Maintain refrigerators at or below 5°C and freezers at or below -18°C.'
    },
    {
        hazard: 'Cross-Contamination from Raw to Ready-to-Eat Foods',
        preventiveActions: 'Use separate cutting boards, utensils, and preparation areas for raw and ready-to-eat foods. Implement proper cleaning and sanitizing procedures between uses.'
    },
    {
        hazard: 'Insufficient Cooking',
        preventiveActions: 'Use calibrated thermometers to verify cooking temperatures. Cook foods to required minimum internal temperatures.'
    },
    {
        hazard: 'Chemical Contamination',
        preventiveActions: 'Store chemicals separately from food and food-contact surfaces. Label all chemical containers properly. Use only approved food-grade chemicals.'
    },
    {
        hazard: 'Foreign Material Contamination',
        preventiveActions: 'Maintain equipment in good repair. Implement visual inspection procedures. Follow glass and brittle plastic policy.'
    },
    {
        hazard: 'Pest Infestation',
        preventiveActions: 'Maintain regular pest control program. Seal entry points. Keep exterior areas clean. Store food and waste properly.'
    },
    {
        hazard: 'Allergen Cross-Contact',
        preventiveActions: 'Separate allergenic ingredients. Clean and sanitize equipment after handling allergens. Properly label all allergen-containing products.'
    }
];

// Generate reports data
export const generateReportsData = (month, year, locationId = '1') => {
    // Filter controls for the specific location
    const locationControls = controls.filter(control =>
        control.location === locations.find(loc => loc.id === locationId)?.name
    );

    // Create a calendar view of the month
    const daysInMonth = new Date(year, month, 0).getDate();

    // Generate status for each day for each control
    return locationControls.map(control => {
        const days = [];
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month - 1, day);

            // Based on control frequency (weekly, bi-weekly, etc.), determine if control should be done on this day
            const shouldBeDone = day % 7 === 0; // Assume weekly frequency for all controls in this mock

            if (shouldBeDone) {
                // Randomize status for demonstration purposes
                const status = ['done', 'missed', 'pending'][Math.floor(Math.random() * 3)];
                days.push({
                    date: date.toISOString(),
                    status: status
                });
            } else {
                days.push({
                    date: date.toISOString(),
                    status: 'not-required'
                });
            }
        }

        return {
            id: control.id,
            name: control.name,
            category: control.category,
            categoryType: control.categoryType,
            days: days
        };
    });
};