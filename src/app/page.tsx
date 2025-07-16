"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [counters, setCounters] = useState({ accuracy: 0, studies: 0, hospitals: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const animateCounters = () => {
      const targets = { accuracy: 98, studies: 50000, hospitals: 250 };
      const duration = 2000;
      const steps = 60;
      const increment = duration / steps;
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        setCounters({
          accuracy: Math.floor(targets.accuracy * progress),
          studies: Math.floor(targets.studies * progress),
          hospitals: Math.floor(targets.hospitals * progress),
        });
        if (step >= steps) {
          clearInterval(timer);
          setCounters(targets);
        }
      }, increment);
    };
    const observer = new window.IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
        }
      });
    });
    const statsSection = document.getElementById("stats-section");
    if (statsSection) {
      observer.observe(statsSection);
    }
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: "fas fa-upload",
      title: "Image Processing & Upload",
      description: "Advanced DICOM image processing with secure cloud upload capabilities and real-time optimization.",
      details: "Support for CT, MRI, X-Ray, and ultrasound images with automated quality enhancement.",
    },
    {
      icon: "fas fa-brain",
      title: "AI Disease Detection",
      description: "Deep learning algorithms for automated detection of anomalies and pathological conditions.",
      details: "Trained on millions of medical images with 98.5% accuracy in disease identification.",
    },
    {
      icon: "fas fa-folder-open",
      title: "Study Management",
      description: "Comprehensive patient study organization with intelligent categorization and search.",
      details: "Automated workflow management with priority queuing and case assignment.",
    },
    {
      icon: "fas fa-file-medical-alt",
      title: "Reporting System",
      description: "Automated report generation with structured findings and clinical recommendations.",
      details: "Customizable templates with voice-to-text integration and collaborative review.",
    },
    {
      icon: "fas fa-chart-line",
      title: "Dashboard & Analytics",
      description: "Real-time analytics dashboard with performance metrics and trend analysis.",
      details: "Interactive visualizations with department-wise statistics and productivity insights.",
    },
    {
      icon: "fas fa-plug",
      title: "Integration Capabilities",
      description: "Seamless integration with existing PACS, HIS, and EMR systems via secure APIs.",
      details: "HL7 FHIR compliance with custom integration support for legacy systems.",
    },
  ];

  const workflowSteps = [
    {
      step: 1,
      title: "Image Upload",
      description: "Secure upload of medical images through DICOM protocol",
      icon: "fas fa-cloud-upload-alt",
    },
    {
      step: 2,
      title: "AI Processing",
      description: "Advanced neural networks analyze images for anomalies",
      icon: "fas fa-microchip",
    },
    {
      step: 3,
      title: "Report Generation",
      description: "Automated diagnostic reports with clinical insights",
      icon: "fas fa-file-medical",
    },
    {
      step: 4,
      title: "Review & Approval",
      description: "Radiologist review and final approval workflow",
      icon: "fas fa-user-md",
    },
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Radiologist",
      hospital: "Metropolitan Medical Center",
      content:
        "This AI system has revolutionized our radiology department. The accuracy is remarkable and it has reduced our reporting time by 60%.",
      rating: 5,
    },
    {
      name: "Dr. Michael Chen",
      role: "Director of Imaging",
      hospital: "City General Hospital",
      content:
        "The integration was seamless and the diagnostic capabilities are outstanding. Our patient outcomes have significantly improved.",
      rating: 5,
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Senior Radiologist",
      hospital: "Regional Healthcare System",
      content:
        "The automated reporting feature is a game-changer. We can now handle 3x more cases while maintaining the highest quality standards.",
      rating: 5,
    },
  ];

  const integrations = [
    { name: "Epic", icon: "fas fa-hospital" },
    { name: "Cerner", icon: "fas fa-heartbeat" },
    { name: "PACS", icon: "fas fa-database" },
    { name: "HL7 FHIR", icon: "fas fa-exchange-alt" },
    { name: "Philips", icon: "fas fa-stethoscope" },
    { name: "GE Healthcare", icon: "fas fa-x-ray" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <i className="fas fa-brain text-white text-lg"></i>
              </div>
              <span className="text-xl font-bold text-gray-800">Scanalyze</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 cursor-pointer">Home</a>
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 cursor-pointer">Features</a>
              <a href="#solutions" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 cursor-pointer">Solutions</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 cursor-pointer">About</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 cursor-pointer">Contact</a>
            </nav>
            <Button className="!rounded-button whitespace-nowrap bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer" onClick={() => router.push("/dashboard")}>
              Get Started
            </Button>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <section id="home" className="pt-20 pb-16 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://readdy.ai/api/search-image?query=modern%20minimalist%20medical%20laboratory%20with%20doctor%20analyzing%20brain%20scans%20on%20holographic%20display%2C%20clean%20professional%20environment%20with%20soft%20ambient%20lighting%2C%20subtle%20blue%20tones%20and%20minimal%20medical%20equipment&width=1440&height=800&seq=hero-bg-001&orientation=landscape')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/90 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-1 gap-12 items-center min-h-[600px]">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">
                  <i className="fas fa-star mr-2"></i>
                  AI-Powered Diagnostics
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  AI-Powered
                  <span className="block text-blue-600">Radiology Image</span>
                  <span className="block">Processing</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Revolutionary agentic AI system for automated disease identification with 98.5% accuracy.
                  Transform your radiology workflow with intelligent image processing and real-time diagnostics.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="!rounded-button whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                  onClick={() => router.push("/dashboard")}
                >
                  <i className="fas fa-play mr-2"></i>
                  Get Started
                </Button>
                
              </div>
              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">98.5%</div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">50K+</div>
                  <div className="text-sm text-gray-600">Studies Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">250+</div>
                  <div className="text-sm text-gray-600">Hospitals</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Comprehensive AI Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our advanced AI system provides end-to-end radiology workflow automation with cutting-edge machine learning capabilities
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 cursor-pointer"
                onMouseEnter={() => setActiveFeature(index)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <i className={`${feature.icon} text-white text-2xl`}></i>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 mb-4 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  <div className={`text-sm text-gray-500 transition-all duration-300 ${activeFeature === index ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0'} overflow-hidden`}>
                    {feature.details}
                  </div>
                  <Button variant="ghost" className="!rounded-button whitespace-nowrap text-blue-600 hover:text-blue-700 hover:bg-blue-50 mt-4 cursor-pointer">
                    Learn More <i className="fas fa-arrow-right ml-2"></i>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined workflow ensures efficient processing from image upload to final diagnosis
            </p>
          </div>
          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 transform -translate-y-1/2 hidden lg:block"></div>
            <div className="grid lg:grid-cols-4 gap-8">
              {workflowSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:-translate-y-2 cursor-pointer">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <i className={`${step.icon} text-white text-xl`}></i>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Dashboard Preview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Intelligent Dashboard</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real-time analytics and comprehensive case management in one unified interface
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-3xl p-8 shadow-2xl">
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="grid lg:grid-cols-3 gap-6 mb-8">
                {/* ... Dashboard Cards ... */}
                <Card className="shadow-lg border-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                      <i className="fas fa-chart-line text-blue-600 mr-2"></i>
                      Processing Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Today</span>
                        <span className="font-bold text-gray-900">1,247 studies</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Accuracy</span>
                        <span className="font-bold text-green-600">98.7%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Avg Time</span>
                        <span className="font-bold text-blue-600">2.3 min</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-lg border-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                      <i className="fas fa-exclamation-triangle text-orange-500 mr-2"></i>
                      Priority Cases
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Urgent: 3 cases</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">High: 12 cases</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Medium: 28 cases</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-lg border-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                      <i className="fas fa-users text-green-600 mr-2"></i>
                      Active Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Radiologists</span>
                        <span className="font-bold text-gray-900">24 online</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Technicians</span>
                        <span className="font-bold text-gray-900">18 online</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Sessions</span>
                        <span className="font-bold text-blue-600">156</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <i className="fas fa-brain text-purple-600 mr-2"></i>
                  AI Analysis Results
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Chest X-Ray Analysis</span>
                        <Badge className="bg-green-100 text-green-700">Normal</Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                      </div>
                      <span className="text-xs text-gray-500">Confidence: 95%</span>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Brain MRI Scan</span>
                        <Badge className="bg-red-100 text-red-700">Abnormal</Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                      </div>
                      <span className="text-xs text-gray-500">Confidence: 87%</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">CT Abdomen</span>
                        <Badge className="bg-yellow-100 text-yellow-700">Review</Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                      </div>
                      <span className="text-xs text-gray-500">Confidence: 72%</span>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Mammography</span>
                        <Badge className="bg-green-100 text-green-700">Normal</Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                      <span className="text-xs text-gray-500">Confidence: 92%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Integration Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Seamless Integration</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with your existing healthcare systems and workflows through our robust API and integration capabilities
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Compatible Systems</h3>
                <div className="grid grid-cols-2 gap-4">
                  {integrations.map((integration, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:-translate-y-1 cursor-pointer">
                      <i className={`${integration.icon} text-3xl text-blue-600 mb-3 group-hover:scale-110 transition-transform duration-300`}></i>
                      <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{integration.name}</h4>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">Technical Capabilities</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-check-circle text-green-500"></i>
                    <span className="text-gray-700">HL7 FHIR R4 Compliance</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-check-circle text-green-500"></i>
                    <span className="text-gray-700">DICOM Protocol Support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-check-circle text-green-500"></i>
                    <span className="text-gray-700">RESTful API Integration</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-check-circle text-green-500"></i>
                    <span className="text-gray-700">Real-time Data Synchronization</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-check-circle text-green-500"></i>
                    <span className="text-gray-700">Enterprise Security Standards</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-2xl">
                <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">System Architecture</h4>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-cloud text-blue-600"></i>
                      <div>
                        <h5 className="font-semibold text-gray-800">Cloud Infrastructure</h5>
                        <p className="text-sm text-gray-600">Scalable, secure cloud deployment</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-shield-alt text-green-600"></i>
                      <div>
                        <h5 className="font-semibold text-gray-800">Security Layer</h5>
                        <p className="text-sm text-gray-600">End-to-end encryption & compliance</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-brain text-purple-600"></i>
                      <div>
                        <h5 className="font-semibold text-gray-800">AI Engine</h5>
                        <p className="text-sm text-gray-600">Advanced machine learning models</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-database text-orange-600"></i>
                      <div>
                        <h5 className="font-semibold text-gray-800">Data Management</h5>
                        <p className="text-sm text-gray-600">Intelligent data processing & storage</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section id="stats-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Proven Results</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI system delivers measurable improvements in diagnostic accuracy and workflow efficiency
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <i className="fas fa-bullseye text-white text-2xl"></i>
              </div>
              <div className="text-4xl font-bold text-blue-600 mb-2">{counters.accuracy}%</div>
              <div className="text-lg font-semibold text-gray-800 mb-2">Diagnostic Accuracy</div>
              <div className="text-gray-600">Industry-leading precision in medical image analysis</div>
            </div>
            <div className="text-center bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <i className="fas fa-file-medical text-white text-2xl"></i>
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">{counters.studies.toLocaleString()}+</div>
              <div className="text-lg font-semibold text-gray-800 mb-2">Studies Processed</div>
              <div className="text-gray-600">Comprehensive analysis across multiple imaging modalities</div>
            </div>
            <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <i className="fas fa-hospital text-white text-2xl"></i>
              </div>
              <div className="text-4xl font-bold text-purple-600 mb-2">{counters.hospitals}+</div>
              <div className="text-lg font-semibold text-gray-800 mb-2">Healthcare Facilities</div>
              <div className="text-gray-600">Trusted by leading hospitals and medical centers worldwide</div>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Healthcare Professionals Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how our AI system is transforming radiology departments worldwide
            </p>
          </div>
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <Card className="bg-white shadow-2xl border-0 mx-4">
                      <CardContent className="p-12 text-center">
                        <div className="mb-6">
                          <img
                            src={`https://readdy.ai/api/search-image?query=professional%20medical%20doctor%20portrait%20in%20white%20coat%2C%20confident%20healthcare%20professional%2C%20clean%20medical%20background%2C%20high%20quality%20headshot%20photography&width=120&height=120&seq=doctor-${index}&orientation=squarish`}
                            alt={testimonial.name}
                            className="w-20 h-20 rounded-full mx-auto object-cover shadow-lg"
                          />
                        </div>
                        <div className="flex justify-center mb-6">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <i key={i} className="fas fa-star text-yellow-400 text-xl mx-1"></i>
                          ))}
                        </div>
                        <blockquote className="text-xl text-gray-700 italic mb-8 leading-relaxed">
                          "{testimonial.content}"
                        </blockquote>
                        <div>
                          <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                          <div className="text-blue-600 font-medium">{testimonial.role}</div>
                          <div className="text-gray-500">{testimonial.hospital}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-200 cursor-pointer ${
                    index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                  <i className="fas fa-brain text-white text-lg"></i>
                </div>
                <span className="text-xl font-bold">Scanalyze</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Revolutionizing medical imaging with advanced AI technology for accurate, efficient radiology diagnostics.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <i className="fab fa-facebook"></i>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">AI Diagnostics</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Image Processing</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Workflow Management</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Integration Services</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">News & Events</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 mb-4 md:mb-0">
                © 2024 RadiologyAI. All rights reserved.
              </div>
              <div className="flex items-center space-x-6 text-gray-400">
                <span className="flex items-center">
                  <i className="fas fa-shield-alt mr-2 text-green-500"></i>
                  HIPAA Compliant
                </span>
                <span className="flex items-center">
                  <i className="fas fa-certificate mr-2 text-blue-500"></i>
                  FDA Cleared
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
