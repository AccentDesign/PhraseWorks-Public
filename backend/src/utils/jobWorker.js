import { parentPort, workerData } from 'worker_threads';
import postgres from 'postgres';
import { sendEmail } from '../models/email.js';
import sharp from 'sharp';
import Media from '../models/media.js';

// Worker thread - job execution
const job = workerData;

async function executeJob() {
  try {
    // Create database connection for worker
    const sql = postgres(process.env.DATABASE_URL);
    let result;

    switch (job.type) {
      case 'email':
        result = await sendEmail(job.payload);
        break;

      case 'cleanup':
        const { table, conditions } = job.payload;
        result = await sql`DELETE FROM ${sql(table)} WHERE ${sql.unsafe(conditions)}`;
        break;

      case 'image-upload':
        const { filename, base64Data, fileType, fileSize, userId, connectionString } = job.payload;

        // Decode base64 and process with Sharp
        const buffer = Buffer.from(base64Data, 'base64');

        let width = null;
        let height = null;

        if (fileType.startsWith('image/')) {
          try {
            const metadata = await sharp(buffer).metadata();
            width = metadata.width;
            height = metadata.height;

            // Optional: Create thumbnails or optimize image
            const optimizedBuffer = await sharp(buffer)
              .jpeg({ quality: 85 })
              .toBuffer();

            // For now, we'll use the original buffer but could use optimizedBuffer
          } catch (err) {
            console.warn('Image processing failed, using original:', err.message);
          }
        }

        // Save to database using Media model
        const fileObj = {
          filename,
          data: base64Data,
          type: fileType,
          size: fileSize
        };

        result = await Media.uploadFile(filename, fileObj, sql, userId, width, height, process.env.S3_PUBLIC_URL);
        break;

      case 'image-process':
        // Legacy placeholder - use image-upload instead
        result = { processed: true, file: job.payload.filename };
        break;

      default:
        throw new Error(`Unknown job type: ${job.type}`);
    }

    await sql.end();
    parentPort.postMessage({ success: true, data: result });
  } catch (error) {
    parentPort.postMessage({ success: false, error: error.message });
  }
}

executeJob();