import sql from '../middleware/db.js';
import { jobQueue } from './jobQueue.js';

// Create simple jobs table
export async function initJobsTable() {
  // Check if table exists first to avoid notices
  const tableExists = await sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_name = 'pw_jobs'
    )
  `;

  if (!tableExists[0].exists) {
    await sql`
      CREATE TABLE pw_jobs (
        id SERIAL PRIMARY KEY,
        job_type VARCHAR(255) NOT NULL,
        payload JSONB NOT NULL DEFAULT '{}',
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
        attempts INTEGER DEFAULT 0,
        result JSONB,
        error_message TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        started_at TIMESTAMP WITH TIME ZONE,
        completed_at TIMESTAMP WITH TIME ZONE,
        failed_at TIMESTAMP WITH TIME ZONE
      )
    `;

    await sql`
      CREATE INDEX idx_pw_jobs_status_created
      ON pw_jobs (status, created_at)
    `;

    console.log('Job system tables created');
  }
}

// Simple helper functions
export async function addEmailJob(to, subject, html, text = null) {
  return await sql`
    INSERT INTO pw_jobs (job_type, payload)
    VALUES ('email', ${JSON.stringify({ to, subject, html, text })})
    RETURNING id
  `;
}

// Queue email job (preferred method)
export async function queueEmailJob(to, subject, html, text = null, options = {}) {
  return await jobQueue.enqueue('email', { to, subject, html, text }, {
    priority: options.priority || 0,
    queue: 'email',
    ...options
  });
}

// Queue large file upload job
export async function queueFileUploadJob(filename, base64Data, fileType, fileSize, userId, options = {}) {
  return await jobQueue.enqueue('image-upload', {
    filename,
    base64Data,
    fileType,
    fileSize,
    userId
  }, {
    priority: fileType.startsWith('image/') ? 5 : 0,
    ...options
  });
}

export async function addCleanupJob(table, conditions) {
  return await sql`
    INSERT INTO pw_jobs (job_type, payload)
    VALUES ('cleanup', ${JSON.stringify({ table, conditions })})
    RETURNING id
  `;
}

export async function getJobStats() {
  return await sql`
    SELECT
      status,
      COUNT(*) as count,
      AVG(EXTRACT(EPOCH FROM (COALESCE(completed_at, failed_at) - created_at))) as avg_duration
    FROM pw_jobs
    WHERE created_at >= NOW() - INTERVAL '24 hours'
    GROUP BY status
    ORDER BY status
  `;
}

export async function getRecentJobs(limit = 50) {
  return await sql`
    SELECT *
    FROM pw_jobs
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
}

export async function retryFailedJob(jobId) {
  return await sql`
    UPDATE pw_jobs
    SET status = 'pending', attempts = 0, error_message = NULL
    WHERE id = ${jobId} AND status = 'failed'
  `;
}