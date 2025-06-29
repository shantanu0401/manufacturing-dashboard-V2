import { createClient } from "@supabase/supabase-js"

// Use placeholder values for demo purposes when environment variables are not available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"

// Create a mock client when environment variables are not properly configured
const createSupabaseClient = () => {
  if (supabaseUrl === "https://placeholder.supabase.co" || supabaseAnonKey === "placeholder-key") {
    // Return a mock client for demo purposes
    return {
      from: (table: string) => ({
        select: (columns?: string) => ({
          eq: (column: string, value: any) => ({
            order: (column: string, options?: any) => ({
              limit: (count: number) => Promise.resolve({ data: [], error: null }),
            }),
            limit: (count: number) => Promise.resolve({ data: [], error: null }),
          }),
          order: (column: string, options?: any) => ({
            eq: (column: string, value: any) => ({
              limit: (count: number) => Promise.resolve({ data: [], error: null }),
            }),
            limit: (count: number) => Promise.resolve({ data: [], error: null }),
          }),
          limit: (count: number) => Promise.resolve({ data: [], error: null }),
          gte: (column: string, value: any) => ({
            lte: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
          }),
          lte: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
        }),
        insert: (data: any) => Promise.resolve({ data: null, error: null }),
      }),
    } as any
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createSupabaseClient()

// Database types remain the same
export interface Plant {
  id: string
  name: string
  location: string
  timezone: string
  created_at: string
  updated_at: string
}

export interface ProductionLine {
  id: string
  plant_id: string
  name: string
  capacity_per_hour: number
  status: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  sku: string
  name: string
  category: string
  unit_price: number
  target_yield: number
  created_at: string
  updated_at: string
}

export interface Employee {
  id: string
  employee_id: string
  name: string
  role: string
  shift: string
  plant_id: string
  created_at: string
  updated_at: string
}

export interface FiveSAudit {
  id: string
  plant_id: string
  line_id: string
  audit_date: string
  auditor_id: string
  sort_score: number
  set_in_order_score: number
  shine_score: number
  standardize_score: number
  sustain_score: number
  overall_score: number
  comments: string
  photos: any
  created_at: string
}

export interface ProductionData {
  id: string
  plant_id: string
  line_id: string
  product_id: string
  shift: string
  production_date: string
  hour_of_day: number
  planned_production: number
  actual_production: number
  good_units: number
  rejected_units: number
  downtime_minutes: number
  downtime_reason: string
  operator_id: string
  created_at: string
}

export interface QualityInspection {
  id: string
  plant_id: string
  line_id: string
  product_id: string
  batch_number: string
  inspection_date: string
  inspector_id: string
  inspected_quantity: number
  passed_quantity: number
  failed_quantity: number
  yield_percent: number
  defect_category: string
  comments: string
  created_at: string
}

export interface ResourceConsumption {
  id: string
  plant_id: string
  line_id: string
  consumption_date: string
  shift: string
  labor_hours: number
  labor_cost: number
  power_kwh: number
  power_cost: number
  fuel_liters: number
  fuel_cost: number
  maintenance_cost: number
  other_costs: number
  total_cost: number
  created_at: string
}

export interface KaizenIdea {
  id: string
  title: string
  description: string
  category: string
  priority: string
  current_state: string
  proposed_solution: string
  expected_benefit: string
  estimated_savings: number
  submitter_id: string
  status: string
  implementation_date: string
  actual_savings: number
  plant_id: string
  line_id: string
  attachments: any
  created_at: string
  updated_at: string
}
