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
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { Upload, Camera, FileText, TrendingUp, CheckCircle, Loader2 } from "lucide-react"
import { useFiveSData, useKaizenData, useManufacturingData } from "@/hooks/use-manufacturing-data"

export function BackToBasicsModule() {
  const [activeView, setActiveView] = useState("reporting")
  const [simulationMode, setSimulationMode] = useState(false)
  const [selectedPlant, setSelectedPlant] = useState<string>("")
  const [selectedLine, setSelectedLine] = useState<string>("")
  const { toast } = useToast()

  // Data hooks
  const { plants, productionLines, employees, loading: masterLoading } = useManufacturingData()
  const { data: fiveSData, loading: fiveSLoading, submitAudit } = useFiveSData(selectedPlant, selectedLine)
  const { data: kaizenData, loading: kaizenLoading, submitIdea } = useKaizenData(selectedPlant, selectedLine)

  // Form states
  const [auditForm, setAuditForm] = useState({
    audit_date: new Date().toISOString().split("T")[0],
    auditor_id: "",
    sort_score: 85,
    set_in_order_score: 78,
    shine_score: 92,
    standardize_score: 88,
    sustain_score: 75,
    comments: "",
  })

  const [kaizenForm, setKaizenForm] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
    current_state: "",
    proposed_solution: "",
    expected_benefit: "",
    estimated_savings: 0,
    submitter_id: "",
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

  // Process 5S data for charts
  const processedFiveSData = fiveSData.slice(0, 6).map((audit) => ({
    date: new Date(audit.audit_date).toLocaleDateString(),
    sort: audit.sort_score,
    setInOrder: audit.set_in_order_score,
    shine: audit.shine_score,
    standardize: audit.standardize_score,
    sustain: audit.sustain_score,
    overall: audit.overall_score,
  }))

  // Latest 5S scores for radar chart
  const latestFiveS = fiveSData[0]
    ? [
        { area: "Sort", score: fiveSData[0].sort_score, target: 90 },
        { area: "Set in Order", score: fiveSData[0].set_in_order_score, target: 90 },
        { area: "Shine", score: fiveSData[0].shine_score, target: 90 },
        { area: "Standardize", score: fiveSData[0].standardize_score, target: 90 },
        { area: "Sustain", score: fiveSData[0].sustain_score, target: 90 },
      ]
    : []

  // Kaizen trend data
  const kaizenTrend = kaizenData.reduce((acc, idea) => {
    const month = new Date(idea.created_at).toLocaleDateString("en-US", { month: "short" })
    const existing = acc.find((item) => item.month === month)
    if (existing) {
      if (idea.status === "implemented") existing.implemented++
      else existing.pending++
      existing.savings += idea.actual_savings || 0
    } else {
      acc.push({
        month,
        implemented: idea.status === "implemented" ? 1 : 0,
        pending: idea.status !== "implemented" ? 1 : 0,
        savings: idea.actual_savings || 0,
      })
    }
    return acc
  }, [] as any[])

  const handleAuditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPlant || !selectedLine) {
      toast({
        title: "Error",
        description: "Please select a plant and production line",
        variant: "destructive",
      })
      return
    }

    const result = await submitAudit({
      ...auditForm,
      plant_id: selectedPlant,
      line_id: selectedLine,
      photos: null,
    })

    if (result.success) {
      toast({
        title: "Success",
        description: "5S audit submitted successfully",
      })
      setAuditForm({
        audit_date: new Date().toISOString().split("T")[0],
        auditor_id: "",
        sort_score: 85,
        set_in_order_score: 78,
        shine_score: 92,
        standardize_score: 88,
        sustain_score: 75,
        comments: "",
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to submit audit",
        variant: "destructive",
      })
    }
  }

  const handleKaizenSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPlant || !selectedLine) {
      toast({
        title: "Error",
        description: "Please select a plant and production line",
        variant: "destructive",
      })
      return
    }

    const result = await submitIdea({
      ...kaizenForm,
      plant_id: selectedPlant,
      line_id: selectedLine,
      status: "submitted",
      implementation_date: "",
      actual_savings: 0,
      attachments: null,
    })

    if (result.success) {
      toast({
        title: "Success",
        description: "Kaizen idea submitted successfully",
      })
      setKaizenForm({
        title: "",
        description: "",
        category: "",
        priority: "medium",
        current_state: "",
        proposed_solution: "",
        expected_benefit: "",
        estimated_savings: 0,
        submitter_id: "",
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to submit Kaizen idea",
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
      {/* Module Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Back to Basics</h2>
          <p className="text-gray-600 mt-1">5S Implementation, Root Cause Analysis, Kaizen & Abnormality Management</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant={simulationMode ? "default" : "outline"}
            onClick={() => setSimulationMode(!simulationMode)}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {simulationMode ? "Exit Simulation" : "Simulation Mode"}
          </Button>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {productionLines.find((line) => line.id === selectedLine)?.name || "Select Line"}
          </Badge>
        </div>
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

      {/* View Tabs */}
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reporting">📊 Reporting View</TabsTrigger>
          <TabsTrigger value="input">📝 Data Input</TabsTrigger>
          <TabsTrigger value="simulation">🔬 Simulation</TabsTrigger>
        </TabsList>

        {/* Reporting View */}
        <TabsContent value="reporting" className="space-y-6">
          {fiveSLoading || kaizenLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading data...
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 5S Scorecard */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                      5S Performance Radar
                    </CardTitle>
                    <CardDescription>Current vs Target Performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {latestFiveS.length > 0 ? (
                      <>
                        <ResponsiveContainer width="100%" height={300}>
                          <RadarChart data={latestFiveS}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="area" />
                            <PolarRadiusAxis angle={90} domain={[0, 100]} />
                            <Radar name="Current" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                            <Radar
                              name="Target"
                              dataKey="target"
                              stroke="#ef4444"
                              fill="transparent"
                              strokeDasharray="5 5"
                            />
                            <Tooltip />
                          </RadarChart>
                        </ResponsiveContainer>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {fiveSData[0]?.overall_score.toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-600">Overall 5S Score</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {fiveSData.length > 1
                                ? `${(fiveSData[0].overall_score - fiveSData[1].overall_score).toFixed(1)}%`
                                : "N/A"}
                            </div>
                            <div className="text-sm text-gray-600">vs Last Audit</div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8 text-gray-500">No 5S audit data available</div>
                    )}
                  </CardContent>
                </Card>

                {/* 5S Trend */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                      5S Score Trend
                    </CardTitle>
                    <CardDescription>Historical Performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {processedFiveSData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={processedFiveSData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis domain={[60, 100]} />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="overall"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            name="Overall Score"
                          />
                          <Line type="monotone" dataKey="sort" stroke="#10b981" strokeWidth={2} name="Sort" />
                          <Line type="monotone" dataKey="shine" stroke="#f59e0b" strokeWidth={2} name="Shine" />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-8 text-gray-500">No trend data available</div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Kaizen Dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                      Total Kaizen Ideas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600 mb-2">{kaizenData.length}</div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Implemented:</span>
                        <Badge variant="secondary">{kaizenData.filter((k) => k.status === "implemented").length}</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>In Progress:</span>
                        <Badge className="bg-orange-500">
                          {kaizenData.filter((k) => k.status === "approved").length}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Submitted:</span>
                        <Badge className="bg-blue-500">
                          {kaizenData.filter((k) => k.status === "submitted").length}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Total Savings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      ${kaizenData.reduce((sum, k) => sum + (k.actual_savings || 0), 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">Actual savings realized</div>
                    <div className="text-xs text-green-600">
                      Potential: ${kaizenData.reduce((sum, k) => sum + (k.estimated_savings || 0), 0).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Implementation Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {kaizenData.length > 0
                        ? Math.round(
                            (kaizenData.filter((k) => k.status === "implemented").length / kaizenData.length) * 100,
                          )
                        : 0}
                      %
                    </div>
                    <Progress
                      value={
                        kaizenData.length > 0
                          ? (kaizenData.filter((k) => k.status === "implemented").length / kaizenData.length) * 100
                          : 0
                      }
                      className="mb-2"
                    />
                    <div className="text-sm text-gray-600">
                      {kaizenData.filter((k) => k.status === "implemented").length} of {kaizenData.length} implemented
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* Data Input View */}
        <TabsContent value="input" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 5S Audit Form */}
            <Card>
              <CardHeader>
                <CardTitle>5S Audit Entry</CardTitle>
                <CardDescription>Daily 5S scorecard input</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAuditSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="audit-date">Audit Date</Label>
                      <Input
                        id="audit-date"
                        type="date"
                        value={auditForm.audit_date}
                        onChange={(e) => setAuditForm({ ...auditForm, audit_date: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="auditor">Auditor</Label>
                      <Select
                        value={auditForm.auditor_id}
                        onValueChange={(value) => setAuditForm({ ...auditForm, auditor_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select auditor" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {[
                    { key: "sort_score", label: "Sort" },
                    { key: "set_in_order_score", label: "Set in Order" },
                    { key: "shine_score", label: "Shine" },
                    { key: "standardize_score", label: "Standardize" },
                    { key: "sustain_score", label: "Sustain" },
                  ].map((item) => (
                    <div key={item.key} className="space-y-2">
                      <Label>{item.label}</Label>
                      <div className="flex items-center space-x-4">
                        <Input
                          type="number"
                          placeholder="Score (0-100)"
                          className="flex-1"
                          min="0"
                          max="100"
                          value={auditForm[item.key as keyof typeof auditForm]}
                          onChange={(e) =>
                            setAuditForm({
                              ...auditForm,
                              [item.key]: Number.parseInt(e.target.value) || 0,
                            })
                          }
                          required
                        />
                        <Button type="button" variant="outline" size="sm">
                          <Camera className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <div>
                    <Label htmlFor="comments">Comments</Label>
                    <Textarea
                      id="comments"
                      placeholder="Additional observations..."
                      value={auditForm.comments}
                      onChange={(e) => setAuditForm({ ...auditForm, comments: e.target.value })}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Submit 5S Audit
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Kaizen Submission Form */}
            <Card>
              <CardHeader>
                <CardTitle>Kaizen Idea Submission</CardTitle>
                <CardDescription>Submit improvement suggestions</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleKaizenSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="kaizen-title">Improvement Title</Label>
                    <Input
                      id="kaizen-title"
                      placeholder="Brief description of improvement"
                      value={kaizenForm.title}
                      onChange={(e) => setKaizenForm({ ...kaizenForm, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={kaizenForm.category}
                        onValueChange={(value) => setKaizenForm({ ...kaizenForm, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="safety">Safety</SelectItem>
                          <SelectItem value="quality">Quality</SelectItem>
                          <SelectItem value="productivity">Productivity</SelectItem>
                          <SelectItem value="cost">Cost Reduction</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={kaizenForm.priority}
                        onValueChange={(value) => setKaizenForm({ ...kaizenForm, priority: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="current-state">Current State</Label>
                    <Textarea
                      id="current-state"
                      placeholder="Describe the current situation..."
                      value={kaizenForm.current_state}
                      onChange={(e) => setKaizenForm({ ...kaizenForm, current_state: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="proposed-solution">Proposed Solution</Label>
                    <Textarea
                      id="proposed-solution"
                      placeholder="Describe your improvement idea..."
                      value={kaizenForm.proposed_solution}
                      onChange={(e) => setKaizenForm({ ...kaizenForm, proposed_solution: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="expected-benefit">Expected Benefit</Label>
                    <Input
                      id="expected-benefit"
                      placeholder="Estimated savings or improvement"
                      value={kaizenForm.expected_benefit}
                      onChange={(e) => setKaizenForm({ ...kaizenForm, expected_benefit: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="estimated-savings">Estimated Savings ($)</Label>
                    <Input
                      id="estimated-savings"
                      type="number"
                      placeholder="Dollar amount"
                      value={kaizenForm.estimated_savings}
                      onChange={(e) =>
                        setKaizenForm({ ...kaizenForm, estimated_savings: Number.parseFloat(e.target.value) || 0 })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="submitter">Submitter</Label>
                    <Select
                      value={kaizenForm.submitter_id}
                      onValueChange={(value) => setKaizenForm({ ...kaizenForm, submitter_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select submitter" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button type="button" variant="outline" className="flex-1 bg-transparent">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photos
                    </Button>
                    <Button type="button" variant="outline" className="flex-1 bg-transparent">
                      <FileText className="h-4 w-4 mr-2" />
                      Attach Documents
                    </Button>
                  </div>

                  <Button type="submit" className="w-full">
                    Submit Kaizen Idea
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Simulation View */}
        <TabsContent value="simulation" className="space-y-6">
          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-800">5S Improvement Simulation</CardTitle>
              <CardDescription className="text-orange-700">
                Model the impact of 5S improvements on overall productivity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-orange-800">Scenario Parameters</h4>
                  {latestFiveS.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <Label className="text-sm">{item.area} Target Score</Label>
                      <div className="flex items-center space-x-2">
                        <Input type="range" min="0" max="100" defaultValue={item.target} className="flex-1" />
                        <span className="text-sm font-medium w-12">{item.target}%</span>
                      </div>
                    </div>
                  ))}

                  <div className="space-y-2">
                    <Label className="text-sm">Implementation Timeline (months)</Label>
                    <Input type="number" defaultValue="6" min="1" max="24" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-orange-800">Projected Impact</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-sm">Overall 5S Score</span>
                      <div className="text-right">
                        <div className="font-bold text-green-600">92.4%</div>
                        <div className="text-xs text-gray-500">+8.8% improvement</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-sm">Productivity Gain</span>
                      <div className="text-right">
                        <div className="font-bold text-blue-600">+12%</div>
                        <div className="text-xs text-gray-500">Estimated</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-sm">Cost Savings</span>
                      <div className="text-right">
                        <div className="font-bold text-green-600">$45K</div>
                        <div className="text-xs text-gray-500">Annual</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-sm">Implementation Cost</span>
                      <div className="text-right">
                        <div className="font-bold text-red-600">$12K</div>
                        <div className="text-xs text-gray-500">One-time</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">ROI</span>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">275%</div>
                        <div className="text-xs text-gray-500">12-month payback</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button className="bg-orange-500 hover:bg-orange-600">Run Simulation</Button>
                <Button variant="outline">Save Scenario</Button>
                <Button variant="outline">Compare Scenarios</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
