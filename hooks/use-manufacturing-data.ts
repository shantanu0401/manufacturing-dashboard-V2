"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type {
  FiveSAudit,
  ProductionData,
  QualityInspection,
  ResourceConsumption,
  KaizenIdea,
  Plant,
  ProductionLine,
  Product,
  Employee,
} from "@/lib/supabase"

// Mock data for demo purposes
const mockPlants: Plant[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Manufacturing Plant A",
    location: "Detroit, MI",
    timezone: "America/Detroit",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Manufacturing Plant B",
    location: "Austin, TX",
    timezone: "America/Chicago",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const mockProductionLines: ProductionLine[] = [
  {
    id: "660e8400-e29b-41d4-a716-446655440001",
    plant_id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Line A",
    capacity_per_hour: 100,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440002",
    plant_id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Line B",
    capacity_per_hour: 120,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const mockProducts: Product[] = [
  {
    id: "770e8400-e29b-41d4-a716-446655440001",
    sku: "SKU001",
    name: "Product A",
    category: "Electronics",
    unit_price: 25.5,
    target_yield: 95.0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "770e8400-e29b-41d4-a716-446655440002",
    sku: "SKU002",
    name: "Product B",
    category: "Electronics",
    unit_price: 32.75,
    target_yield: 93.0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const mockEmployees: Employee[] = [
  {
    id: "880e8400-e29b-41d4-a716-446655440001",
    employee_id: "EMP001",
    name: "John Smith",
    role: "Operator",
    shift: "Shift 1",
    plant_id: "550e8400-e29b-41d4-a716-446655440001",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "880e8400-e29b-41d4-a716-446655440002",
    employee_id: "EMP002",
    name: "Mary Johnson",
    role: "Quality Inspector",
    shift: "Shift 1",
    plant_id: "550e8400-e29b-41d4-a716-446655440001",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const mockFiveSData: FiveSAudit[] = [
  {
    id: "1",
    plant_id: "550e8400-e29b-41d4-a716-446655440001",
    line_id: "660e8400-e29b-41d4-a716-446655440001",
    audit_date: new Date().toISOString().split("T")[0],
    auditor_id: "880e8400-e29b-41d4-a716-446655440002",
    sort_score: 85,
    set_in_order_score: 78,
    shine_score: 92,
    standardize_score: 88,
    sustain_score: 75,
    overall_score: 83.6,
    comments: "Good progress on shine, need to improve sustain practices",
    photos: null,
    created_at: new Date().toISOString(),
  },
]

const mockProductionData: ProductionData[] = [
  {
    id: "1",
    plant_id: "550e8400-e29b-41d4-a716-446655440001",
    line_id: "660e8400-e29b-41d4-a716-446655440001",
    product_id: "770e8400-e29b-41d4-a716-446655440001",
    shift: "Shift 1",
    production_date: new Date().toISOString().split("T")[0],
    hour_of_day: 1,
    planned_production: 100,
    actual_production: 95,
    good_units: 90,
    rejected_units: 5,
    downtime_minutes: 15,
    downtime_reason: "Material shortage",
    operator_id: "880e8400-e29b-41d4-a716-446655440001",
    created_at: new Date().toISOString(),
  },
]

const mockQualityData: QualityInspection[] = [
  {
    id: "1",
    plant_id: "550e8400-e29b-41d4-a716-446655440001",
    line_id: "660e8400-e29b-41d4-a716-446655440001",
    product_id: "770e8400-e29b-41d4-a716-446655440001",
    batch_number: "BATCH001",
    inspection_date: new Date().toISOString().split("T")[0],
    inspector_id: "880e8400-e29b-41d4-a716-446655440002",
    inspected_quantity: 100,
    passed_quantity: 94,
    failed_quantity: 6,
    yield_percent: 94.0,
    defect_category: "Dimensional",
    comments: "Minor dimensional variations detected",
    created_at: new Date().toISOString(),
  },
]

const mockKaizenData: KaizenIdea[] = [
  {
    id: "1",
    title: "Reduce Changeover Time",
    description: "Current changeover takes 45 minutes, causing production delays",
    category: "productivity",
    priority: "high",
    current_state: "Manual changeover process with multiple adjustments",
    proposed_solution: "Implement quick-change tooling and standardized setup procedures",
    expected_benefit: "Reduce changeover time to 20 minutes",
    estimated_savings: 15000.0,
    submitter_id: "880e8400-e29b-41d4-a716-446655440001",
    status: "approved",
    implementation_date: "",
    actual_savings: 12000.0,
    plant_id: "550e8400-e29b-41d4-a716-446655440001",
    line_id: "660e8400-e29b-41d4-a716-446655440001",
    attachments: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Check if we're using mock data
const isUsingMockData = () => {
  return (
    !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "https://placeholder.supabase.co"
  )
}

export function useManufacturingData() {
  const [plants, setPlants] = useState<Plant[]>([])
  const [productionLines, setProductionLines] = useState<ProductionLine[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMasterData()
  }, [])

  const fetchMasterData = async () => {
    try {
      setLoading(true)

      if (isUsingMockData()) {
        // Use mock data
        setTimeout(() => {
          setPlants(mockPlants)
          setProductionLines(mockProductionLines)
          setProducts(mockProducts)
          setEmployees(mockEmployees)
          setLoading(false)
        }, 500) // Simulate loading time
        return
      }

      const [plantsResult, linesResult, productsResult, employeesResult] = await Promise.all([
        supabase.from("plants").select("*"),
        supabase.from("production_lines").select("*"),
        supabase.from("products").select("*"),
        supabase.from("employees").select("*"),
      ])

      if (plantsResult.error) throw plantsResult.error
      if (linesResult.error) throw linesResult.error
      if (productsResult.error) throw productsResult.error
      if (employeesResult.error) throw employeesResult.error

      setPlants(plantsResult.data || [])
      setProductionLines(linesResult.data || [])
      setProducts(productsResult.data || [])
      setEmployees(employeesResult.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return {
    plants,
    productionLines,
    products,
    employees,
    loading,
    error,
    refetch: fetchMasterData,
  }
}

export function useFiveSData(plantId?: string, lineId?: string) {
  const [data, setData] = useState<FiveSAudit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFiveSData()
  }, [plantId, lineId])

  const fetchFiveSData = async () => {
    try {
      setLoading(true)

      if (isUsingMockData()) {
        setTimeout(() => {
          setData(mockFiveSData)
          setLoading(false)
        }, 300)
        return
      }

      let query = supabase
        .from("five_s_audits")
        .select(`
          *,
          auditor:employees(name),
          line:production_lines(name)
        `)
        .order("audit_date", { ascending: false })

      if (plantId) query = query.eq("plant_id", plantId)
      if (lineId) query = query.eq("line_id", lineId)

      const { data: result, error } = await query

      if (error) throw error
      setData(result || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const submitFiveSAudit = async (auditData: Omit<FiveSAudit, "id" | "overall_score" | "created_at">) => {
    try {
      if (isUsingMockData()) {
        // Simulate successful submission
        const newAudit = {
          ...auditData,
          id: Date.now().toString(),
          overall_score:
            (auditData.sort_score +
              auditData.set_in_order_score +
              auditData.shine_score +
              auditData.standardize_score +
              auditData.sustain_score) /
            5,
          created_at: new Date().toISOString(),
        }
        setData((prev) => [newAudit, ...prev])
        return { success: true }
      }

      const { error } = await supabase.from("five_s_audits").insert([auditData])

      if (error) throw error
      await fetchFiveSData()
      return { success: true }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "An error occurred" }
    }
  }

  return {
    data,
    loading,
    error,
    refetch: fetchFiveSData,
    submitAudit: submitFiveSAudit,
  }
}

export function useProductionData(plantId?: string, lineId?: string, dateRange?: { from: string; to: string }) {
  const [data, setData] = useState<ProductionData[]>([])
  const [oeeData, setOeeData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProductionData()
  }, [plantId, lineId, dateRange])

  const fetchProductionData = async () => {
    try {
      setLoading(true)

      if (isUsingMockData()) {
        setTimeout(() => {
          setData(mockProductionData)
          const oeeCalculations = calculateOEE(mockProductionData)
          setOeeData(oeeCalculations)
          setLoading(false)
        }, 300)
        return
      }

      let query = supabase
        .from("production_data")
        .select(`
          *,
          product:products(name, sku),
          operator:employees(name),
          line:production_lines(name)
        `)
        .order("production_date", { ascending: false })
        .order("hour_of_day", { ascending: false })

      if (plantId) query = query.eq("plant_id", plantId)
      if (lineId) query = query.eq("line_id", lineId)
      if (dateRange) {
        query = query.gte("production_date", dateRange.from).lte("production_date", dateRange.to)
      }

      const { data: result, error } = await query.limit(100)

      if (error) throw error
      setData(result || [])

      const oeeCalculations = calculateOEE(result || [])
      setOeeData(oeeCalculations)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const calculateOEE = (productionData: ProductionData[]) => {
    const shiftData = productionData.reduce((acc, record) => {
      const key = `${record.shift}-${record.production_date}`
      if (!acc[key]) {
        acc[key] = {
          shift: record.shift,
          date: record.production_date,
          totalPlanned: 0,
          totalActual: 0,
          totalGood: 0,
          totalDowntime: 0,
          records: [],
        }
      }
      acc[key].totalPlanned += record.planned_production || 0
      acc[key].totalActual += record.actual_production || 0
      acc[key].totalGood += record.good_units || 0
      acc[key].totalDowntime += record.downtime_minutes || 0
      acc[key].records.push(record)
      return acc
    }, {} as any)

    return Object.values(shiftData).map((shift: any) => {
      const availability = shift.totalDowntime > 0 ? ((480 - shift.totalDowntime) / 480) * 100 : 100
      const performance = shift.totalPlanned > 0 ? (shift.totalActual / shift.totalPlanned) * 100 : 0
      const quality = shift.totalActual > 0 ? (shift.totalGood / shift.totalActual) * 100 : 0
      const oee = (availability * performance * quality) / 10000

      return {
        shift: shift.shift,
        date: shift.date,
        availability: Math.round(availability * 100) / 100,
        performance: Math.round(performance * 100) / 100,
        quality: Math.round(quality * 100) / 100,
        oee: Math.round(oee * 100) / 100,
      }
    })
  }

  const submitProductionData = async (productionData: Omit<ProductionData, "id" | "created_at">) => {
    try {
      if (isUsingMockData()) {
        const newData = {
          ...productionData,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
        }
        setData((prev) => [newData, ...prev])
        return { success: true }
      }

      const { error } = await supabase.from("production_data").insert([productionData])

      if (error) throw error
      await fetchProductionData()
      return { success: true }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "An error occurred" }
    }
  }

  return {
    data,
    oeeData,
    loading,
    error,
    refetch: fetchProductionData,
    submitData: submitProductionData,
  }
}

export function useQualityData(plantId?: string, lineId?: string) {
  const [data, setData] = useState<QualityInspection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchQualityData()
  }, [plantId, lineId])

  const fetchQualityData = async () => {
    try {
      setLoading(true)

      if (isUsingMockData()) {
        setTimeout(() => {
          setData(mockQualityData)
          setLoading(false)
        }, 300)
        return
      }

      let query = supabase
        .from("quality_inspections")
        .select(`
          *,
          product:products(name, sku, target_yield),
          inspector:employees(name),
          line:production_lines(name)
        `)
        .order("inspection_date", { ascending: false })

      if (plantId) query = query.eq("plant_id", plantId)
      if (lineId) query = query.eq("line_id", lineId)

      const { data: result, error } = await query

      if (error) throw error
      setData(result || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const submitQualityInspection = async (
    inspectionData: Omit<QualityInspection, "id" | "yield_percent" | "created_at">,
  ) => {
    try {
      if (isUsingMockData()) {
        const newInspection = {
          ...inspectionData,
          id: Date.now().toString(),
          yield_percent:
            inspectionData.inspected_quantity > 0
              ? (inspectionData.passed_quantity / inspectionData.inspected_quantity) * 100
              : 0,
          created_at: new Date().toISOString(),
        }
        setData((prev) => [newInspection, ...prev])
        return { success: true }
      }

      const { error } = await supabase.from("quality_inspections").insert([inspectionData])

      if (error) throw error
      await fetchQualityData()
      return { success: true }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "An error occurred" }
    }
  }

  return {
    data,
    loading,
    error,
    refetch: fetchQualityData,
    submitInspection: submitQualityInspection,
  }
}

export function useResourceData(plantId?: string, lineId?: string) {
  const [data, setData] = useState<ResourceConsumption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchResourceData()
  }, [plantId, lineId])

  const fetchResourceData = async () => {
    try {
      setLoading(true)

      if (isUsingMockData()) {
        setTimeout(() => {
          setData([])
          setLoading(false)
        }, 300)
        return
      }

      let query = supabase
        .from("resource_consumption")
        .select(`
          *,
          line:production_lines(name)
        `)
        .order("consumption_date", { ascending: false })

      if (plantId) query = query.eq("plant_id", plantId)
      if (lineId) query = query.eq("line_id", lineId)

      const { data: result, error } = await query

      if (error) throw error
      setData(result || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const submitResourceData = async (resourceData: Omit<ResourceConsumption, "id" | "total_cost" | "created_at">) => {
    try {
      if (isUsingMockData()) {
        return { success: true }
      }

      const { error } = await supabase.from("resource_consumption").insert([resourceData])

      if (error) throw error
      await fetchResourceData()
      return { success: true }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "An error occurred" }
    }
  }

  return {
    data,
    loading,
    error,
    refetch: fetchResourceData,
    submitData: submitResourceData,
  }
}

export function useKaizenData(plantId?: string, lineId?: string) {
  const [data, setData] = useState<KaizenIdea[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchKaizenData()
  }, [plantId, lineId])

  const fetchKaizenData = async () => {
    try {
      setLoading(true)

      if (isUsingMockData()) {
        setTimeout(() => {
          setData(mockKaizenData)
          setLoading(false)
        }, 300)
        return
      }

      let query = supabase
        .from("kaizen_ideas")
        .select(`
          *,
          submitter:employees(name),
          line:production_lines(name)
        `)
        .order("created_at", { ascending: false })

      if (plantId) query = query.eq("plant_id", plantId)
      if (lineId) query = query.eq("line_id", lineId)

      const { data: result, error } = await query

      if (error) throw error
      setData(result || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const submitKaizenIdea = async (kaizenData: Omit<KaizenIdea, "id" | "created_at" | "updated_at">) => {
    try {
      if (isUsingMockData()) {
        const newIdea = {
          ...kaizenData,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setData((prev) => [newIdea, ...prev])
        return { success: true }
      }

      const { error } = await supabase.from("kaizen_ideas").insert([kaizenData])

      if (error) throw error
      await fetchKaizenData()
      return { success: true }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "An error occurred" }
    }
  }

  return {
    data,
    loading,
    error,
    refetch: fetchKaizenData,
    submitIdea: submitKaizenIdea,
  }
}
