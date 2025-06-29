"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronLeft, Database, FileText, Play, Package, Wrench, BarChart3 } from "lucide-react"

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [masterDataOpen, setMasterDataOpen] = useState(true)
  const [standardsOpen, setStandardsOpen] = useState(false)
  const [simulationOpen, setSimulationOpen] = useState(false)

  if (!isOpen) {
    return (
      <div className="fixed left-0 top-0 h-full w-16 bg-white border-r border-gray-200 z-40">
        <div className="p-4">
          <Button variant="ghost" size="sm" onClick={onToggle}>
            <Database className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed left-0 top-0 h-full w-80 bg-white border-r border-gray-200 z-40 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Control Panel</h2>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Master Data Library */}
          <Collapsible open={masterDataOpen} onOpenChange={setMasterDataOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-3 h-auto">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Master Data Library</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${masterDataOpen ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-2">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    BOMs & SKUs
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Active SKUs:</span>
                      <Badge variant="secondary">1,247</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>BOMs:</span>
                      <Badge variant="secondary">892</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <Wrench className="h-4 w-4 mr-2" />
                    Asset Mapping
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Machines:</span>
                      <Badge variant="secondary">156</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Spare Parts:</span>
                      <Badge variant="secondary">3,421</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          {/* Standards Reference */}
          <Collapsible open={standardsOpen} onOpenChange={setStandardsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-3 h-auto">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">Standards Reference</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${standardsOpen ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-2">
              <div className="space-y-2 text-sm">
                <Button variant="ghost" className="w-full justify-start text-xs">
                  📋 SOPs Library
                </Button>
                <Button variant="ghost" className="w-full justify-start text-xs">
                  💰 Rate Cards
                </Button>
                <Button variant="ghost" className="w-full justify-start text-xs">
                  📊 Efficiency Benchmarks
                </Button>
                <Button variant="ghost" className="w-full justify-start text-xs">
                  🎯 KPI Targets
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Simulation Panel */}
          <Collapsible open={simulationOpen} onOpenChange={setSimulationOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-3 h-auto">
                <div className="flex items-center space-x-2">
                  <Play className="h-5 w-5 text-orange-600" />
                  <span className="font-medium">Simulation Panel</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${simulationOpen ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-2">
              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Active Scenarios</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span>OEE Optimization</span>
                      <Badge variant="outline" className="text-green-600">
                        Running
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Carbon Reduction</span>
                      <Badge variant="outline">Draft</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>SKU Rationalization</span>
                      <Badge variant="outline">Draft</Badge>
                    </div>
                  </div>
                  <Button size="sm" className="w-full mt-3">
                    <Play className="h-3 w-3 mr-1" />
                    New Scenario
                  </Button>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Quick Stats */}
        <Card className="mt-6 bg-gray-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Today's Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Overall OEE:</span>
                <Badge className="bg-green-100 text-green-800">87.2%</Badge>
              </div>
              <div className="flex justify-between">
                <span>Quality Rate:</span>
                <Badge className="bg-blue-100 text-blue-800">94.1%</Badge>
              </div>
              <div className="flex justify-between">
                <span>Safety Events:</span>
                <Badge className="bg-red-100 text-red-800">2</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
