"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Shield } from "lucide-react"

export function SafetyModule() {
  const [activeView, setActiveView] = useState("reporting")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Safety Management</h2>
          <p className="text-gray-600 mt-1">Near Misses, PPE Compliance & Injury Tracking</p>
        </div>
        <Badge variant="outline" className="bg-red-50 text-red-700">
          Days Without Incident: 45
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
                <Shield className="h-5 w-5 mr-2 text-red-600" />
                Safety Performance Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-600">Safety metrics and incident tracking would be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="input" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Safety Event Reporting</CardTitle>
              <CardDescription>Log safety incidents and near misses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-600">Safety incident reporting forms would be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Safety Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-600">Safety risk simulation would be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
