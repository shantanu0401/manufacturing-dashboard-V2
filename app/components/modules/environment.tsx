"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Leaf } from "lucide-react"

export function EnvironmentModule() {
  const [activeView, setActiveView] = useState("reporting")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Environmental Impact</h2>
          <p className="text-gray-600 mt-1">Emissions, Waste Management & Energy Balance</p>
        </div>
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
          Carbon Intensity: 2.1 kg CO₂/unit
        </Badge>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reporting">📊 Reporting View</TabsTrigger>
          <TabsTrigger value="input">📝 Data Input</TabsTrigger>
          <TabsTrigger value="simulation">🔬 Simulation</TabsTrigger>
        </TabsList>

        <TabsContent value="reporting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Leaf className="h-5 w-5 mr-2 text-emerald-600" />
                Environmental Performance Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-600">
                  Environmental metrics and sustainability tracking would be displayed here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="input" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Environmental Data Entry</CardTitle>
              <CardDescription>Log emissions, waste, and energy consumption</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-600">Environmental data input forms would be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Carbon Reduction Simulation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-600">Carbon reduction simulation would be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
