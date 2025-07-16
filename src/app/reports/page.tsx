"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { DateRange } from 'react-day-picker';
const App: React.FC = () => {
const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'reports'>('reports');
const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
const [selectedReports, setSelectedReports] = useState<number[]>([]);
const [searchTerm, setSearchTerm] = useState('');
const [statusFilter, setStatusFilter] = useState('all');
const [studyTypeFilter, setStudyTypeFilter] = useState('all');
const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
const [currentPage, setCurrentPage] = useState(1);
const [selectedReport, setSelectedReport] = useState<number | null>(null);
const reportsData = [
{
id: 1,
patientName: 'John Anderson',
studyType: 'Chest X-Ray',
reportDate: '2025-01-15',
status: 'completed',
findings: 'Possible pneumonia detected in right lower lobe',
priority: 'High'
},
{
id: 2,
patientName: 'Sarah Johnson',
studyType: 'Brain MRI',
reportDate: '2025-01-14',
status: 'draft',
findings: 'No abnormalities detected',
priority: 'Medium'
},
{
id: 3,
patientName: 'Michael Brown',
studyType: 'Abdominal CT',
reportDate: '2025-01-14',
status: 'sent',
findings: 'Normal findings, no pathology identified',
priority: 'Low'
},
{
id: 4,
patientName: 'Emily Davis',
studyType: 'Mammography',
reportDate: '2025-01-13',
status: 'completed',
findings: 'Routine screening, no suspicious findings',
priority: 'Low'
},
{
id: 5,
patientName: 'Robert Wilson',
studyType: 'Spine MRI',
reportDate: '2025-01-13',
status: 'draft',
findings: 'Mild degenerative changes L4-L5',
priority: 'Medium'
},
{
id: 6,
patientName: 'Lisa Garcia',
studyType: 'Chest CT',
reportDate: '2025-01-12',
status: 'sent',
findings: 'Post-operative changes, healing well',
priority: 'High'
},
{
id: 7,
patientName: 'David Martinez',
studyType: 'Knee MRI',
reportDate: '2025-01-12',
status: 'completed',
findings: 'Meniscal tear confirmed, surgical consultation recommended',
priority: 'Medium'
},
{
id: 8,
patientName: 'Jennifer Lee',
studyType: 'Pelvic Ultrasound',
reportDate: '2025-01-11',
status: 'draft',
findings: 'Normal pelvic anatomy, no masses detected',
priority: 'Low'
}
];
const filteredReports = reportsData.filter(report => {
const matchesSearch = report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
report.studyType.toLowerCase().includes(searchTerm.toLowerCase());
const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
const matchesStudyType = studyTypeFilter === 'all' || report.studyType === studyTypeFilter;
return matchesSearch && matchesStatus && matchesStudyType;
});
const itemsPerPage = 10;
const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
const paginatedReports = filteredReports.slice(
(currentPage - 1) * itemsPerPage,
currentPage * itemsPerPage
);
const handleSelectReport = (reportId: number) => {
setSelectedReports(prev =>
prev.includes(reportId)
? prev.filter(id => id !== reportId)
: [...prev, reportId]
);
};
const handleSelectAll = () => {
if (selectedReports.length === paginatedReports.length) {
setSelectedReports([]);
} else {
setSelectedReports(paginatedReports.map(report => report.id));
}
};
const getStatusColor = (status: string) => {
switch (status) {
case 'draft':
return 'bg-orange-100 text-orange-700 border-orange-200';
case 'completed':
return 'bg-blue-100 text-blue-700 border-blue-200';
case 'sent':
return 'bg-green-100 text-green-700 border-green-200';
default:
return 'bg-gray-100 text-gray-700 border-gray-200';
}
};
const ReportsPage = () => (
<div className="min-h-screen bg-gray-50">
{/* Main Content Only (no nav or sidebar) */}
<main className="flex-1 p-6">
{/* Page Header */}
<div className="flex items-center justify-between mb-8">
<div>
<h1 className="text-3xl font-bold text-gray-800">Medical Reports</h1>
<p className="text-gray-600 mt-1">Manage and review all diagnostic reports</p>
</div>
<Button className="!rounded-button whitespace-nowrap bg-blue-500 hover:bg-blue-600 cursor-pointer">
<i className="fas fa-plus mr-2"></i>
Generate New Report
</Button>
</div>
{/* Filters Section */}
<Card className="mb-6 border-gray-200">
<div className="p-6">
<div className="grid md:grid-cols-4 gap-4 mb-4">
<div className="relative">
<Input
placeholder="Search reports..."
value={searchTerm}
onChange={(e) => setSearchTerm(e.target.value)}
className="pl-10 border-gray-300 text-sm"
/>
<i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
</div>
<Select value={statusFilter} onValueChange={setStatusFilter}>
<SelectTrigger className="border-gray-300 text-sm">
<SelectValue placeholder="Filter by Status" />
</SelectTrigger>
<SelectContent>
<SelectItem value="all">All Status</SelectItem>
<SelectItem value="draft">Draft</SelectItem>
<SelectItem value="completed">Completed</SelectItem>
<SelectItem value="sent">Sent</SelectItem>
</SelectContent>
</Select>
<Select value={studyTypeFilter} onValueChange={setStudyTypeFilter}>
<SelectTrigger className="border-gray-300 text-sm">
<SelectValue placeholder="Filter by Study Type" />
</SelectTrigger>
<SelectContent>
<SelectItem value="all">All Study Types</SelectItem>
<SelectItem value="Chest X-Ray">Chest X-Ray</SelectItem>
<SelectItem value="Brain MRI">Brain MRI</SelectItem>
<SelectItem value="Abdominal CT">Abdominal CT</SelectItem>
<SelectItem value="Mammography">Mammography</SelectItem>
<SelectItem value="Spine MRI">Spine MRI</SelectItem>
<SelectItem value="Chest CT">Chest CT</SelectItem>
<SelectItem value="Knee MRI">Knee MRI</SelectItem>
<SelectItem value="Pelvic Ultrasound">Pelvic Ultrasound</SelectItem>
</SelectContent>
</Select>
<Popover>
<PopoverTrigger asChild>
<Button variant="outline" className="!rounded-button whitespace-nowrap border-gray-300 cursor-pointer">
<i className="fas fa-calendar mr-2"></i>
Date Range
</Button>
</PopoverTrigger>
<PopoverContent className="w-auto p-0" align="start">
<Calendar
  mode="range"
  selected={dateRange}
  onSelect={setDateRange}
  numberOfMonths={2}
/>
</PopoverContent>
</Popover>
</div>
{/* Bulk Actions */}
{selectedReports.length > 0 && (
<div className="flex items-center space-x-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
<span className="text-sm text-blue-700 font-medium">
{selectedReports.length} report{selectedReports.length > 1 ? 's' : ''} selected
</span>
<div className="flex space-x-2">
<Button size="sm" className="!rounded-button whitespace-nowrap bg-blue-500 hover:bg-blue-600 cursor-pointer">
<i className="fas fa-download mr-1"></i>
Export Selected
</Button>
<Button size="sm" variant="outline" className="!rounded-button whitespace-nowrap border-blue-300 text-blue-600 hover:bg-blue-50 cursor-pointer">
<i className="fas fa-envelope mr-1"></i>
Send Selected
</Button>
<Button size="sm" variant="outline" className="!rounded-button whitespace-nowrap border-red-300 text-red-600 hover:bg-red-50 cursor-pointer">
<i className="fas fa-trash mr-1"></i>
Delete Selected
</Button>
</div>
</div>
)}
</div>
</Card>
{/* Reports Table */}
<Card className="border-gray-200">
<div className="overflow-x-auto">
<table className="w-full">
<thead className="bg-gray-50 border-b border-gray-200">
<tr>
<th className="p-4 text-left">
<Checkbox
checked={selectedReports.length === paginatedReports.length && paginatedReports.length > 0}
onCheckedChange={handleSelectAll}
/>
</th>
<th className="p-4 text-left text-sm font-semibold text-gray-700">Patient Name</th>
<th className="p-4 text-left text-sm font-semibold text-gray-700">Study Type</th>
<th className="p-4 text-left text-sm font-semibold text-gray-700">Report Date</th>
<th className="p-4 text-left text-sm font-semibold text-gray-700">Status</th>
<th className="p-4 text-left text-sm font-semibold text-gray-700">Findings</th>
<th className="p-4 text-left text-sm font-semibold text-gray-700">Actions</th>
</tr>
</thead>
<tbody>
{paginatedReports.map((report) => (
<tr
key={report.id}
className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
onClick={() => setSelectedReport(report.id)}
>
<td className="p-4">
<Checkbox
checked={selectedReports.includes(report.id)}
onCheckedChange={() => handleSelectReport(report.id)}
onClick={(e) => e.stopPropagation()}
/>
</td>
<td className="p-4">
<div className="flex items-center space-x-3">
<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
<i className="fas fa-user text-blue-500 text-sm"></i>
</div>
<span className="font-medium text-gray-800">{report.patientName}</span>
</div>
</td>
<td className="p-4 text-gray-700">{report.studyType}</td>
<td className="p-4 text-gray-700">{format(new Date(report.reportDate), 'MMM dd, yyyy')}</td>
<td className="p-4">
<Badge className={getStatusColor(report.status)}>
{report.status.charAt(0).toUpperCase() + report.status.slice(1)}
</Badge>
</td>
<td className="p-4 text-gray-600 text-sm max-w-xs truncate">{report.findings}</td>
<td className="p-4">
<div className="flex items-center space-x-2">
<Button
size="sm"
variant="ghost"
className="!rounded-button whitespace-nowrap cursor-pointer"
onClick={(e) => {
e.stopPropagation();
setSelectedReport(report.id);
}}
>
<i className="fas fa-eye text-blue-500"></i>
</Button>
<Button
size="sm"
variant="ghost"
className="!rounded-button whitespace-nowrap cursor-pointer"
onClick={(e) => e.stopPropagation()}
>
<i className="fas fa-edit text-green-500"></i>
</Button>
<Button
size="sm"
variant="ghost"
className="!rounded-button whitespace-nowrap cursor-pointer"
onClick={(e) => e.stopPropagation()}
>
<i className="fas fa-download text-purple-500"></i>
</Button>
<Button
size="sm"
variant="ghost"
className="!rounded-button whitespace-nowrap cursor-pointer"
onClick={(e) => e.stopPropagation()}
>
<i className="fas fa-paper-plane text-orange-500"></i>
</Button>
</div>
</td>
</tr>
))}
</tbody>
</table>
</div>
{/* Pagination */}
<div className="p-4 border-t border-gray-200 flex items-center justify-between">
<div className="text-sm text-gray-600">
Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredReports.length)} of {filteredReports.length} reports
</div>
<div className="flex items-center space-x-2">
<Button
variant="outline"
size="sm"
className="!rounded-button whitespace-nowrap cursor-pointer"
onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
disabled={currentPage === 1}
>
<i className="fas fa-chevron-left mr-1"></i>
Previous
</Button>
<div className="flex space-x-1">
{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
const page = i + 1;
return (
<Button
key={page}
variant={currentPage === page ? "default" : "outline"}
size="sm"
className="!rounded-button whitespace-nowrap cursor-pointer"
onClick={() => setCurrentPage(page)}
>
{page}
</Button>
);
})}
</div>
<Button
variant="outline"
size="sm"
className="!rounded-button whitespace-nowrap cursor-pointer"
onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
disabled={currentPage === totalPages}
>
Next
<i className="fas fa-chevron-right ml-1"></i>
</Button>
</div>
</div>
</Card>
</main>
{/* Report Detail Modal */}
{selectedReport && (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
<div className="bg-white rounded-lg w-full max-w-6xl h-5/6 m-4 flex flex-col">
<div className="p-6 border-b border-gray-200 flex items-center justify-between">
<div>
<h3 className="text-xl font-semibold text-gray-800">
Report Details - {reportsData.find(r => r.id === selectedReport)?.patientName}
</h3>
<p className="text-sm text-gray-600 mt-1">
{reportsData.find(r => r.id === selectedReport)?.studyType} • {reportsData.find(r => r.id === selectedReport)?.reportDate}
</p>
</div>
<div className="flex items-center space-x-2">
<Button className="!rounded-button whitespace-nowrap bg-blue-500 hover:bg-blue-600 cursor-pointer">
<i className="fas fa-edit mr-2"></i>
Edit Report
</Button>
<Button variant="outline" className="!rounded-button whitespace-nowrap cursor-pointer">
<i className="fas fa-download mr-2"></i>
Download PDF
</Button>
<Button variant="outline" className="!rounded-button whitespace-nowrap cursor-pointer">
<i className="fas fa-paper-plane mr-2"></i>
Send Report
</Button>
<Button
variant="ghost"
className="!rounded-button whitespace-nowrap cursor-pointer"
onClick={() => setSelectedReport(null)}
>
<i className="fas fa-times"></i>
</Button>
</div>
</div>
<div className="flex-1 flex">
{/* Medical Image */}
<div className="flex-1 bg-black relative">
<img
src="https://readdy.ai/api/search-image?query=professional%20medical%20chest%20x-ray%20radiograph%20showing%20clear%20anatomical%20structures%20with%20diagnostic%20quality%20imaging%20in%20grayscale%20with%20medical%20annotations%20and%20measurement%20markers&width=800&height=600&seq=report-xray-001&orientation=landscape"
alt="Medical Scan"
className="w-full h-full object-contain"
/>
<div className="absolute top-4 left-4 flex space-x-2">
<Button size="sm" className="!rounded-button whitespace-nowrap bg-blue-500 hover:bg-blue-600 cursor-pointer">
<i className="fas fa-search-plus mr-1"></i>
Zoom In
</Button>
<Button size="sm" variant="outline" className="!rounded-button whitespace-nowrap bg-white cursor-pointer">
<i className="fas fa-adjust mr-1"></i>
Adjust
</Button>
<Button size="sm" variant="outline" className="!rounded-button whitespace-nowrap bg-white cursor-pointer">
<i className="fas fa-ruler mr-1"></i>
Measure
</Button>
</div>
</div>
{/* Report Content */}
<div className="w-96 bg-gray-50 border-l border-gray-200">
<ScrollArea className="h-full">
<div className="p-6 space-y-6">
{/* Patient Information */}
<div>
<h4 className="text-lg font-semibold text-gray-800 mb-3">Patient Information</h4>
<div className="space-y-2 text-sm">
<div className="flex justify-between">
<span className="text-gray-600">Name:</span>
<span className="font-medium">{reportsData.find(r => r.id === selectedReport)?.patientName}</span>
</div>
<div className="flex justify-between">
<span className="text-gray-600">Study Type:</span>
<span className="font-medium">{reportsData.find(r => r.id === selectedReport)?.studyType}</span>
</div>
<div className="flex justify-between">
<span className="text-gray-600">Date:</span>
<span className="font-medium">{reportsData.find(r => r.id === selectedReport)?.reportDate}</span>
</div>
<div className="flex justify-between">
<span className="text-gray-600">Status:</span>
{(() => {
const status = reportsData.find(r => r.id === selectedReport)?.status;
return status ? (
<Badge className={getStatusColor(status)}>
{status.charAt(0).toUpperCase() + status.slice(1)}
</Badge>
) : null;
})()}
</div>
</div>
</div>
{/* Clinical History */}
<div>
<h4 className="text-lg font-semibold text-gray-800 mb-3">Clinical History</h4>
<p className="text-sm text-gray-700 leading-relaxed">
Patient presents with persistent cough and chest discomfort for the past 5 days.
History of smoking, currently experiencing mild fever and shortness of breath on exertion.
</p>
</div>
{/* Findings */}
<div>
<h4 className="text-lg font-semibold text-gray-800 mb-3">Findings</h4>
<div className="space-y-3">
<div className="p-3 bg-red-50 border border-red-200 rounded-lg">
<div className="flex items-center space-x-2 mb-2">
<i className="fas fa-exclamation-triangle text-red-500"></i>
<span className="text-sm font-medium text-red-700">Critical Finding</span>
</div>
<p className="text-xs text-red-600">
{reportsData.find(r => r.id === selectedReport)?.findings}
</p>
</div>
<div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
<div className="flex items-center space-x-2 mb-2">
<i className="fas fa-info-circle text-blue-500"></i>
<span className="text-sm font-medium text-blue-700">Additional Notes</span>
</div>
<p className="text-xs text-blue-600">
Heart size within normal limits. No pleural effusion detected.
Costophrenic angles are sharp bilaterally.
</p>
</div>
</div>
</div>
{/* Impression */}
<div>
<h4 className="text-lg font-semibold text-gray-800 mb-3">Impression</h4>
<p className="text-sm text-gray-700 leading-relaxed">
1. Right lower lobe pneumonia<br/>
2. No evidence of pleural effusion<br/>
3. Normal cardiac silhouette<br/>
4. Recommend clinical correlation and follow-up imaging if symptoms persist
</p>
</div>
{/* Recommendations */}
<div>
<h4 className="text-lg font-semibold text-gray-800 mb-3">Recommendations</h4>
<ul className="text-sm text-gray-700 space-y-1">
<li>• Antibiotic therapy as clinically indicated</li>
<li>• Follow-up chest X-ray in 7-10 days</li>
<li>• Clinical correlation recommended</li>
<li>• Return if symptoms worsen</li>
</ul>
</div>
{/* Report History */}
<div>
<h4 className="text-lg font-semibold text-gray-800 mb-3">Report History</h4>
<div className="space-y-2 text-sm">
<div className="flex items-center space-x-2 text-gray-600">
<i className="fas fa-clock text-xs"></i>
<span>Created: Jan 15, 2025 at 2:30 PM</span>
</div>
<div className="flex items-center space-x-2 text-gray-600">
<i className="fas fa-user-md text-xs"></i>
<span>Reviewed by: Dr. Smith</span>
</div>
<div className="flex items-center space-x-2 text-gray-600">
<i className="fas fa-check-circle text-xs"></i>
<span>Status: Completed</span>
</div>
</div>
</div>
</div>
</ScrollArea>
</div>
</div>
</div>
</div>
)}
</div>
);
return <ReportsPage />;
};
export default App