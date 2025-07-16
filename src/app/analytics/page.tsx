"use client";
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import * as echarts from 'echarts';
import { DateRange } from 'react-day-picker';
const AnalyticsPage: React.FC = () => {
const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
from: new Date(2025, 0, 1),
to: new Date(2025, 0, 15)
});
const [departmentFilter, setDepartmentFilter] = useState('all');
const [studyTypeFilter, setStudyTypeFilter] = useState('all');
const [statusFilter, setStatusFilter] = useState('all');
// Sample analytics data
const analyticsData = {
totalReports: 2847,
completedReports: 2456,
averageTurnaroundTime: '4.2 hours',
reportsInProgress: 391,
reportStatusDistribution: [
{ name: 'Completed', value: 2456, color: '#10B981' },
{ name: 'In Progress', value: 391, color: '#F59E0B' },
{ name: 'Draft', value: 156, color: '#EF4444' },
{ name: 'Sent', value: 844, color: '#3B82F6' }
],
monthlyReportVolumes: [
{ month: 'Jul', reports: 2100 },
{ month: 'Aug', reports: 2300 },
{ month: 'Sep', reports: 2450 },
{ month: 'Oct', reports: 2200 },
{ month: 'Nov', reports: 2650 },
{ month: 'Dec', reports: 2800 },
{ month: 'Jan', reports: 2847 }
],
studyTypeFrequency: [
{ type: 'Chest X-Ray', count: 856 },
{ type: 'Brain MRI', count: 423 },
{ type: 'Abdominal CT', count: 378 },
{ type: 'Mammography', count: 345 },
{ type: 'Spine MRI', count: 298 },
{ type: 'Chest CT', count: 267 },
{ type: 'Knee MRI', count: 189 },
{ type: 'Pelvic Ultrasound', count: 91 }
],
priorityLevelBreakdown: [
{ name: 'High', value: 425, color: '#EF4444' },
{ name: 'Medium', value: 1698, color: '#F59E0B' },
{ name: 'Low', value: 724, color: '#10B981' }
],
radiologistPerformance: [
{ name: 'Dr. Sarah Johnson', completed: 456, avgTime: '3.8 hours', accuracy: '98.5%', workload: 16.0 },
{ name: 'Dr. Michael Chen', completed: 423, avgTime: '4.1 hours', accuracy: '97.8%', workload: 14.9 },
{ name: 'Dr. Emily Rodriguez', completed: 398, avgTime: '3.9 hours', accuracy: '98.2%', workload: 14.0 },
{ name: 'Dr. James Wilson', completed: 367, avgTime: '4.3 hours', accuracy: '97.5%', workload: 12.9 },
{ name: 'Dr. Lisa Anderson', completed: 334, avgTime: '4.0 hours', accuracy: '98.1%', workload: 11.7 },
{ name: 'Dr. Robert Martinez', completed: 312, avgTime: '4.2 hours', accuracy: '97.9%', workload: 11.0 },
{ name: 'Dr. Jennifer Lee', completed: 289, avgTime: '4.4 hours', accuracy: '97.6%', workload: 10.2 },
{ name: 'Dr. David Brown', completed: 267, avgTime: '4.1 hours', accuracy: '98.0%', workload: 9.4 }
]
};
useEffect(() => {
// Initialize charts after component mounts
initializeCharts();
}, []);
const initializeCharts = () => {
// Report Status Distribution Pie Chart
const statusChart = echarts.init(document.getElementById('statusChart'));
statusChart.setOption({
animation: false,
tooltip: {
trigger: 'item',
formatter: '{a} <br/>{b}: {c} ({d}%)'
},
legend: {
orient: 'vertical',
left: 'left',
textStyle: { fontSize: 12 }
},
series: [
{
name: 'Report Status',
type: 'pie',
radius: '50%',
data: analyticsData.reportStatusDistribution.map(item => ({
value: item.value,
name: item.name,
itemStyle: { color: item.color }
})),
emphasis: {
itemStyle: {
shadowBlur: 10,
shadowOffsetX: 0,
shadowColor: 'rgba(0, 0, 0, 0.5)'
}
}
}
]
});
// Monthly Report Volumes Line Chart
const volumeChart = echarts.init(document.getElementById('volumeChart'));
volumeChart.setOption({
animation: false,
tooltip: {
trigger: 'axis'
},
xAxis: {
type: 'category',
data: analyticsData.monthlyReportVolumes.map(item => item.month),
axisLabel: { fontSize: 12 }
},
yAxis: {
type: 'value',
axisLabel: { fontSize: 12 }
},
series: [
{
data: analyticsData.monthlyReportVolumes.map(item => item.reports),
type: 'line',
smooth: true,
lineStyle: { color: '#3B82F6', width: 3 },
itemStyle: { color: '#3B82F6' },
areaStyle: { color: 'rgba(59, 130, 246, 0.1)' }
}
]
});
// Study Type Frequency Bar Chart
const studyChart = echarts.init(document.getElementById('studyChart'));
studyChart.setOption({
animation: false,
tooltip: {
trigger: 'axis',
axisPointer: { type: 'shadow' }
},
xAxis: {
type: 'value',
axisLabel: { fontSize: 12 }
},
yAxis: {
type: 'category',
data: analyticsData.studyTypeFrequency.map(item => item.type),
axisLabel: { fontSize: 11 }
},
series: [
{
data: analyticsData.studyTypeFrequency.map(item => item.count),
type: 'bar',
itemStyle: { color: '#10B981' },
barWidth: '60%'
}
]
});
// Priority Level Breakdown Donut Chart
const priorityChart = echarts.init(document.getElementById('priorityChart'));
priorityChart.setOption({
animation: false,
tooltip: {
trigger: 'item',
formatter: '{a} <br/>{b}: {c} ({d}%)'
},
legend: {
orient: 'vertical',
left: 'left',
textStyle: { fontSize: 12 }
},
series: [
{
name: 'Priority Level',
type: 'pie',
radius: ['40%', '70%'],
data: analyticsData.priorityLevelBreakdown.map(item => ({
value: item.value,
name: item.name,
itemStyle: { color: item.color }
})),
emphasis: {
itemStyle: {
shadowBlur: 10,
shadowOffsetX: 0,
shadowColor: 'rgba(0, 0, 0, 0.5)'
}
}
}
]
});
// Handle window resize
window.addEventListener('resize', () => {
statusChart.resize();
volumeChart.resize();
studyChart.resize();
priorityChart.resize();
});
};
return (
  <div className="min-h-screen bg-gray-50">
    {/* Main Content Only (no sidebar or top nav) */}
    <main className="flex-1 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive medical reporting statistics and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="!rounded-button whitespace-nowrap border-gray-300 cursor-pointer">
                <i className="fas fa-calendar mr-2"></i>
                {dateRange.from && dateRange.to
                  ? `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd')}`
                  : 'Select Date Range'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange as DateRange}
                onSelect={(range) => setDateRange(range as DateRange)}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button className="!rounded-button whitespace-nowrap bg-blue-500 hover:bg-blue-600 cursor-pointer">
            <i className="fas fa-download mr-2"></i>
            Export Report
          </Button>
        </div>
      </div>
      {/* Filter Controls */}
      <Card className="mb-6 border-gray-200">
        <div className="p-6">
          <div className="grid md:grid-cols-4 gap-4">
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="border-gray-300 text-sm">
                <SelectValue placeholder="Filter by Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="radiology">Radiology</SelectItem>
                <SelectItem value="cardiology">Cardiology</SelectItem>
                <SelectItem value="neurology">Neurology</SelectItem>
                <SelectItem value="orthopedics">Orthopedics</SelectItem>
              </SelectContent>
            </Select>
            <Select value={studyTypeFilter} onValueChange={setStudyTypeFilter}>
              <SelectTrigger className="border-gray-300 text-sm">
                <SelectValue placeholder="Filter by Study Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Study Types</SelectItem>
                <SelectItem value="xray">X-Ray</SelectItem>
                <SelectItem value="mri">MRI</SelectItem>
                <SelectItem value="ct">CT Scan</SelectItem>
                <SelectItem value="ultrasound">Ultrasound</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-gray-300 text-sm">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="progress">In Progress</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="!rounded-button whitespace-nowrap border-gray-300 cursor-pointer">
              <i className="fas fa-sync-alt mr-2"></i>
              Refresh Data
            </Button>
          </div>
        </div>
      </Card>
      {/* Key Metrics Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-3xl font-bold text-gray-800">{analyticsData.totalReports.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">
                  <i className="fas fa-arrow-up mr-1"></i>
                  +12.5% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-file-medical text-blue-500 text-xl"></i>
              </div>
            </div>
          </div>
        </Card>
        <Card className="border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Reports</p>
                <p className="text-3xl font-bold text-gray-800">{analyticsData.completedReports.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">
                  <i className="fas fa-arrow-up mr-1"></i>
                  +8.3% completion rate
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-check-circle text-green-500 text-xl"></i>
              </div>
            </div>
          </div>
        </Card>
        <Card className="border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Turnaround Time</p>
                <p className="text-3xl font-bold text-gray-800">{analyticsData.averageTurnaroundTime}</p>
                <p className="text-sm text-red-600 mt-1">
                  <i className="fas fa-arrow-down mr-1"></i>
                  -0.3 hours from target
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-clock text-orange-500 text-xl"></i>
              </div>
            </div>
          </div>
        </Card>
        <Card className="border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reports in Progress</p>
                <p className="text-3xl font-bold text-gray-800">{analyticsData.reportsInProgress}</p>
                <p className="text-sm text-blue-600 mt-1">
                  <i className="fas fa-spinner mr-1"></i>
                  13.7% of total reports
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-tasks text-purple-500 text-xl"></i>
              </div>
            </div>
          </div>
        </Card>
      </div>
      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Report Status Distribution */}
        <Card className="border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Report Status Distribution</h3>
              <Button variant="ghost" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
                <i className="fas fa-expand-alt"></i>
              </Button>
            </div>
            <div id="statusChart" style={{ width: '100%', height: '300px' }}></div>
          </div>
        </Card>
        {/* Monthly Report Volumes */}
        <Card className="border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Monthly Report Volumes</h3>
              <Button variant="ghost" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
                <i className="fas fa-expand-alt"></i>
              </Button>
            </div>
            <div id="volumeChart" style={{ width: '100%', height: '300px' }}></div>
          </div>
        </Card>
        {/* Study Type Frequency */}
        <Card className="border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Study Type Frequency</h3>
              <Button variant="ghost" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
                <i className="fas fa-expand-alt"></i>
              </Button>
            </div>
            <div id="studyChart" style={{ width: '100%', height: '300px' }}></div>
          </div>
        </Card>
        {/* Priority Level Breakdown */}
        <Card className="border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Priority Level Breakdown</h3>
              <Button variant="ghost" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
                <i className="fas fa-expand-alt"></i>
              </Button>
            </div>
            <div id="priorityChart" style={{ width: '100%', height: '300px' }}></div>
          </div>
        </Card>
      </div>
      {/* Radiologist Performance Table */}
      <Card className="border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Radiologist Performance Metrics</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
                <i className="fas fa-filter mr-2"></i>
                Filter
              </Button>
              <Button variant="outline" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
                <i className="fas fa-download mr-2"></i>
                Export
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Radiologist</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Reports Completed</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Avg Completion Time</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Accuracy Rate</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Workload %</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Performance</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.radiologistPerformance.map((radiologist, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <i className="fas fa-user-md text-blue-500 text-sm"></i>
                        </div>
                        <span className="font-medium text-gray-800">{radiologist.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-700 font-medium">{radiologist.completed}</td>
                    <td className="p-4 text-gray-700">{radiologist.avgTime}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-700">{radiologist.accuracy}</span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: radiologist.accuracy }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-700">{radiologist.workload}%</span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${radiologist.workload * 5}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={
                        parseFloat(radiologist.accuracy) >= 98
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : parseFloat(radiologist.accuracy) >= 97.5
                          ? 'bg-blue-100 text-blue-700 border-blue-200'
                          : 'bg-orange-100 text-orange-700 border-orange-200'
                      }>
                        {parseFloat(radiologist.accuracy) >= 98 ? 'Excellent' :
                          parseFloat(radiologist.accuracy) >= 97.5 ? 'Good' : 'Average'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
      {/* Additional Insights */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <Card className="border-gray-200">
          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Key Performance Indicators</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Report Completion Rate</span>
                <span className="text-sm font-medium text-gray-800">86.3%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Review Time</span>
                <span className="text-sm font-medium text-gray-800">2.1 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Quality Score</span>
                <span className="text-sm font-medium text-gray-800">97.8%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Patient Satisfaction</span>
                <span className="text-sm font-medium text-gray-800">4.7/5.0</span>
              </div>
            </div>
          </div>
        </Card>
        <Card className="border-gray-200">
          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Department Workload</h4>
            <div className="space-y-3">
              {[
                { dept: 'Radiology', load: 85, color: 'bg-blue-500' },
                { dept: 'Cardiology', load: 72, color: 'bg-green-500' },
                { dept: 'Neurology', load: 68, color: 'bg-purple-500' },
                { dept: 'Orthopedics', load: 54, color: 'bg-orange-500' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.dept}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${item.load}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800 w-8">{item.load}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card className="border-gray-200">
          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h4>
            <div className="space-y-3">
              {[
                { action: 'New report completed', time: '2 min ago', icon: 'fas fa-check-circle', color: 'text-green-500' },
                { action: 'High priority case assigned', time: '15 min ago', icon: 'fas fa-exclamation-triangle', color: 'text-red-500' },
                { action: 'Report sent to physician', time: '1 hour ago', icon: 'fas fa-paper-plane', color: 'text-blue-500' },
                { action: 'Quality review completed', time: '2 hours ago', icon: 'fas fa-star', color: 'text-purple-500' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <i className={`${item.icon} ${item.color} text-sm`}></i>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{item.action}</p>
                    <p className="text-xs text-gray-500">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </main>
  </div>
);
};
export default AnalyticsPage;