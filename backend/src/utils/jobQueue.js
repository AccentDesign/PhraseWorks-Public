import { Worker } from 'worker_threads';
import sql from '../middleware/db.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class SimpleJobQueue {
  constructor() {
    this.workers = [];
    this.maxWorkers = 4;
    this.jobQueue = [];
    this.isProcessing = false;
  }

  async enqueue(jobType, payload, options = {}) {
    const job = {
      id: Date.now() + Math.random(),
      type: jobType,
      payload,
      priority: options.priority || 0,
      attempts: 0,
      maxAttempts: options.maxAttempts || 3,
      createdAt: new Date()
    };

    // Save to database
    await sql`
      INSERT INTO pw_jobs (job_type, payload, status, created_at)
      VALUES (${jobType}, ${JSON.stringify(payload)}, 'pending', NOW())
    `;

    this.jobQueue.push(job);
    this.processQueue();
    return job;
  }

  async processQueue() {
    if (this.isProcessing || this.jobQueue.length === 0) return;

    this.isProcessing = true;

    while (this.jobQueue.length > 0 && this.workers.length < this.maxWorkers) {
      const job = this.jobQueue.shift();
      this.runJob(job);
    }

    this.isProcessing = false;
  }

  runJob(job) {
    const workerPath = join(__dirname, 'jobWorker.js');
    const worker = new Worker(workerPath, {
      workerData: job
    });

    this.workers.push(worker);

    worker.on('message', async (result) => {
      if (result.success) {
        await sql`
          UPDATE pw_jobs
          SET status = 'completed', result = ${JSON.stringify(result.data)}, completed_at = NOW()
          WHERE job_type = ${job.type} AND payload = ${JSON.stringify(job.payload)}
        `;
        console.log(`Job ${job.type} completed successfully`);
      } else {
        job.attempts++;
        if (job.attempts >= job.maxAttempts) {
          await sql`
            UPDATE pw_jobs
            SET status = 'failed', error_message = ${result.error}, failed_at = NOW()
            WHERE job_type = ${job.type} AND payload = ${JSON.stringify(job.payload)}
          `;
          console.error(`Job ${job.type} failed permanently:`, result.error);
        } else {
          // Retry job
          setTimeout(() => {
            this.jobQueue.push(job);
            this.processQueue();
          }, 1000 * job.attempts); // Exponential backoff
        }
      }
    });

    worker.on('error', async (error) => {
      console.error(`Worker error for job ${job.type}:`, error);
      await sql`
        UPDATE pw_jobs
        SET status = 'failed', error_message = ${error.message}, failed_at = NOW()
        WHERE job_type = ${job.type} AND payload = ${JSON.stringify(job.payload)}
      `;
    });

    worker.on('exit', (code) => {
      this.workers = this.workers.filter(w => w !== worker);
      this.processQueue(); // Process next job

      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
      }
    });
  }

  async getStats() {
    const stats = await sql`
      SELECT
        status,
        COUNT(*) as count,
        job_type
      FROM pw_jobs
      WHERE created_at >= NOW() - INTERVAL '24 hours'
      GROUP BY status, job_type
      ORDER BY job_type, status
    `;

    return {
      queueLength: this.jobQueue.length,
      activeWorkers: this.workers.length,
      stats
    };
  }
}

export const jobQueue = new SimpleJobQueue();