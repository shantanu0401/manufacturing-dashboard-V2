-- Seed data for manufacturing platform

-- Insert sample plants
INSERT INTO public.plants (id, name, location, timezone) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Manufacturing Plant A', 'Detroit, MI', 'America/Detroit'),
('550e8400-e29b-41d4-a716-446655440002', 'Manufacturing Plant B', 'Austin, TX', 'America/Chicago');

-- Insert production lines
INSERT INTO public.production_lines (id, plant_id, name, capacity_per_hour, status) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Line A', 100, 'active'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Line B', 120, 'active'),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Line C', 150, 'active');

-- Insert products
INSERT INTO public.products (id, sku, name, category, unit_price, target_yield) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'SKU001', 'Product A', 'Electronics', 25.50, 95.0),
('770e8400-e29b-41d4-a716-446655440002', 'SKU002', 'Product B', 'Electronics', 32.75, 93.0),
('770e8400-e29b-41d4-a716-446655440003', 'SKU003', 'Product C', 'Automotive', 45.20, 96.0),
('770e8400-e29b-41d4-a716-446655440004', 'SKU004', 'Product D', 'Automotive', 28.90, 92.0);

-- Insert employees
INSERT INTO public.employees (id, employee_id, name, role, shift, plant_id) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'EMP001', 'John Smith', 'Operator', 'Shift 1', '550e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-446655440002', 'EMP002', 'Mary Johnson', 'Quality Inspector', 'Shift 1', '550e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-446655440003', 'EMP003', 'David Wilson', 'Supervisor', 'Shift 1', '550e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-446655440004', 'EMP004', 'Sarah Davis', 'Maintenance Tech', 'Shift 2', '550e8400-e29b-41d4-a716-446655440001');

-- Insert sample 5S audit data
INSERT INTO public.five_s_audits (plant_id, line_id, audit_date, auditor_id, sort_score, set_in_order_score, shine_score, standardize_score, sustain_score, comments) VALUES
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '7 days', '880e8400-e29b-41d4-a716-446655440003', 85, 78, 92, 88, 75, 'Good progress on shine, need to improve sustain practices'),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '14 days', '880e8400-e29b-41d4-a716-446655440003', 82, 75, 89, 85, 72, 'Consistent improvement needed in set in order'),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '21 days', '880e8400-e29b-41d4-a716-446655440003', 80, 73, 87, 83, 70, 'Focus on standardization processes');

-- Insert sample production data
INSERT INTO public.production_data (plant_id, line_id, product_id, shift, production_date, hour_of_day, planned_production, actual_production, good_units, rejected_units, downtime_minutes, downtime_reason, operator_id) VALUES
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'Shift 1', CURRENT_DATE, 1, 100, 95, 90, 5, 15, 'Material shortage', '880e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'Shift 1', CURRENT_DATE, 2, 100, 98, 94, 4, 8, 'Equipment adjustment', '880e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'Shift 1', CURRENT_DATE, 3, 100, 102, 98, 4, 0, NULL, '880e8400-e29b-41d4-a716-446655440001');

-- Insert sample quality inspection data
INSERT INTO public.quality_inspections (plant_id, line_id, product_id, batch_number, inspection_date, inspector_id, inspected_quantity, passed_quantity, failed_quantity, defect_category, comments) VALUES
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'BATCH001', CURRENT_DATE, '880e8400-e29b-41d4-a716-446655440002', 100, 94, 6, 'Dimensional', 'Minor dimensional variations detected'),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440002', 'BATCH002', CURRENT_DATE, '880e8400-e29b-41d4-a716-446655440002', 120, 110, 10, 'Surface Finish', 'Surface finish issues on 10 units');

-- Insert sample resource consumption data
INSERT INTO public.resource_consumption (plant_id, line_id, consumption_date, shift, labor_hours, labor_cost, power_kwh, power_cost, fuel_liters, fuel_cost, maintenance_cost) VALUES
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', CURRENT_DATE, 'Shift 1', 24.0, 1200.00, 450.5, 67.58, 25.3, 63.25, 150.00),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '1 day', 'Shift 1', 24.0, 1200.00, 465.2, 69.78, 27.1, 67.75, 200.00);

-- Insert sample Kaizen ideas
INSERT INTO public.kaizen_ideas (title, description, category, priority, current_state, proposed_solution, expected_benefit, estimated_savings, submitter_id, plant_id, line_id, status) VALUES
('Reduce Changeover Time', 'Current changeover takes 45 minutes, causing production delays', 'productivity', 'high', 'Manual changeover process with multiple adjustments', 'Implement quick-change tooling and standardized setup procedures', 'Reduce changeover time to 20 minutes', 15000.00, '880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'approved'),
('Improve Material Flow', 'Material handling creates bottlenecks in production', 'productivity', 'medium', 'Manual material transport between stations', 'Install conveyor system for automated material flow', 'Increase throughput by 15%', 25000.00, '880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'submitted');
