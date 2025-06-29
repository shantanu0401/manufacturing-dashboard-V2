"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, Clock, AlertCircle, Loader2 } from "lucide-react"
import { useProductionData, useManufacturingData } from "@/hooks/use-manufacturing-data"

export function ProductivityModule() {
  const [activeView, setActiveView] = useState("reporting")
  const [selectedPlant, setSelectedPlant] = useState<string>("")
  const [selectedLine, setSelectedLine] = useState<string>("")
  const { toast } = useToast()

  // Data hooks
  const { plants, productionLines, products, employees, loading: masterLoading } = useManufacturingData()
  const {
    data: productionData,
    oeeData,
    loading: productionLoading,
    submitData,
  } = useProductionData(selectedPlant, selectedLine)

  // Form state
  const [productionForm, setProductionForm] = useState({
    shift: "",
    hour_of_day: 1,
    product_id: "",
    planned_production: 0,
    actual_production: 0,
    good_units: 0,
    rejected_units: 0,
    downtime_minutes: 0,
    downtime_reason: "",
    operator_id: "",
  })

  // Set default plant and line
  useEffect(() => {
    if (plants.length > 0 && !selectedPlant) {
      setSelectedPlant(plants[0].id)
    }
  }, [plants, selectedPlant])

  useEffect(() => {
    if (productionLines.length > 0 && selectedPlant && !selectedLine) {
      const plantLines = productionLines.filter((line) => line.plant_id === selectedPlant)
      if (plantLines.length > 0) {
        setSelectedLine(plantLines[0].id)
      }
    }
  }, [productionLines, selectedPlant, selectedLine])

  // Process downtime data
  const downtimeData = productionData.reduce((acc, record) => {
    if (record.downtime_minutes > 0 && record.downtime_reason) {
      const existing = acc.find((item) => item.reason === record.downtime_reason)
      if (existing) {
        existing.minutes += record.downtime_minutes
      } else {
        acc.push({
          reason: record.downtime_reason,
          minutes: record.downtime_minutes,
          color: getRandomColor(),
        })
      }
    }
    return acc
  }, [] as any[])

  function getRandomColor() {
    const colors = ["#3b82f6", "#ef4444", "#f59e0b", "#8b5cf6", "#10b981"]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  // Calculate current OEE metrics
  const currentOEE =
    oeeData.length > 0
      ? oeeData[0]
      : {
          availability: 0,
          performance: 0,
          quality: 0,
          oee: 0,
        }

  const handleProductionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPlant || !selectedLine) {
      toast({
        title: "Error",
        description: "Please select a plant and production line",
        variant: "destructive",
      })
      return
    }

    const result = await submitData({
      ...productionForm,
      plant_id: selectedPlant,
      line_id: selectedLine,
      production_date: new Date().toISOString().split("T")[0],
    })

    if (result.success) {
      toast({
        title: "Success",
        description: "Production data submitted successfully",
      })
      setProductionForm({
        shift: "",
        hour_of_day: 1,
        product_id: "",
        planned_production: 0,
        actual_production: 0,
        good_units: 0,
        rejected_units: 0,
        downtime_minutes: 0,
        downtime_reason: "",
        operator_id: "",
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to submit production data",
        variant: "destructive",
      })
    }
  }

  if (masterLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading manufacturing data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Productivity Analytics</h2>
          <p className="text-gray-600 mt-1">OEE, MTBF, MTTR, Downtime & Loss Analysis</p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700">
          Current OEE: {currentOEE.oee.toFixed(1)}%
        </Badge>
      </div>

      {/* Plant and Line Selection */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <Label htmlFor="plant-select">Plant</Label>
          <Select value={selectedPlant} onValueChange={setSelectedPlant}>
            <SelectTrigger>
              <SelectValue placeholder="Select plant" />
            </SelectTrigger>
            <SelectContent>
              {plants.map((plant) => (
                <SelectItem key={plant.id} value={plant.id}>
                  {plant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Label htmlFor="line-select">Production Line</Label>
          <Select value={selectedLine} onValueChange={setSelectedLine}>
            <SelectTrigger>
              <SelectValue placeholder="Select line" />
            </SelectTrigger>
            <SelectContent>
              {productionLines
                .filter((line) => line.plant_id === selectedPlant)
                .map((line) => (
                  <SelectItem key={line.id} value={line.id}>
                    {line.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reporting">📊 Reporting View</TabsTrigger>
          <TabsTrigger value="input">📝 Data Input</TabsTrigger>
          <TabsTrigger value="simulation">🔬 Simulation</TabsTrigger>
        </TabsList>

        <TabsContent value="reporting" className="space-y-6">
          {productionLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading production data...
            </div>
          ) : (
            <>
              {/* OEE Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Overall OEE</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600 mb-2">{currentOEE.oee.toFixed(1)}%</div>
                    <Progress value={currentOEE.oee} className="mb-2" />
                    <div className="text-sm text-gray-600">Target: 85%</div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Availability
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600 mb-2">{currentOEE.availability.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">Equipment uptime</div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600 mb-2">{currentOEE.performance.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">Speed efficiency</div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Quality</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-600 mb-2">{currentOEE.quality.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">Good parts ratio</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* OEE by Shift */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                      OEE Performance by Shift
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {oeeData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={oeeData.slice(0, 6)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="shift" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="availability" fill="#10b981" name="Availability %" />
                          <Bar dataKey="performance" fill="#3b82f6" name="Performance %" />
                          <Bar dataKey="quality" fill="#f59e0b" name="Quality %" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-8 text-gray-500">No OEE data available</div>
                    )}
                  </CardContent>
                </Card>

                {/* Downtime Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
                      Downtime Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {downtimeData.length > 0 ? (
                      <>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={downtimeData}
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              dataKey="minutes"
                              label={({ name, value }) => `${name}: ${value}m`}
                            >
                              {downtimeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-4 text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {downtimeData.reduce((sum, item) => sum + item.minutes, 0)} min
                          </div>
                          <div className="text-sm text-gray-600">Total Downtime</div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8 text-gray-500">No downtime data available</div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="input" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Production Data Entry */}
            <Card>
              <CardHeader>
                <CardTitle>Production Data Entry</CardTitle>
                <CardDescription>Hourly production logging</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProductionSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="shift">Shift</Label>
                      <Select
                        value={productionForm.shift}
                        onValueChange={(value) => setProductionForm({ ...productionForm, shift: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select shift" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Shift 1">Shift 1 (6AM-2PM)</SelectItem>
                          <SelectItem value="Shift 2">Shift 2 (2PM-10PM)</SelectItem>
                          <SelectItem value="Shift 3">Shift 3 (10PM-6AM)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="hour">Hour</Label>
                      <Select
                        value={productionForm.hour_of_day.toString()}
                        onValueChange={(value) =>
                          setProductionForm({ ...productionForm, hour_of_day: Number.parseInt(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select hour" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 8 }, (_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              Hour {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="product">Product</Label>
                    <Select
                      value={productionForm.product_id}
                      onValueChange={(value) => setProductionForm({ ...productionForm, product_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} ({product.sku})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="planned-production">Planned Production</Label>
                      <Input
                        id="planned-production"
                        type="number"
                        placeholder="Units"
                        value={productionForm.planned_production}
                        onChange={(e) =>
                          setProductionForm({
                            ...productionForm,
                            planned_production: Number.parseInt(e.target.value) || 0,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="actual-production">Actual Production</Label>
                      <Input
                        id="actual-production"
                        type="number"
                        placeholder="Units"
                        value={productionForm.actual_production}
                        onChange={(e) =>
                          setProductionForm({
                            ...productionForm,
                            actual_production: Number.parseInt(e.target.value) || 0,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="good-units">Good Units</Label>
                      <Input
                        id="good-units"
                        type="number"
                        placeholder="Units"
                        value={productionForm.good_units}
                        onChange={(e) =>
                          setProductionForm({ ...productionForm, good_units: Number.parseInt(e.target.value) || 0 })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="rejected-units">Rejected Units</Label>
                      <Input
                        id="rejected-units"
                        type="number"
                        placeholder="Units"
                        value={productionForm.rejected_units}
                        onChange={(e) =>
                          setProductionForm({ ...productionForm, rejected_units: Number.parseInt(e.target.value) || 0 })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="downtime-minutes">Downtime (minutes)</Label>
                    <Input
                      id="downtime-minutes"
                      type="number"
                      placeholder="Minutes"
                      value={productionForm.downtime_minutes}
                      onChange={(e) =>
                        setProductionForm({ ...productionForm, downtime_minutes: Number.parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="downtime-reason">Downtime Reason</Label>
                    <Select
                      value={productionForm.downtime_reason}
                      onValueChange={(value) => setProductionForm({ ...productionForm, downtime_reason: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Planned Maintenance">Planned Maintenance</SelectItem>
                        <SelectItem value="Equipment Breakdown">Equipment Breakdown</SelectItem>
                        <SelectItem value="Material Shortage">Material Shortage</SelectItem>
                        <SelectItem value="Product Changeover">Product Changeover</SelectItem>
                        <SelectItem value="Quality Issues">Quality Issues</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="operator">Operator</Label>
                    <Select
                      value={productionForm.operator_id}
                      onValueChange={(value) => setProductionForm({ ...productionForm, operator_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees
                          .filter((emp) => emp.role === "Operator")
                          .map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full">
                    Submit Production Data
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Recent Production Data */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Production Records</CardTitle>
                <CardDescription>Latest production entries</CardDescription>
              </CardHeader>
              <CardContent>
                {productionData.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {productionData.slice(0, 10).map((record) => (
                      <div key={record.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">
                              {record.product?.name} - {record.shift}
                            </div>
                            <div className="text-sm text-gray-600">
                              Hour {record.hour_of_day} | {new Date(record.production_date).toLocaleDateString()}
                            </div>
                          </div>
                          <Badge
                            variant={record.actual_production >= record.planned_production ? "default" : "destructive"}
                          >
                            {record.actual_production}/{record.planned_production}
                          </Badge>
                        </div>
                        {record.downtime_minutes > 0 && (
                          <div className="mt-2 text-sm text-red-600">
                            Downtime: {record.downtime_minutes}min - {record.downtime_reason}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">No production data available</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="simulation" className="space-y-6">
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800">OEE Optimization Simulation</CardTitle>
              <CardDescription className="text-blue-700">
                Model the impact of improvements on Overall Equipment Effectiveness
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-blue-800">Improvement Scenarios</h4>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-sm">Availability Improvement (%)</Label>
                      <Input type="number" defaultValue="5" min="0" max="20" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Performance Improvement (%)</Label>
                      <Input type="number" defaultValue="8" min="0" max="25" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Quality Improvement (%)</Label>
                      <Input type="number" defaultValue="3" min="0" max="10" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Investment Required ($)</Label>
                      <Input type="number" defaultValue="450000" min="0" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-blue-800">Projected Results</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-sm">Current OEE</span>
                      <div className="text-right">
                        <div className="font-bold text-gray-600">{currentOEE.oee.toFixed(1)}%</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-sm">Projected OEE</span>
                      <div className="text-right">
                        <div className="font-bold text-green-600">84.2%</div>
                        <div className="text-xs text-gray-500">+13.2% improvement</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-sm">Additional Output</span>
                      <div className="text-right">
                        <div className="font-bold text-blue-600">+18.6%</div>
                        <div className="text-xs text-gray-500">Units per day</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-sm">Revenue Impact</span>
                      <div className="text-right">
                        <div className="font-bold text-green-600">+$2.3M</div>
                        <div className="text-xs text-gray-500">Annual</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Payback Period</span>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">2.3 months</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button className="bg-blue-500 hover:bg-blue-600">Run Simulation</Button>
                <Button variant="outline">Save Scenario</Button>
                <Button variant="outline">Export Results</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
