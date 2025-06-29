-- Manufacturing Platform Database Schema

-- Master Data Tables
CREATE TABLE IF NOT EXISTS public.plants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(200),
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.production_lines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plant_id UUID REFERENCES public.plants(id),
    name VARCHAR(100) NOT NULL,
    capacity_per_hour INTEGER,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100),
    unit_price DECIMAL(10,2),
    target_yield DECIMAL(5,2) DEFAULT 95.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.employees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50),
    shift VARCHAR(20),
    plant_id UUID REFERENCES public.plants(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Back to Basics Module Tables
CREATE TABLE IF NOT EXISTS public.five_s_audits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plant_id UUID REFERENCES public.plants(id),
    line_id UUID REFERENCES public.production_lines(id),
    audit_date DATE NOT NULL,
    auditor_id UUID REFERENCES public.employees(id),
    sort_score INTEGER CHECK (sort_score >= 0 AND sort_score <= 100),
    set_in_order_score INTEGER CHECK (set_in_order_score >= 0 AND set_in_order_score <= 100),
    shine_score INTEGER CHECK (shine_score >= 0 AND shine_score <= 100),
    standardize_score INTEGER CHECK (standardize_score >= 0 AND standardize_score <= 100),
    sustain_score INTEGER CHECK (sustain_score >= 0 AND sustain_score <= 100),
    overall_score DECIMAL(5,2) GENERATED ALWAYS AS (
        (sort_score + set_in_order_score + shine_score + standardize_score + sustain_score) / 5.0
    ) STORED,
    comments TEXT,
    photos JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.kaizen_ideas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    priority VARCHAR(20) DEFAULT 'medium',
    current_state TEXT,
    proposed_solution TEXT,
    expected_benefit VARCHAR(200),
    estimated_savings DECIMAL(10,2),
    submitter_id UUID REFERENCES public.employees(id),
    status VARCHAR(30) DEFAULT 'submitted',
    implementation_date DATE,
    actual_savings DECIMAL(10,2),
    plant_id UUID REFERENCES public.plants(id),
    line_id UUID REFERENCES public.production_lines(id),
    attachments JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.abnormalities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plant_id UUID REFERENCES public.plants(id),
    line_id UUID REFERENCES public.production_lines(id),
    reported_by UUID REFERENCES public.employees(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    severity VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(30) DEFAULT 'open',
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    photos JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Productivity Module Tables
CREATE TABLE IF NOT EXISTS public.production_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plant_id UUID REFERENCES public.plants(id),
    line_id UUID REFERENCES public.production_lines(id),
    product_id UUID REFERENCES public.products(id),
    shift VARCHAR(20),
    production_date DATE NOT NULL,
    hour_of_day INTEGER CHECK (hour_of_day >= 1 AND hour_of_day <= 24),
    planned_production INTEGER,
    actual_production INTEGER,
    good_units INTEGER,
    rejected_units INTEGER,
    downtime_minutes INTEGER DEFAULT 0,
    downtime_reason VARCHAR(100),
    operator_id UUID REFERENCES public.employees(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.oee_calculations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plant_id UUID REFERENCES public.plants(id),
    line_id UUID REFERENCES public.production_lines(id),
    calculation_date DATE NOT NULL,
    shift VARCHAR(20),
    availability_percent DECIMAL(5,2),
    performance_percent DECIMAL(5,2),
    quality_percent DECIMAL(5,2),
    oee_percent DECIMAL(5,2) GENERATED ALWAYS AS (
        (availability_percent * performance_percent * quality_percent) / 10000.0
    ) STORED,
    total_downtime_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.maintenance_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    equipment_id VARCHAR(50) NOT NULL,
    plant_id UUID REFERENCES public.plants(id),
    line_id UUID REFERENCES public.production_lines(id),
    maintenance_type VARCHAR(30),
    priority VARCHAR(20),
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER GENERATED ALWAYS AS (
        EXTRACT(EPOCH FROM (end_time - start_time)) / 60
    ) STORED,
    technician_id UUID REFERENCES public.employees(id),
    work_description TEXT,
    parts_used TEXT,
    cost DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quality Module Tables
CREATE TABLE IF NOT EXISTS public.quality_inspections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plant_id UUID REFERENCES public.plants(id),
    line_id UUID REFERENCES public.production_lines(id),
    product_id UUID REFERENCES public.products(id),
    batch_number VARCHAR(50),
    inspection_date DATE NOT NULL,
    inspector_id UUID REFERENCES public.employees(id),
    inspected_quantity INTEGER,
    passed_quantity INTEGER,
    failed_quantity INTEGER,
    yield_percent DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE WHEN inspected_quantity > 0 
        THEN (passed_quantity::DECIMAL / inspected_quantity::DECIMAL) * 100 
        ELSE 0 END
    ) STORED,
    defect_category VARCHAR(50),
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.customer_complaints (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name VARCHAR(200),
    complaint_date DATE NOT NULL,
    product_id UUID REFERENCES public.products(id),
    issue_category VARCHAR(50),
    severity VARCHAR(20),
    description TEXT,
    estimated_cost DECIMAL(10,2),
    status VARCHAR(30) DEFAULT 'open',
    resolution_notes TEXT,
    resolved_date DATE,
    plant_id UUID REFERENCES public.plants(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resource Consumption Tables
CREATE TABLE IF NOT EXISTS public.resource_consumption (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plant_id UUID REFERENCES public.plants(id),
    line_id UUID REFERENCES public.production_lines(id),
    consumption_date DATE NOT NULL,
    shift VARCHAR(20),
    labor_hours DECIMAL(8,2),
    labor_cost DECIMAL(10,2),
    power_kwh DECIMAL(10,2),
    power_cost DECIMAL(10,2),
    fuel_liters DECIMAL(10,2),
    fuel_cost DECIMAL(10,2),
    maintenance_cost DECIMAL(10,2),
    other_costs DECIMAL(10,2),
    total_cost DECIMAL(10,2) GENERATED ALWAYS AS (
        COALESCE(labor_cost, 0) + COALESCE(power_cost, 0) + 
        COALESCE(fuel_cost, 0) + COALESCE(maintenance_cost, 0) + 
        COALESCE(other_costs, 0)
    ) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Safety Module Tables
CREATE TABLE IF NOT EXISTS public.safety_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plant_id UUID REFERENCES public.plants(id),
    line_id UUID REFERENCES public.production_lines(id),
    event_date DATE NOT NULL,
    event_type VARCHAR(50), -- 'near_miss', 'injury', 'ppe_violation'
    severity VARCHAR(20),
    description TEXT,
    injured_person_id UUID REFERENCES public.employees(id),
    reported_by UUID REFERENCES public.employees(id),
    immediate_action TEXT,
    root_cause TEXT,
    corrective_action TEXT,
    status VARCHAR(30) DEFAULT 'open',
    photos JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Environment Module Tables
CREATE TABLE IF NOT EXISTS public.environmental_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plant_id UUID REFERENCES public.plants(id),
    measurement_date DATE NOT NULL,
    scope1_emissions_kg DECIMAL(12,2), -- Direct emissions
    scope2_emissions_kg DECIMAL(12,2), -- Indirect emissions from electricity
    water_consumption_liters DECIMAL(12,2),
    waste_generated_kg DECIMAL(12,2),
    waste_recycled_kg DECIMAL(12,2),
    energy_consumption_kwh DECIMAL(12,2),
    renewable_energy_kwh DECIMAL(12,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- People & Culture Tables
CREATE TABLE IF NOT EXISTS public.employee_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id UUID REFERENCES public.employees(id),
    feedback_date DATE NOT NULL,
    morale_rating INTEGER CHECK (morale_rating >= 1 AND morale_rating <= 5),
    satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    feedback_text TEXT,
    suggestions TEXT,
    anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.training_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id UUID REFERENCES public.employees(id),
    training_name VARCHAR(200) NOT NULL,
    training_category VARCHAR(50),
    completion_date DATE,
    expiry_date DATE,
    score INTEGER,
    trainer VARCHAR(100),
    certification_number VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_production_data_date ON public.production_data(production_date);
CREATE INDEX IF NOT EXISTS idx_production_data_line ON public.production_data(line_id);
CREATE INDEX IF NOT EXISTS idx_five_s_audits_date ON public.five_s_audits(audit_date);
CREATE INDEX IF NOT EXISTS idx_quality_inspections_date ON public.quality_inspections(inspection_date);
CREATE INDEX IF NOT EXISTS idx_safety_events_date ON public.safety_events(event_date);
CREATE INDEX IF NOT EXISTS idx_resource_consumption_date ON public.resource_consumption(consumption_date);
