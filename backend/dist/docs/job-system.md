# Job System

PhraseWorks includes a comprehensive background job system for handling asynchronous tasks like email sending, image processing, and scheduled operations.

## Overview

The job system provides:

- **Asynchronous Processing**: Non-blocking background task execution
- **Real-time Updates**: WebSocket integration for live job status notifications
- **Error Handling**: Robust error management and retry logic
- **Scheduling**: Cron-based job scheduling for recurring tasks
- **Monitoring**: Job status tracking and performance metrics

## Architecture

### Core Components

- **Job Queue**: In-memory job queue with database persistence
- **Job Processors**: Specialized handlers for different job types
- **Scheduler**: Cron-based job scheduling system
- **WebSocket Notifier**: Real-time job status updates
- **Error Handler**: Integrated error logging and retry logic

### Job Flow

```
Job Creation → Queue → Processor → Completion/Error → Notification
```

## Job Types

### Email Jobs

Handle email sending operations with retry logic and delivery tracking.

```javascript
// Creating an email job
const emailJob = {
  type: 'email',
  data: {
    to: 'user@example.com',
    subject: 'Welcome to PhraseWorks',
    template: 'welcome',
    variables: { userName: 'John Doe' }
  },
  priority: 'normal',
  maxRetries: 3
};

await addJob(emailJob);
```

### Image Processing Jobs

Handle image resizing, optimization, and format conversion.

```javascript
// Creating an image processing job
const imageJob = {
  type: 'image_process',
  data: {
    sourceUrl: 'https://example.com/image.jpg',
    operations: [
      { type: 'resize', width: 800, height: 600 },
      { type: 'optimize', quality: 85 },
      { type: 'format', format: 'webp' }
    ],
    outputPath: '/uploads/processed/image.webp'
  },
  priority: 'high'
};

await addJob(imageJob);
```

### Scheduled Jobs

Recurring tasks handled by the cron scheduler.

```javascript
// Scheduled cleanup job
const cleanupJob = {
  type: 'cleanup',
  schedule: '0 2 * * *', // Daily at 2 AM
  data: {
    action: 'remove_old_logs',
    olderThan: '30 days'
  }
};

await scheduleJob(cleanupJob);
```

## Job Management API

### Adding Jobs

```javascript
import { addJob } from '../utils/jobQueue.js';

// Add a job to the queue
const job = await addJob({
  type: 'email',
  data: { /* job data */ },
  priority: 'normal', // low, normal, high, urgent
  delay: 0, // milliseconds to delay execution
  maxRetries: 3,
  retryDelay: 5000 // milliseconds between retries
});

console.log(`Job ${job.id} added to queue`);
```

### Job Status Tracking

```javascript
import { getJobStatus, getJobHistory } from '../utils/jobQueue.js';

// Get current job status
const status = await getJobStatus(jobId);
console.log(status); // pending, processing, completed, failed

// Get job execution history
const history = await getJobHistory(jobId);
```

### Job Cancellation

```javascript
import { cancelJob } from '../utils/jobQueue.js';

// Cancel a pending job
const cancelled = await cancelJob(jobId);
if (cancelled) {
  console.log('Job cancelled successfully');
}
```

## Job Processors

### Creating Custom Processors

```javascript
// processors/customProcessor.js
import { handleError } from '../utils/errorHandler.js';

export const processCustomJob = async (jobData, jobId) => {
  try {
    console.log(`Processing custom job ${jobId}`);

    // Validate job data
    if (!jobData.requiredField) {
      throw new Error('Missing required field');
    }

    // Perform the actual work
    const result = await performCustomOperation(jobData);

    // Return success result
    return {
      success: true,
      result: result,
      message: 'Custom job completed successfully'
    };

  } catch (error) {
    // Log error with context
    await handleError(error, 'CustomJobProcessor.processCustomJob', {
      additionalData: { jobId, jobData }
    });

    // Return error result
    return {
      success: false,
      error: error.message,
      retryable: error.code !== 'FATAL_ERROR' // Determine if job should be retried
    };
  }
};

// Register the processor
import { registerProcessor } from '../utils/jobQueue.js';
registerProcessor('custom', processCustomJob);
```

### Built-in Processors

#### Email Processor
```javascript
export const processEmailJob = async (jobData, jobId) => {
  const { to, subject, template, variables } = jobData;

  try {
    const emailContent = await renderTemplate(template, variables);
    await sendEmail(to, subject, emailContent);

    return {
      success: true,
      message: `Email sent to ${to}`,
      deliveredAt: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      retryable: error.code !== 'INVALID_EMAIL'
    };
  }
};
```

#### Image Processing Processor
```javascript
export const processImageJob = async (jobData, jobId) => {
  const { sourceUrl, operations, outputPath } = jobData;

  try {
    let imageBuffer = await downloadImage(sourceUrl);

    for (const operation of operations) {
      imageBuffer = await applyImageOperation(imageBuffer, operation);
    }

    await saveImage(imageBuffer, outputPath);

    return {
      success: true,
      outputPath: outputPath,
      fileSize: imageBuffer.length
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      retryable: true
    };
  }
};
```

## Scheduling System

### Cron Job Configuration

```javascript
// utils/scheduler.js
import cron from 'node-cron';
import { addJob } from './jobQueue.js';

// Daily backup job
cron.schedule('0 1 * * *', async () => {
  await addJob({
    type: 'backup',
    data: { type: 'database', retention: '30 days' },
    priority: 'low'
  });
});

// Hourly cleanup job
cron.schedule('0 * * * *', async () => {
  await addJob({
    type: 'cleanup',
    data: { action: 'temp_files' },
    priority: 'normal'
  });
});

// Weekly report generation
cron.schedule('0 9 * * 1', async () => {
  await addJob({
    type: 'report',
    data: { type: 'weekly_analytics', recipients: ['admin@example.com'] },
    priority: 'normal'
  });
});
```

### Dynamic Scheduling

```javascript
import { scheduleJob, unscheduleJob } from '../utils/scheduler.js';

// Schedule a job dynamically
const scheduledJob = await scheduleJob({
  name: 'user_reminder',
  schedule: '0 9 * * *', // Daily at 9 AM
  jobData: {
    type: 'email',
    data: {
      template: 'daily_reminder',
      to: 'user@example.com'
    }
  }
});

// Later, unschedule the job
await unscheduleJob('user_reminder');
```

## Real-time Notifications

### WebSocket Integration

Jobs automatically broadcast status updates via WebSocket for real-time monitoring.

```javascript
// Frontend: Listening for job updates
import { initWebSocket } from '../Includes/WebSocketClient';

const handleJobUpdate = (message) => {
  if (message.type === 'job_update') {
    const { jobId, status, result } = message.data;
    updateJobUI(jobId, status, result);
  }
};

const ws = initWebSocket(tabId, handleJobUpdate);
```

### Job Event Types

- `job_started`: Job processing began
- `job_progress`: Job progress update (for long-running jobs)
- `job_completed`: Job finished successfully
- `job_failed`: Job failed with error
- `job_retry`: Job is being retried

## Monitoring & Performance

### Job Queue Metrics

```javascript
import { getQueueMetrics } from '../utils/jobQueue.js';

const metrics = await getQueueMetrics();
console.log({
  totalJobs: metrics.total,
  pendingJobs: metrics.pending,
  processingJobs: metrics.processing,
  completedJobs: metrics.completed,
  failedJobs: metrics.failed,
  averageProcessingTime: metrics.avgProcessingTime
});
```

### Performance Monitoring

```javascript
// Track job processing times
const startTime = Date.now();
const result = await processJob(job);
const processingTime = Date.now() - startTime;

await recordJobMetrics(job.id, {
  processingTime,
  memoryUsage: process.memoryUsage(),
  cpuUsage: process.cpuUsage()
});
```

## Error Handling & Retry Logic

### Automatic Retries

```javascript
const jobConfig = {
  type: 'email',
  data: { /* ... */ },
  maxRetries: 3,
  retryDelay: 5000, // 5 seconds
  retryBackoff: 'exponential' // linear, exponential, fixed
};
```

### Custom Retry Logic

```javascript
export const processJobWithCustomRetry = async (jobData, jobId, attempt) => {
  try {
    return await processJob(jobData);
  } catch (error) {
    // Custom retry decision logic
    if (error.code === 'RATE_LIMIT' && attempt < 5) {
      return {
        success: false,
        error: error.message,
        retryable: true,
        retryDelay: Math.pow(2, attempt) * 1000 // Exponential backoff
      };
    }

    return {
      success: false,
      error: error.message,
      retryable: false // Don't retry
    };
  }
};
```

## Best Practices

### 1. Job Data Validation

```javascript
const validateEmailJobData = (data) => {
  const required = ['to', 'subject', 'template'];
  for (const field of required) {
    if (!data[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  if (!isValidEmail(data.to)) {
    throw new Error('Invalid email address');
  }
};
```

### 2. Resource Management

```javascript
export const processImageJob = async (jobData, jobId) => {
  let tempFiles = [];

  try {
    // Track temporary resources
    const tempFile = await createTempFile();
    tempFiles.push(tempFile);

    // Process image...

  } catch (error) {
    throw error;
  } finally {
    // Always cleanup resources
    for (const file of tempFiles) {
      await fs.unlink(file).catch(() => {}); // Ignore cleanup errors
    }
  }
};
```

### 3. Progress Reporting

```javascript
export const processLargeDataJob = async (jobData, jobId) => {
  const items = jobData.items;
  const total = items.length;

  for (let i = 0; i < total; i++) {
    await processItem(items[i]);

    // Report progress every 10%
    if (i % Math.ceil(total / 10) === 0) {
      await updateJobProgress(jobId, {
        processed: i + 1,
        total: total,
        percentage: Math.round(((i + 1) / total) * 100)
      });
    }
  }
};
```

### 4. Job Prioritization

```javascript
// High priority for user-initiated actions
await addJob({
  type: 'image_process',
  data: uploadData,
  priority: 'high' // Processed first
});

// Low priority for maintenance tasks
await addJob({
  type: 'cleanup',
  data: cleanupData,
  priority: 'low' // Processed when queue is light
});
```

## Configuration

### Job Queue Settings

```javascript
// config/jobQueue.js
export const jobQueueConfig = {
  maxConcurrentJobs: 5,
  maxQueueSize: 1000,
  defaultRetries: 3,
  defaultRetryDelay: 5000,
  jobTimeout: 300000, // 5 minutes
  cleanupInterval: 3600000, // 1 hour
  retentionPeriod: 86400000 // 24 hours
};
```

### Processor Configuration

```javascript
// config/processors.js
export const processorConfig = {
  email: {
    timeout: 30000,
    maxRetries: 3,
    retryDelay: 5000
  },
  image_process: {
    timeout: 120000,
    maxRetries: 2,
    retryDelay: 10000
  },
  backup: {
    timeout: 600000,
    maxRetries: 1,
    retryDelay: 60000
  }
};
```

## Integration Examples

### Plugin Integration

```javascript
// In a plugin's backend index.js
export function init() {
  // Register custom job processor
  registerProcessor('plugin_task', async (jobData, jobId) => {
    try {
      const result = await performPluginTask(jobData);
      return { success: true, result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // Schedule recurring plugin tasks
  scheduleJob({
    name: 'plugin_maintenance',
    schedule: '0 3 * * *',
    jobData: {
      type: 'plugin_task',
      data: { action: 'maintenance' }
    }
  });
}
```

### Frontend Job Management

```jsx
import React, { useState, useEffect } from 'react';
import { addJob, getJobStatus } from '../API/JobAPI';

const FileUploadComponent = () => {
  const [jobStatus, setJobStatus] = useState(null);

  const handleFileUpload = async (file) => {
    try {
      // Create image processing job
      const job = await addJob({
        type: 'image_process',
        data: {
          file: file,
          operations: [
            { type: 'resize', width: 800 },
            { type: 'optimize', quality: 85 }
          ]
        }
      });

      // Monitor job progress
      setJobStatus({ id: job.id, status: 'pending' });

      // Poll for updates (or use WebSocket)
      const pollInterval = setInterval(async () => {
        const status = await getJobStatus(job.id);
        setJobStatus(status);

        if (status.status === 'completed' || status.status === 'failed') {
          clearInterval(pollInterval);
        }
      }, 1000);

    } catch (error) {
      console.error('Failed to create job:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => handleFileUpload(e.target.files[0])} />
      {jobStatus && (
        <div>
          Job Status: {jobStatus.status}
          {jobStatus.progress && (
            <div>Progress: {jobStatus.progress.percentage}%</div>
          )}
        </div>
      )}
    </div>
  );
};
```

The job system provides a robust foundation for handling background tasks in PhraseWorks, with comprehensive error handling, monitoring, and real-time updates.