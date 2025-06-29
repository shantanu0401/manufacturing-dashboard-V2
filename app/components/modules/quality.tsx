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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Target, AlertTriangle, TrendingDown, Award, Loader2 } from "lucide-react"
import { useQualityData, useManufacturingData } from "@/hooks/use-manufacturing-data"

export function QualityModule() {
  const [activeView, setActiveView] = useState("reporting")
  const [selectedPlant, setSelectedPlant] = useState<string>("")
  const [selectedLine, setSelectedLine] = useState<string>("")
  const { toast } = useToast()

  // Data hooks
  const { plants, productionLines, products, employees, loading: masterLoading } = useManufacturingData()
  const { data: qualityData, loading: qualityLoading, submitInspection } = useQualityData(selectedPlant, selectedLine)

  // Form state
  const [inspectionForm, setInspectionForm] = useState({
    product_id: "",
    batch_number: "",
    inspector_id: "",
    inspected_quantity: 0,
    passed_quantity: 0,
    failed_quantity: 0,
    defect_category: "",
    comments: "",
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

  // Process quality data for charts
  const yieldByProduct = products
    .map((product) => {
      const productInspections = qualityData.filter((q) => q.product_id === product.id)
      const avgYield =
        productInspections.length > 0
          ? productInspections.reduce((sum, q) => sum + q.yield_percent, 0) / productInspections.length
          : 0
      const totalDefects = productInspections.reduce((sum, q) => sum + q.failed_quantity, 0)

      return {
        product: product.name,
        yield: Math.round(avgYield * 100) / 100,
        target: product.target_yield,
        defects: totalDefects,
      }
    })
    .filter((item) => item.yield > 0)

  // Defect categories
  const defectCategories = qualityData.reduce((acc, inspection) => {
    if (inspection.defect_category && inspection.failed_quantity > 0) {
      const existing = acc.find((item) => item.category === inspection.defect_category)
      if (existing) {
        existing.count += inspection.failed_quantity
      } else {
        acc.push({
          category: inspection.defect_category,
          count: inspection.failed_quantity,
          color: getRandomColor(),
        })
      }
    }
    return acc
  }, [] as any[])

  function getRandomColor() {
    const colors = ["#ef4444", "#f59e0b", "#8b5cf6", "#10b981", "#6b7280"]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  // Calculate overall metrics
  const overallYield =
    qualityData.length > 0 ? qualityData.reduce((sum, q) => sum + q.yield_percent, 0) / qualityData.length : 0
  const totalDefects = qualityData.reduce((sum, q) => sum + q.failed_quantity, 0)

  const handleInspectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPlant || !selectedLine) {
      toast({
        title: "Error",
        description: "Please select a plant and production line",
        variant: "destructive",
      })
      return
    }

    const result = await submitInspection({
      ...inspectionForm,
      plant_id: selectedPlant,
      line_id: selectedLine,
      inspection_date: new Date().toISOString().split("T")[0],
    })

    if (result.success) {
      toast({
        title: "Success",
        description: "Quality inspection submitted successfully",
      })
      setInspectionForm({
        product_id: "",
        batch_number: "",
        inspector_id: "",
        inspected_quantity: 0,
        passed_quantity: 0,
        failed_quantity: 0,
        defect_category: "",
        comments: "",
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to submit inspection",
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
          <h2 className="text-3xl font-bold text-gray-900">Quality Management</h2>
          <p className="text-gray-600 mt-1">Yield Analysis, Defect Tracking, BOM Variance & Cost of Poor Quality</p>
        </div>
        <Badge variant="outline" className="bg-purple-50 text-purple-700">
          Overall Yield: {overallYield.toFixed(1)}%
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
          {qualityLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading quality data...
            </div>
          ) : (
            <>
              {/* Quality KPIs */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Target className="h-4 w-4 mr-2" />
                      Overall Yield
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600 mb-2">{overallYield.toFixed(1)}%</div>
                    <Progress value={overallYield} className="mb-2" />
                    <div className="text-sm text-gray-600">Target: 94.5%</div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Total Defects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-600 mb-2">{totalDefects}</div>
                    <div className="text-sm text-gray-600">This period</div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <TrendingDown className="h-4 w-4 mr-2" />
                      Inspections
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-600 mb-2">{qualityData.length}</div>
                    <div className="text-sm text-gray-600">Total inspections</div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Award className="h-4 w-4 mr-2" />
                      Pass Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {qualityData.length > 0
                        ? (
                            (qualityData.reduce((sum, q) => sum + q.passed_quantity, 0) /
                              qualityData.reduce((sum, q) => sum + q.inspected_quantity, 0)) *
                            100
                          ).toFixed(1)
                        : 0}
                      %
                    </div>
                    <div className="text-sm text-gray-600">Overall pass rate</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Yield by Product */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2 text-green-600" />
                      Yield Performance by Product
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {yieldByProduct.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={yieldByProduct}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="product" />
                          <YAxis domain={[85, 100]} />
                          <Tooltip />
                          <Bar dataKey="yield" fill="#10b981" name="Actual Yield %" />
                          <Bar dataKey="target" fill="#ef4444" fillOpacity={0.3} name="Target %" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-8 text-gray-500">No yield data available</div>
                    )}
                  </CardContent>
                </Card>

                {/* Defect Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                      Defect Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {defectCategories.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={defectCategories}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            dataKey="count"
                            label={({ name, value }) => `${name}: ${value}`}
                          >
                            {defectCategories.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-8 text-gray-500">No defect data available</div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="input" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quality Inspection Form */}
            <Card>
              <CardHeader>
                <CardTitle>Quality Inspection Entry</CardTitle>
                <CardDescription>Record inspection results</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleInspectionSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="product">Product SKU</Label>
                      <Select
                        value={inspectionForm.product_id}
                        onValueChange={(value) => setInspectionForm({ ...inspectionForm, product_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} - {product.sku}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="batch-number">Batch Number</Label>
                      <Input
                        id="batch-number"
                        placeholder="Batch ID"
                        value={inspectionForm.batch_number}
                        onChange={(e) => setInspectionForm({ ...inspectionForm, batch_number: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="inspected-qty">Inspected Qty</Label>
                      <Input
                        id="inspected-qty"
                        type="number"
                        placeholder="Units"
                        value={inspectionForm.inspected_quantity}
                        onChange={(e) =>
                          setInspectionForm({
                            ...inspectionForm,
                            inspected_quantity: Number.parseInt(e.target.value) || 0,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="passed-qty">Passed Qty</Label>
                      <Input
                        id="passed-qty"
                        type="number"
                        placeholder="Units"
                        value={inspectionForm.passed_quantity}
                        onChange={(e) =>
                          setInspectionForm({
                            ...inspectionForm,
                            passed_quantity: Number.parseInt(e.target.value) || 0,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="failed-qty">Failed Qty</Label>
                      <Input
                        id="failed-qty"
                        type="number"
                        placeholder="Units"
                        value={inspectionForm.failed_quantity}
                        onChange={(e) =>
                          setInspectionForm({
                            ...inspectionForm,
                            failed_quantity: Number.parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="defect-category">Defect Category</Label>
                    <Select
                      value={inspectionForm.defect_category}
                      onValueChange={(value) => setInspectionForm({ ...inspectionForm, defect_category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dimensional">Dimensional</SelectItem>
                        <SelectItem value="Surface Finish">Surface Finish</SelectItem>
                        <SelectItem value="Material">Material</SelectItem>
                        <SelectItem value="Assembly">Assembly</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="inspector">Inspector</Label>
                    <Select
                      value={inspectionForm.inspector_id}
                      onValueChange={(value) => setInspectionForm({ ...inspectionForm, inspector_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select inspector" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees
                          .filter((emp) => emp.role === "Quality Inspector")
                          .map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="comments">Comments</Label>
                    <Textarea
                      id="comments"
                      placeholder="Additional notes..."
                      value={inspectionForm.comments}
                      onChange={(e) => setInspectionForm({ ...inspectionForm, comments: e.target.value })}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Submit Inspection
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Recent Inspections */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Inspections</CardTitle>
                <CardDescription>Latest quality inspection records</CardDescription>
              </CardHeader>
              <CardContent>
                {qualityData.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {qualityData.slice(0, 10).map((inspection) => (
                      <div key={inspection.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">
                              {inspection.product?.name} - {inspection.batch_number}
                            </div>
                            <div className="text-sm text-gray-600">
                              {new Date(inspection.inspection_date).toLocaleDateString()} | {inspection.inspector?.name}
                            </div>
                          </div>
                          <Badge variant={inspection.yield_percent >= 95 ? "default" : "destructive"}>
                            {inspection.yield_percent.toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="mt-2 text-sm">
                          <span className="text-green-600">{inspection.passed_quantity} passed</span>
                          {inspection.failed_quantity > 0 && (
                            <span className="text-red-600 ml-2">{inspection.failed_quantity} failed</span>
                          )}
                        </div>
                        {inspection.defect_category && (
                          <div className="mt-1 text-xs text-gray-500">Defect: {inspection.defect_category}</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">No inspection data available</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="simulation" className="space-y-6">
          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-purple-800">Quality Improvement Simulation</CardTitle>
              <CardDescription className="text-purple-700">
                Model the impact of quality initiatives on yield and cost reduction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-purple-800">Improvement Scenarios</h4>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-sm">Yield Improvement Target (%)</Label>
                      <Input type="number" defaultValue="2.5" min="0" max="10" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Defect Reduction Target (%)</Label>
                      <Input type="number" defaultValue="25" min="0" max="50" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Process Control Investment ($)</Label>
                      <Input type="number" defaultValue="75000" min="0" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Training Investment ($)</Label>
                      <Input type="number" defaultValue="25000" min="0" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Implementation Timeline (months)</Label>
                      <Input type="number" defaultValue="6" min="1" max="24" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-purple-800">Projected Impact</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-sm">Current Yield</span>
                      <div className="text-right">
                        <div className="font-bold text-gray-600">{overallYield.toFixed(1)}%</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-sm">Projected Yield</span>
                      <div className="text-right">
                        <div className="font-bold text-green-600">95.5%</div>
                        <div className="text-xs text-gray-500">+2.5% improvement</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-sm">Defect Reduction</span>
                      <div className="text-right">
                        <div className="font-bold text-blue-600">-25%</div>
                        <div className="text-xs text-gray-500">Fewer defects</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-sm">Cost Savings</span>
                      <div className="text-right">
                        <div className="font-bold text-green-600">$180K</div>
                        <div className="text-xs text-gray-500">Annual</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">ROI</span>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">180%</div>
                        <div className="text-xs text-gray-500">6.7-month payback</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button className="bg-purple-500 hover:bg-purple-600">Run Simulation</Button>
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
