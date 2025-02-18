import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import ActivityTester from './pages/ActivityTester';
import { BeakerIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { DataManager } from './pages/DataManager';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold text-gray-900">Admin Console</h1>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/activity-tester"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                  >
                    <BeakerIcon className="h-5 w-5 mr-1.5" />
                    Activity Tester
                  </Link>
                  <Link
                    to="/data-manager"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                  >
                    <DocumentDuplicateIcon className="h-5 w-5 mr-1.5" />
                    Data Manager
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="py-6">
          <Routes>
            <Route path="/activity-tester" element={<ActivityTester />} />
            <Route path="/data-manager" element={<DataManager />} />
            <Route path="/" element={<Navigate to="/activity-tester" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 