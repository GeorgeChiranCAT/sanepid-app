// src/pages/ControlsPage.js
import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import CurrentControlsTab from './ControlsPage/CurrentControlsTab';
import LogBooksTab from './ControlsPage/LogBooksTab';
import AllControlPointsTab from './ControlsPage/AllControlPointsTab';
import ExpiredTab from './ControlsPage/ExpiredTab';



const ControlsPage = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');



    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Controls</h1>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search controls..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md"
                />
            </div>

            <Tabs selectedIndex={tabIndex} onSelect={index => setTabIndex(index)}>
                <TabList className="flex border-b mb-4">
                    <Tab className="px-4 py-2 cursor-pointer border-b-2 border-transparent hover:text-blue-600 focus:outline-none">
                        Current Controls
                    </Tab>
                    <Tab className="px-4 py-2 cursor-pointer border-b-2 border-transparent hover:text-blue-600 focus:outline-none">
                        Log Books
                    </Tab>
                    <Tab className="px-4 py-2 cursor-pointer border-b-2 border-transparent hover:text-blue-600 focus:outline-none">
                        All Control Points
                    </Tab>
                    <Tab className="px-4 py-2 cursor-pointer border-b-2 border-transparent hover:text-blue-600 focus:outline-none">
                        Expired
                    </Tab>
                </TabList>

                <TabPanel>
                    <CurrentControlsTab searchTerm={searchTerm} />
                </TabPanel>
                <TabPanel>
                    <LogBooksTab searchTerm={searchTerm} />
                </TabPanel>
                <TabPanel>
                    <AllControlPointsTab searchTerm={searchTerm} />
                </TabPanel>
                <TabPanel>
                    <ExpiredTab searchTerm={searchTerm} />
                </TabPanel>
            </Tabs>
        </div>
    );
};



export default ControlsPage;