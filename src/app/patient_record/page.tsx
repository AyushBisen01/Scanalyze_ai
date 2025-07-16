"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { DateRange } from 'react-day-picker';

const App: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [studyTypeFilter, setStudyTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudies, setSelectedStudies] = useState<string[]>([]);
  const itemsPerPage = 10;

  // Sample studies data
  const studiesData = [
    {
      id: 'ST-2025-001',
      patientName: 'Sarah Johnson',
      patientId: 'P-12345',
      age: 45,
      gender: 'Female',
      studyType: 'Chest X-Ray',
      description: 'Routine chest examination',
      date: '2025-01-15',
      status: 'Completed',
      priority: 'Medium',
      department: 'Radiology',
      radiologist: 'Dr. Michael Chen',
      thumbnail: 'https://readdy.ai/api/search-image?query=medical%20chest%20x-ray%20image%20on%20clean%20white%20background%20showing%20clear%20lung%20structure%20for%20radiology%20examination%20with%20professional%20medical%20imaging%20quality&width=120&height=120&seq=001&orientation=squarish',
      reportGenerated: true,
      studyTime: '09:30 AM',
      modality: 'Digital Radiography'
    },
    {
      id: 'ST-2025-002',
      patientName: 'Robert Martinez',
      patientId: 'P-12346',
      age: 62,
      gender: 'Male',
      studyType: 'Brain MRI',
      description: 'Neurological assessment for headaches',
      date: '2025-01-15',
      status: 'In Progress',
      priority: 'High',
      department: 'Neurology',
      radiologist: 'Dr. Emily Rodriguez',
      thumbnail: 'https://readdy.ai/api/search-image?query=brain%20MRI%20scan%20medical%20imaging%20showing%20detailed%20brain%20structure%20on%20clean%20white%20background%20with%20professional%20radiology%20quality%20for%20neurological%20examination&width=120&height=120&seq=002&orientation=squarish',
      reportGenerated: false,
      studyTime: '10:15 AM',
      modality: 'MRI'
    },
    {
      id: 'ST-2025-003',
      patientName: 'Jennifer Lee',
      patientId: 'P-12347',
      age: 38,
      gender: 'Female',
      studyType: 'Abdominal CT',
      description: 'Abdominal pain investigation',
      date: '2025-01-14',
      status: 'Pending',
      priority: 'Medium',
      department: 'Radiology',
      radiologist: 'Unassigned',
      thumbnail: 'https://readdy.ai/api/search-image?query=abdominal%20CT%20scan%20medical%20imaging%20showing%20cross%20sectional%20anatomy%20on%20clean%20white%20background%20with%20professional%20radiology%20quality%20for%20diagnostic%20examination&width=120&height=120&seq=003&orientation=squarish',
      reportGenerated: false,
      studyTime: '02:45 PM',
      modality: 'CT'
    },
    {
      id: 'ST-2025-004',
      patientName: 'David Brown',
      patientId: 'P-12348',
      age: 55,
      gender: 'Male',
      studyType: 'Mammography',
      description: 'Routine breast screening',
      date: '2025-01-14',
      status: 'Critical',
      priority: 'High',
      department: 'Radiology',
      radiologist: 'Dr. Sarah Johnson',
      thumbnail: 'https://readdy.ai/api/search-image?query=mammography%20medical%20imaging%20scan%20showing%20breast%20tissue%20examination%20on%20clean%20white%20background%20with%20professional%20radiology%20quality%20for%20screening%20diagnosis&width=120&height=120&seq=004&orientation=squarish',
      reportGenerated: true,
      studyTime: '11:20 AM',
      modality: 'Mammography'
    },
    {
      id: 'ST-2025-005',
      patientName: 'Lisa Anderson',
      patientId: 'P-12349',
      age: 29,
      gender: 'Female',
      studyType: 'Spine MRI',
      description: 'Lower back pain assessment',
      date: '2025-01-13',
      status: 'Completed',
      priority: 'Low',
      department: 'Orthopedics',
      radiologist: 'Dr. James Wilson',
      thumbnail: 'https://readdy.ai/api/search-image?query=spine%20MRI%20medical%20imaging%20showing%20detailed%20spinal%20column%20structure%20on%20clean%20white%20background%20with%20professional%20radiology%20quality%20for%20orthopedic%20examination&width=120&height=120&seq=005&orientation=squarish',
      reportGenerated: true,
      studyTime: '03:30 PM',
      modality: 'MRI'
    },
    {
      id: 'ST-2025-006',
      patientName: 'Michael Thompson',
      patientId: 'P-12350',
      age: 41,
      gender: 'Male',
      studyType: 'Chest CT',
      description: 'Follow-up for pulmonary nodule',
      date: '2025-01-13',
      status: 'In Progress',
      priority: 'High',
      department: 'Pulmonology',
      radiologist: 'Dr. Robert Martinez',
      thumbnail: 'https://readdy.ai/api/search-image?query=chest%20CT%20scan%20medical%20imaging%20showing%20detailed%20lung%20structure%20on%20clean%20white%20background%20with%20professional%20radiology%20quality%20for%20pulmonary%20examination&width=120&height=120&seq=006&orientation=squarish',
      reportGenerated: false,
      studyTime: '01:15 PM',
      modality: 'CT'
    },
    {
      id: 'ST-2025-007',
      patientName: 'Emma Wilson',
      patientId: 'P-12351',
      age: 33,
      gender: 'Female',
      studyType: 'Knee MRI',
      description: 'Sports injury evaluation',
      date: '2025-01-12',
      status: 'Completed',
      priority: 'Medium',
      department: 'Sports Medicine',
      radiologist: 'Dr. Jennifer Lee',
      thumbnail: 'https://readdy.ai/api/search-image?query=knee%20MRI%20medical%20imaging%20showing%20detailed%20joint%20structure%20on%20clean%20white%20background%20with%20professional%20radiology%20quality%20for%20orthopedic%20sports%20medicine%20examination&width=120&height=120&seq=007&orientation=squarish',
      reportGenerated: true,
      studyTime: '04:45 PM',
      modality: 'MRI'
    },
    {
      id: 'ST-2025-008',
      patientName: 'James Rodriguez',
      patientId: 'P-12352',
      age: 67,
      gender: 'Male',
      studyType: 'Pelvic Ultrasound',
      description: 'Prostate examination',
      date: '2025-01-12',
      status: 'Pending',
      priority: 'Low',
      department: 'Urology',
      radiologist: 'Unassigned',
      thumbnail: 'https://readdy.ai/api/search-image?query=pelvic%20ultrasound%20medical%20imaging%20showing%20anatomical%20structure%20on%20clean%20white%20background%20with%20professional%20radiology%20quality%20for%20urological%20examination&width=120&height=120&seq=008&orientation=squarish',
      reportGenerated: false,
      studyTime: '10:00 AM',
      modality: 'Ultrasound'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'In Progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'Pending': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredStudies = studiesData.filter(study => {
    const matchesSearch = study.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         study.studyType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         study.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || study.department.toLowerCase() === departmentFilter;
    const matchesStudyType = studyTypeFilter === 'all' || study.studyType.toLowerCase().includes(studyTypeFilter);
    const matchesStatus = statusFilter === 'all' || study.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStudyType && matchesStatus;
  });

  const sortedStudies = [...filteredStudies].sort((a, b) => {
    let aValue, bValue;
    switch (sortBy) {
      case 'date':
        aValue = new Date(a.date);
        bValue = new Date(b.date);
        break;
      case 'patient':
        aValue = a.patientName;
        bValue = b.patientName;
        break;
      case 'type':
        aValue = a.studyType;
        bValue = b.studyType;
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      default:
        aValue = a.date;
        bValue = b.date;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const totalPages = Math.ceil(sortedStudies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudies = sortedStudies.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudies(paginatedStudies.map(study => study.id));
    } else {
      setSelectedStudies([]);
    }
  };

  const handleSelectStudy = (studyId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudies([...selectedStudies, studyId]);
    } else {
      setSelectedStudies(selectedStudies.filter(id => id !== studyId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content Only (no nav or sidebar) */}
      <main className="flex-1 p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Medical Studies</h1>
            <p className="text-gray-600 mt-1">Manage and review medical imaging studies and patient data</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="!rounded-button whitespace-nowrap border-gray-300 cursor-pointer">
              <i className="fas fa-upload mr-2"></i>
              Import Studies
            </Button>
            <Button className="!rounded-button whitespace-nowrap bg-blue-500 hover:bg-blue-600 cursor-pointer">
              <i className="fas fa-plus mr-2"></i>
              New Study
            </Button>
          </div>
        </div>

        {/* Filter and Search Controls */}
        <Card className="mb-6 border-gray-200">
          <div className="p-6">
            <div className="grid md:grid-cols-6 gap-4 mb-4">
              <div className="relative">
                <Input
                  placeholder="Search studies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-gray-300 text-sm"
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
              </div>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="!rounded-button whitespace-nowrap border-gray-300 cursor-pointer">
                    <i className="fas fa-calendar mr-2"></i>
                    {dateRange?.from && dateRange?.to
                      ? `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd')}`
                      : 'Date Range'
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => setDateRange(range)}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>

              <Select value={studyTypeFilter} onValueChange={setStudyTypeFilter}>
                <SelectTrigger className="border-gray-300 text-sm">
                  <SelectValue placeholder="Study Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="x-ray">X-Ray</SelectItem>
                  <SelectItem value="mri">MRI</SelectItem>
                  <SelectItem value="ct">CT Scan</SelectItem>
                  <SelectItem value="ultrasound">Ultrasound</SelectItem>
                  <SelectItem value="mammography">Mammography</SelectItem>
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="border-gray-300 text-sm">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="radiology">Radiology</SelectItem>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="neurology">Neurology</SelectItem>
                  <SelectItem value="orthopedics">Orthopedics</SelectItem>
                  <SelectItem value="pulmonology">Pulmonology</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-gray-300 text-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in progress">In Progress</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="!rounded-button whitespace-nowrap cursor-pointer"
                >
                  <i className="fas fa-list"></i>
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="!rounded-button whitespace-nowrap cursor-pointer"
                >
                  <i className="fas fa-th-large"></i>
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 border-gray-300 text-sm">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="patient">Patient Name</SelectItem>
                    <SelectItem value="type">Study Type</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="!rounded-button whitespace-nowrap cursor-pointer"
                >
                  <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                </Button>
              </div>
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedStudies.length)} of {sortedStudies.length} studies
              </div>
            </div>
          </div>
        </Card>

        {/* Bulk Actions */}
        {selectedStudies.length > 0 && (
          <Card className="mb-4 border-blue-200 bg-blue-50">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-700">
                  {selectedStudies.length} studies selected
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" className="!rounded-button whitespace-nowrap cursor-pointer">
                  <i className="fas fa-user-md mr-2"></i>
                  Assign Radiologist
                </Button>
                <Button size="sm" variant="outline" className="!rounded-button whitespace-nowrap cursor-pointer">
                  <i className="fas fa-file-export mr-2"></i>
                  Export DICOM
                </Button>
                <Button size="sm" variant="outline" className="!rounded-button whitespace-nowrap cursor-pointer">
                  <i className="fas fa-trash mr-2"></i>
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Studies List */}
        {viewMode === 'list' ? (
          <Card className="border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="p-4 text-left">
                      <Checkbox
                        checked={selectedStudies.length === paginatedStudies.length && paginatedStudies.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Study</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Patient</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Type</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Priority</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Radiologist</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudies.map((study) => (
                    <tr key={study.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <Checkbox
                          checked={selectedStudies.includes(study.id)}
                          onCheckedChange={(checked) => handleSelectStudy(study.id, checked as boolean)}
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={study.thumbnail}
                              alt="Study thumbnail"
                              className="w-full h-full object-cover object-top"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{study.id}</p>
                            <p className="text-sm text-gray-600">{study.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-800">{study.patientName}</p>
                          <p className="text-sm text-gray-600">{study.age}y, {study.gender}</p>
                          <p className="text-sm text-gray-500">{study.patientId}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-800">{study.studyType}</p>
                          <p className="text-sm text-gray-600">{study.modality}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-800">{study.date}</p>
                          <p className="text-sm text-gray-600">{study.studyTime}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusColor(study.status)}>
                          {study.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={getPriorityColor(study.priority)}>
                          {study.priority}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          {study.radiologist !== 'Unassigned' ? (
                            <>
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                <i className="fas fa-user-md text-blue-500 text-xs"></i>
                              </div>
                              <span className="text-sm text-gray-700">{study.radiologist}</span>
                            </>
                          ) : (
                            <Button size="sm" variant="outline" className="!rounded-button whitespace-nowrap cursor-pointer">
                              <i className="fas fa-plus mr-1"></i>
                              Assign
                            </Button>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" className="!rounded-button whitespace-nowrap cursor-pointer">
                            <i className="fas fa-eye"></i>
                          </Button>
                          <Button size="sm" variant="outline" className="!rounded-button whitespace-nowrap cursor-pointer">
                            <i className="fas fa-file-medical"></i>
                          </Button>
                          <Button size="sm" variant="outline" className="!rounded-button whitespace-nowrap cursor-pointer">
                            <i className="fas fa-ellipsis-v"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedStudies.map((study) => (
              <Card key={study.id} className="border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-4">
                  <div className="relative mb-4">
                    <div className="w-full h-40 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={study.thumbnail}
                        alt="Study thumbnail"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="absolute top-2 right-2">
                      <Checkbox
                        checked={selectedStudies.includes(study.id)}
                        onCheckedChange={(checked) => handleSelectStudy(study.id, checked as boolean)}
                        className="bg-white"
                      />
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <Badge className={getStatusColor(study.status)}>
                        {study.status}
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <Badge className={getPriorityColor(study.priority)}>
                        {study.priority}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-800">{study.studyType}</h3>
                      <p className="text-sm text-gray-600">{study.id}</p>
                    </div>
                    
                    <div>
                      <p className="font-medium text-gray-800">{study.patientName}</p>
                      <p className="text-sm text-gray-600">{study.age}y, {study.gender}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{study.date}</span>
                      <span>{study.studyTime}</span>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Department: {study.department}</p>
                      <p className="text-sm text-gray-600">
                        Radiologist: {study.radiologist}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-2">
                      <Button size="sm" className="!rounded-button whitespace-nowrap flex-1 cursor-pointer">
                        <i className="fas fa-eye mr-2"></i>
                        View DICOM
                      </Button>
                      <Button size="sm" variant="outline" className="!rounded-button whitespace-nowrap cursor-pointer">
                        <i className="fas fa-file-medical"></i>
                      </Button>
                      <Button size="sm" variant="outline" className="!rounded-button whitespace-nowrap cursor-pointer">
                        <i className="fas fa-ellipsis-v"></i>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedStudies.length)} of {sortedStudies.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="!rounded-button whitespace-nowrap cursor-pointer"
            >
              <i className="fas fa-chevron-left"></i>
            </Button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className="!rounded-button whitespace-nowrap cursor-pointer"
                >
                  {pageNum}
                </Button>
              );
            })}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="!rounded-button whitespace-nowrap cursor-pointer"
            >
              <i className="fas fa-chevron-right"></i>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          <Card className="border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Studies</p>
                  <p className="text-2xl font-bold text-gray-800">{studiesData.length}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-x-ray text-blue-500"></i>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {studiesData.filter(s => s.status === 'Completed').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-check-circle text-green-500"></i>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {studiesData.filter(s => s.status === 'In Progress').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-clock text-yellow-500"></i>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Critical</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {studiesData.filter(s => s.status === 'Critical').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-exclamation-triangle text-red-500"></i>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default App;
