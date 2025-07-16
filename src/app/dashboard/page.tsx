"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import AnalyticsPage from "../analytics/page";
import ReportsPage from "../reports/page";
import PatientRecordPage from "../patient_record/page";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
const App: React.FC = () => {
const [activeTab, setActiveTab] = useState('dashboard');
const [showNotifications, setShowNotifications] = useState(false);
const notificationRef = useRef<HTMLDivElement>(null);

const notifications = [
  {
    id: 1,
    type: 'critical',
    title: 'Critical Finding Alert',
    message: 'Urgent review required for Patient ID: SC003',
    time: '2 minutes ago',
    unread: true
  },
  {
    id: 2,
    type: 'success',
    title: 'Scan Completed',
    message: 'Brain MRI analysis completed for Sarah Johnson',
    time: '15 minutes ago',
    unread: true
  },
  {
    id: 3,
    type: 'info',
    title: 'System Update',
    message: 'AI model update completed. Accuracy improved by 2%',
    time: '1 hour ago',
    unread: false
  },
  {
    id: 4,
    type: 'warning',
    title: 'Queue Update',
    message: 'High priority patient added to queue',
    time: '2 hours ago',
    unread: false
  }
];

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
      setShowNotifications(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

const handleNotificationClick = () => {
  setShowNotifications(!showNotifications);
};

const handleMarkAsRead = (id: number) => {
  // Handle marking notification as read
  console.log('Marked as read:', id);
};

const handleActionClick = (id: number) => {
  // Handle notification action
  console.log('Action clicked:', id);
};
const sidebarItems = [
{ id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
{ id: 'upload', label: 'Upload Image', icon: 'fas fa-upload' },
{ id: 'reports', label: 'Reports', icon: 'fas fa-file-medical' },
{ id: 'analytics', label: 'Analytics', icon: 'fas fa-chart-line' },
{ id: 'patients', label: 'Patient Records', icon: 'fas fa-users' }
];
const metrics = [
{ title: 'Total Scans Today', value: '247', change: '+12%', icon: 'fas fa-x-ray' },
{ title: 'AI Accuracy Rate', value: '98.7%', change: '+0.3%', icon: 'fas fa-brain' },
{ title: 'Pending Reviews', value: '23', change: '-8%', icon: 'fas fa-clock' },
{ title: 'Critical Cases', value: '5', change: '+2', icon: 'fas fa-exclamation-triangle' }
];
const recentScans = [
{ id: 'SC001', patient: 'John Smith', type: 'Chest X-Ray', status: 'Completed', confidence: 94, findings: 'Normal' },
{ id: 'SC002', patient: 'Sarah Johnson', type: 'Brain MRI', status: 'Processing', confidence: 87, findings: 'Analyzing...' },
{ id: 'SC003', patient: 'Mike Davis', type: 'Lung CT', status: 'Review Required', confidence: 76, findings: 'Suspicious nodule detected' },
{ id: 'SC004', patient: 'Emily Brown', type: 'Spine X-Ray', status: 'Completed', confidence: 92, findings: 'Mild degenerative changes' }
];
const patientQueue = [
{ name: 'Robert Wilson', priority: 'High', waitTime: '15 min', type: 'Emergency' },
{ name: 'Lisa Anderson', priority: 'Medium', waitTime: '32 min', type: 'Routine' },
{ name: 'David Miller', priority: 'Low', waitTime: '45 min', type: 'Follow-up' },
{ name: 'Jennifer Taylor', priority: 'High', waitTime: '8 min', type: 'Urgent' }
];
return (
<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
{/* Sidebar */}
<div className="w-64 bg-gradient-to-b from-blue-50 to-slate-50 border-r border-blue-100 flex flex-col shadow-lg">
{/* Logo */}
<div className="p-6 border-b border-blue-100 bg-gradient-to-r from-blue-100 to-slate-100">
<div className="flex items-center space-x-3 transform hover:scale-105 transition-transform duration-300">
<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
<i className="fas fa-brain text-white text-lg animate-pulse"></i>
</div>
<div>
<h1 className="text-lg font-bold text-slate-800">Scanalyze</h1>
<p className="text-xs text-slate-500">Diagnostic System</p>
</div>
</div>
</div>
{/* Navigation */}
<nav className="flex-1 p-4">
<ul className="space-y-2">
{sidebarItems.map((item) => (
<li key={item.id}>
<button
onClick={() => setActiveTab(item.id)}
className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-300 cursor-pointer whitespace-nowrap !rounded-button transform hover:scale-105 hover:shadow-md ${
activeTab === item.id
? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-300 shadow-md'
: 'text-slate-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-slate-100 hover:text-blue-700'
}`}
>
<i className={`${item.icon} text-lg transition-transform duration-300 hover:rotate-12`}></i>
<span className="font-medium">{item.label}</span>
</button>
</li>
))}
</ul>
</nav>
{/* User Profile */}
<div className="p-4 border-t border-blue-100 bg-gradient-to-r from-slate-100 to-blue-100">
<div className="flex items-center space-x-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-slate-50 p-2 rounded-lg transition-all duration-300">
<Avatar className="w-10 h-10 shadow-md hover:shadow-lg transition-shadow duration-300">
<AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700">DR</AvatarFallback>
</Avatar>
<div className="flex-1">
<p className="text-sm font-medium text-slate-800">Dr. Alex Chen</p>
<p className="text-xs text-slate-500">Radiologist</p>
</div>
<button className="text-slate-400 hover:text-blue-600 cursor-pointer transition-all duration-300 hover:rotate-180">
<i className="fas fa-cog"></i>
</button>
</div>
</div>
</div>
{/* Main Content */}
<div className="flex-1 flex flex-col">
  {/* Header: Only show when Upload Image or Dashboard tab is active */}
  {(activeTab === 'upload' || activeTab === 'dashboard') && (
    <header className="bg-gradient-to-r from-white to-blue-50 border-b border-blue-100 px-8 py-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-slate-800">AI Radiology Dashboard</h1>
          <p className="text-slate-600 mt-1">Advanced diagnostic imaging analysis powered by artificial intelligence</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative" ref={notificationRef}>
            <button 
              id="notification-bell"
              onClick={handleNotificationClick}
              className="relative p-2 text-slate-400 hover:text-blue-600 cursor-pointer transition-all duration-300 hover:scale-110"
            >
              <i className="fas fa-bell text-lg"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-blue-100 z-50 transform transition-all duration-300 ease-in-out">
                <div className="p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-slate-50">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-slate-800">Notifications</h3>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {notifications.filter(n => n.unread).length} new
                    </Badge>
                  </div>
                </div>
                <ScrollArea className="h-[400px]">
                  <div className="p-2">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 mb-2 rounded-lg transition-all duration-300 hover:shadow-md ${
                          notification.unread ? 'bg-blue-50' : 'bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className={`mt-1 w-2 h-2 rounded-full ${
                              notification.type === 'critical' ? 'bg-red-500' :
                              notification.type === 'success' ? 'bg-green-500' :
                              notification.type === 'warning' ? 'bg-yellow-500' :
                              'bg-blue-500'
                            }`} />
                            <div>
                              <p className="font-medium text-slate-800">{notification.title}</p>
                              <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                            </div>
                          </div>
                          {notification.unread && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-xs text-blue-600 hover:text-blue-800 whitespace-nowrap"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                        <div className="mt-3 flex justify-end space-x-2">
                          <Button
                            onClick={() => handleActionClick(notification.id)}
                            variant="outline"
                            size="sm"
                            className="text-xs bg-white hover:bg-blue-50 border-blue-200 text-blue-700 whitespace-nowrap !rounded-button"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-3 border-t border-blue-100 bg-gradient-to-r from-slate-50 to-blue-50">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white whitespace-nowrap !rounded-button"
                  >
                    View All Notifications
                  </Button>
                </div>
              </div>
            )}
          </div>
          <Avatar className="w-10 h-10 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">
            <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700">AC</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )}
{/* Main Content Switcher */}
<main className="flex-1 p-8 bg-gradient-to-br from-slate-50 to-blue-50">
  {activeTab === 'analytics' ? (
    <div className="-m-8">
      <AnalyticsPage />
    </div>
  ) : activeTab === 'reports' ? (
    <div className="-m-8">
      <ReportsPage />
    </div>
  ) : activeTab === 'patients' ? (
    <div className="-m-8">
      <PatientRecordPage />
    </div>
  ) : activeTab === 'upload' ? (
    <div className="-m-8">
      <DashboardClient />
    </div>
  ) : (
    <>
      {/* Metrics Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-gradient-to-br from-white to-blue-50 border-blue-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">{metric.title}</p>
                  <p className="text-2xl font-bold text-slate-800">{metric.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full transition-all duration-300 ${
                      metric.change.startsWith('+')
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
                  <i className={`${metric.icon} text-blue-600 text-lg`}></i>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-8">
        {/* Recent Scans */}
        <div className="col-span-2">
          <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-slate-50">
              <CardTitle className="text-lg font-semibold text-slate-800">Recent Scans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentScans.map((scan) => (
                  <div key={scan.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-102">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center shadow-sm">
                        <i className="fas fa-file-medical text-blue-600"></i>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{scan.patient}</p>
                        <p className="text-sm text-slate-600">{scan.type} • {scan.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={`mb-2 transition-all duration-300 hover:scale-105 ${
                          scan.status === 'Completed' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                          scan.status === 'Processing' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' :
                          'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {scan.status}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-slate-500">Confidence:</span>
                        <span className="text-sm font-medium text-slate-700">{scan.confidence}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white cursor-pointer whitespace-nowrap !rounded-button transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg">
                View All Scans
              </Button>
            </CardContent>
          </Card>
        </div>
        {/* Patient Queue */}
        <div>
          <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-100 mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-slate-50">
              <CardTitle className="text-lg font-semibold text-slate-800">Patient Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {patientQueue.map((patient, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-102">
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{patient.name}</p>
                      <p className="text-xs text-slate-600">{patient.type}</p>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={`text-xs mb-1 transition-all duration-300 hover:scale-105 ${
                          patient.priority === 'High' ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                          patient.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' :
                          'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {patient.priority}
                      </Badge>
                      <p className="text-xs text-slate-500">{patient.waitTime}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="mt-8">
        {/* System Status */}
        <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-slate-50">
            <CardTitle className="text-lg font-semibold text-slate-800">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">AI Processing</span>
                  <span className="text-slate-800">92%</span>
                </div>
                <Progress value={92} className="h-2 bg-gradient-to-r from-blue-100 to-blue-200" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Storage Usage</span>
                  <span className="text-slate-800">67%</span>
                </div>
                <Progress value={67} className="h-2 bg-gradient-to-r from-blue-100 to-blue-200" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Network Load</span>
                  <span className="text-slate-800">34%</span>
                </div>
                <Progress value={34} className="h-2 bg-gradient-to-r from-blue-100 to-blue-200" />
              </div>
            </div>
            <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <i className="fas fa-check-circle text-green-600 animate-pulse"></i>
                <span className="text-sm text-green-700 font-medium">All Systems Operational</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )}
</main>
  </div>
</div>
);
};
export default App