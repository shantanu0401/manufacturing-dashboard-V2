"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  BarChart3,
  TrendingUp,
  Shield,
  Leaf,
  Users,
  Truck,
  Wrench,
  Download,
  Bell,
  Search,
} from "lucide-react"
import { Sidebar } from "./components/sidebar"
import { BackToBasicsModule } from "./components/modules/back-to-basics"
import { ProductivityModule } from "./components/modules/productivity"
import { QualityModule } from "./components/modules/quality"
import { ResourceModule } from "./components/modules/resource"
import { DeliveryModule } from "./components/modules/delivery"
import { SafetyModule } from "./components/modules/safety"
import { EnvironmentModule } from "./components/modules/environment"
import { PeopleCultureModule } from "./components/modules/people-culture"
import { Input } from "@/components/ui/input"

const modules = [
  {
    id: "basics",
    name: "Back to Basics",
    icon: Settings,
    color: "bg-blue-500",
    description: "5S, RCA, Kaizen, Abnormalities",
  },
  {
    id: "productivity",
    name: "Productivity",
    icon: TrendingUp,
    color: "bg-green-500",
    description: "OEE, MTBF, MTTR, Downtime Analysis",
  },
  {
    id: "quality",
    name: "Quality",
    icon: BarChart3,
    color: "bg-purple-500",
    description: "Yield, Defects, BOM Variance",
  },
  {
    id: "resource",
    name: "Resource Consumption",
    icon: Wrench,
    color: "bg-orange-500",
    description: "Labor, Power, Fuel, Maintenance",
  },
  {
    id: "delivery",
    name: "Delivery",
    icon: Truck,
    color: "bg-indigo-500",
    description: "Production vs Plan, Freight Metrics",
  },
  {
    id: "safety",
    name: "Safety",
    icon: Shield,
    color: "bg-red-500",
    description: "Near Misses, PPE, Injuries",
  },
  {
    id: "environment",
    name: "Environment",
    icon: Leaf,
    color: "bg-emerald-500",
    description: "Emissions, Waste, Energy Balance",
  },
  {
    id: "people",
    name: "People & Culture",
    icon: Users,
    color: "bg-pink-500",
    description: "Morale, Skills, Training",
  },
]

export default function ManufacturingDashboard() {
  const [activeModule, setActiveModule] = useState("basics")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const renderModuleContent = () => {
    switch (activeModule) {
      case "basics":
        return <BackToBasicsModule />
      case "productivity":
        return <ProductivityModule />
      case "quality":
        return <QualityModule />
      case "resource":
        return <ResourceModule />
      case "delivery":
        return <DeliveryModule />
      case "safety":
        return <SafetyModule />
      case "environment":
        return <EnvironmentModule />
      case "people":
        return <PeopleCultureModule />
      default:
        return <BackToBasicsModule />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "ml-80" : "ml-16"}`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Smart Manufacturing Platform</h1>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Production Line A
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search modules, KPIs..." className="pl-10 w-64" />
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Module Navigation */}
        <div className="bg-white border-b border-gray-200 px-6 py-2">
          <Tabs value={activeModule} onValueChange={setActiveModule} className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-1">
              {modules.map((module) => {
                const IconComponent = module.icon
                return (
                  <TabsTrigger key={module.id} value={module.id} className="flex flex-col items-center p-3 text-xs">
                    <div className={`p-2 rounded-lg ${module.color} text-white mb-1`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <span className="hidden sm:block">{module.name}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </Tabs>
        </div>

        {/* Module Content */}
        <main className="flex-1 overflow-auto p-6">{renderModuleContent()}</main>
      </div>
    </div>
  )
}
