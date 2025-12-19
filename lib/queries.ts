import pool from './db';
import type {
  KPISummary,
  ProductionTrend,
  MachinePerformance,
  OperatorPerformance,
  QualityMetrics,
  MaterialEfficiency,
} from '@/types/database';

export async function getKPISummary(startDate?: string, endDate?: string, machineCode?: string): Promise<KPISummary> {
  let dateFilter = '';
  let machineFilter = '';
  const params: string[] = [];
  let paramIndex = 1;
  
  if (startDate && endDate) {
    dateFilter = `AND t.full_date >= $${paramIndex}::date AND t.full_date <= $${paramIndex + 1}::date`;
    params.push(startDate, endDate);
    paramIndex += 2;
  }
  
  if (machineCode && machineCode !== 'all') {
    machineFilter = `AND m.machine_code = $${paramIndex}`;
    params.push(machineCode);
  }
  
  const result = await pool.query(`
    SELECT 
      COUNT(DISTINCT m.machine_code) as total_machines,
      COUNT(DISTINCT a.article_code) as total_articles,
      COUNT(DISTINCT o.operator_name) as total_operators,
      COUNT(DISTINCT t.full_date) as active_days,
      SUM(fp.good_pieces) as total_production,
      SUM(fp.rejected_pieces) as total_rejected,
      ROUND(AVG(fp.good_rate), 2) as overall_quality_rate,
      ROUND(AVG(fp.material_efficiency), 2) as overall_material_efficiency
    FROM fact_production fp
    JOIN dim_time t ON fp.time_key = t.time_key
    JOIN dim_machine m ON fp.machine_key = m.machine_key
    LEFT JOIN dim_article a ON fp.article_key = a.article_key
    LEFT JOIN dim_operator o ON fp.operator_key = o.operator_key
    WHERE fp.event_category = 'Production'
      AND fp.good_pieces > 0
      ${dateFilter}
      ${machineFilter}
  `, params.length > 0 ? params : undefined);
  
  return result.rows[0] as KPISummary;
}

export async function getAllMachines(): Promise<{ machine_code: string; machine_name: string }[]> {
  const result = await pool.query(`
    SELECT DISTINCT machine_code, machine_name
    FROM dim_machine
    ORDER BY machine_code
  `);
  
  return result.rows as { machine_code: string; machine_name: string }[];
}

export async function getProductionTrend(startDate?: string, endDate?: string): Promise<ProductionTrend[]> {
  let dateFilter = '';
  const params: string[] = [];
  
  if (startDate && endDate) {
    dateFilter = 'AND t.full_date >= $1::date AND t.full_date <= $2::date';
    params.push(startDate, endDate);
  } else {
    // Default to last 30 days if no date range provided
    dateFilter = "AND t.full_date >= CURRENT_DATE - INTERVAL '30 days'";
  }
  
  const result = await pool.query(`
    SELECT 
      t.full_date,
      m.machine_code,
      SUM(fp.good_pieces) as daily_production,
      ROUND(AVG(fp.good_rate), 2) as avg_quality,
      COUNT(DISTINCT fp.operator_key) as active_operators,
      COUNT(*) as events
    FROM fact_production fp
    JOIN dim_time t ON fp.time_key = t.time_key
    JOIN dim_machine m ON fp.machine_key = m.machine_key
    WHERE fp.event_category = 'Production'
      ${dateFilter}
    GROUP BY t.full_date, m.machine_code
    ORDER BY t.full_date DESC, m.machine_code
  `, params.length > 0 ? params : undefined);
  
  return result.rows.map(row => ({
    ...row,
    full_date: new Date(row.full_date),
  })) as ProductionTrend[];
}

export async function getMachinePerformance(startDate?: string, endDate?: string): Promise<MachinePerformance[]> {
  let dateFilter = '';
  const params: string[] = [];
  
  if (startDate && endDate) {
    // Query fact table directly with date filter instead of view
    const result = await pool.query(`
      SELECT 
        m.machine_code,
        m.machine_name,
        m.machine_type,
        COUNT(DISTINCT t.full_date) as days_active,
        COUNT(*) as total_events,
        SUM(fp.requested_pieces) as total_requested,
        SUM(fp.good_pieces) as total_good,
        SUM(fp.rejected_pieces) as total_rejected,
        ROUND(AVG(fp.good_rate), 2) as avg_good_rate,
        ROUND(AVG(fp.material_efficiency), 2) as avg_material_efficiency,
        COUNT(DISTINCT fp.article_key) as unique_articles,
        COUNT(DISTINCT fp.operator_key) as unique_operators
      FROM fact_production fp
      JOIN dim_time t ON fp.time_key = t.time_key
      JOIN dim_machine m ON fp.machine_key = m.machine_key
      WHERE t.full_date >= $1::date AND t.full_date <= $2::date
      GROUP BY m.machine_code, m.machine_name, m.machine_type
      ORDER BY total_good DESC
    `, [startDate, endDate]);
    
    return result.rows as MachinePerformance[];
  }
  
  const result = await pool.query(`
    SELECT * FROM vw_machine_performance
    ORDER BY total_good DESC
  `);
  
  return result.rows as MachinePerformance[];
}

export async function getTopOperators(limit?: number): Promise<OperatorPerformance[]> {
  if (limit) {
    const result = await pool.query(`
      SELECT * FROM vw_operator_performance
      ORDER BY total_good_pieces DESC
      LIMIT $1
    `, [limit]);
    
    return result.rows as OperatorPerformance[];
  } else {
    // Return all operators if no limit specified
    const result = await pool.query(`
      SELECT * FROM vw_operator_performance
      ORDER BY total_good_pieces DESC
    `);
    
    return result.rows as OperatorPerformance[];
  }
}

export async function getQualityMetrics(startDate?: string, endDate?: string): Promise<QualityMetrics[]> {
  let dateFilter = '';
  const params: string[] = [];
  
  if (startDate && endDate) {
    dateFilter = 'AND full_date >= $1::date AND full_date <= $2::date';
    params.push(startDate, endDate);
  } else {
    // Default to last 30 days if no date range provided
    dateFilter = "AND full_date >= CURRENT_DATE - INTERVAL '30 days'";
  }
  
  const result = await pool.query(`
    SELECT * FROM vw_quality_metrics
    WHERE 1=1 ${dateFilter}
    ORDER BY full_date DESC, machine_code
  `, params.length > 0 ? params : undefined);
  
  return result.rows.map(row => ({
    ...row,
    full_date: new Date(row.full_date),
  })) as QualityMetrics[];
}

export async function getMaterialEfficiency(limit: number = 10): Promise<MaterialEfficiency[]> {
  const result = await pool.query(`
    SELECT * FROM vw_material_efficiency
    ORDER BY wire_efficiency ASC
    LIMIT $1
  `, [limit]);
  
  return result.rows as MaterialEfficiency[];
}

