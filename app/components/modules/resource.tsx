"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Zap, Users, Fuel, Wrench } from "lucide-react"

const resourceData = [
  { category: "Labor", budgeted: 45000, actual: 47200, variance: 4.9 },
  { category: "Power", budgeted: 12000, actual: 11400, variance: -5.0 },
  { category: "Fuel", budgeted: 8500, actual: 9100, variance: 7.1 },
  { category: "Maintenance", budgeted: 15000, actual: 16800, variance: 12.0 },
]

export function ResourceModule() {
  const [activeView, setActiveView] = useState("reporting")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Resource Consumption</h2>
          <p className="text-gray-600 mt-1">Labor, Power, Fuel & Maintenance Cost Analysis</p>
        </div>
        <Badge variant="outline" className="bg-orange-50 text-orange-700">
          Total Variance: +6.2%
        </Badge>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reporting">📊 Reporting View</TabsTrigger>
          <TabsTrigger value="input">📝 Data Input</TabsTrigger>
          <TabsTrigger value="simulation">🔬 Simulation</TabsTrigger>
        </TabsList>

        <TabsContent value="reporting" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Labor Cost
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">$47.2K</div>
                <div className="text-sm text-red-600">↗ +4.9% vs budget</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  Power Cost
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600 mb-2">$11.4K</div>
                <div className="text-sm text-green-600">↘ -5.0% vs budget</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Fuel className="h-4 w-4 mr-2" />
                  Fuel Cost
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600 mb-2">$9.1K</div>
                <div className="text-sm text-red-600">↗ +7.1% vs budget</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Wrench className="h-4 w-4 mr-2" />
                  Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 mb-2">$16.8K</div>
                <div className="text-sm text-red-600">↗ +12.0% vs budget</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resource Cost Analysis - Budget vs Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={resourceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="budgeted" fill="#94a3b8" name="Budgeted ($)" />
                  <Bar dataKey="actual" fill="#3b82f6" name="Actual ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="input" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resource Consumption Entry</CardTitle>
              <CardDescription>Log daily resource usage and costs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <input type="date" className="w-full mt-1 p-2 border rounded-md" />
                </div>
                <div>
                  <label className="text-sm font-medium">Shift</label>
                  <select className="w-full mt-1 p-2 border rounded-md">
                    <option>Select Shift</option>
                    <option>Shift 1</option>
                    <option>Shift 2</option>
                    <option>Shift 3</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Labor Hours</label>
                  <input type="number" className="w-full mt-1 p-2 border rounded-md" placeholder="Total hours" />
                </div>
                <div>
                  <label className="text-sm font-medium">Labor Cost ($)</label>
                  <input type="number" className="w-full mt-1 p-2 border rounded-md" placeholder="Total cost" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Power Consumption (kWh)</label>
                  <input type="number" className="w-full mt-1 p-2 border rounded-md" placeholder="kWh used" />
                </div>
                <div>
                  <label className="text-sm font-medium">Power Cost ($)</label>
                  <input type="number" className="w-full mt-1 p-2 border rounded-md" placeholder="Total cost" />
                </div>
              </div>

              <button className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
                Submit Resource Data
              </button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulation" className="space-y-6">
          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-800">Resource Optimization Simulation</CardTitle>
              <CardDescription className="text-orange-700">
                Model resource efficiency improvements and cost savings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-600">Resource optimization simulation interface would be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
