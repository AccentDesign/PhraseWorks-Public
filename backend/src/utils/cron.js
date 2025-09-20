import sql from '../middleware/db.js';
import cron from 'node-cron';

export const scheduledJobs = new Map();

export const taskHandlers = {
  publishScheduledPosts: async () => {
    await sql`SET TIME ZONE 'Europe/London'`;
    const posts = await sql`SELECT * FROM pw_posts
        WHERE post_status = 'scheduled'
        AND post_date AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/London' < NOW() AT TIME ZONE 'Europe/London';`;
    if (posts.length > 0) {
      for (const post of posts) {
        await sql`
          UPDATE pw_posts
          SET post_status = 'publish'
          WHERE id = ${post.id}
        `;
      }
    }
  },
};

function getNextRunSimple(cronExpr, lastRun) {
  if (!lastRun) return null;
  const next = new Date(lastRun);

  const parts = cronExpr.trim().split(' ');
  if (parts.length !== 5) return null;

  const [min, hour, dayOfMonth, month, dayOfWeek] = parts;

  try {
    if (cronExpr === '* * * * *') {
      next.setMinutes(next.getMinutes() + 1);
    } else if (
      /^\*\/\d+$/.test(min) &&
      hour === '*' &&
      dayOfMonth === '*' &&
      month === '*' &&
      dayOfWeek === '*'
    ) {
      const interval = parseInt(min.split('/')[1], 10);
      next.setMinutes(next.getMinutes() + interval);
    } else if (
      min === '0' &&
      hour === '*' &&
      dayOfMonth === '*' &&
      month === '*' &&
      dayOfWeek === '*'
    ) {
      next.setHours(next.getHours() + 1, 0, 0, 0);
    } else if (
      /^\*\/\d+$/.test(hour) &&
      min === '0' &&
      dayOfMonth === '*' &&
      month === '*' &&
      dayOfWeek === '*'
    ) {
      const interval = parseInt(hour.split('/')[1], 10);
      next.setHours(next.getHours() + interval, 0, 0, 0);
    } else if (
      min === '0' &&
      hour === '0' &&
      dayOfMonth === '*' &&
      month === '*' &&
      dayOfWeek === '*'
    ) {
      next.setDate(next.getDate() + 1);
      next.setHours(0, 0, 0, 0);
    } else if (
      min !== '*' &&
      hour !== '*' &&
      dayOfMonth === '*' &&
      month === '*' &&
      dayOfWeek === '*'
    ) {
      next.setHours(parseInt(hour, 10), parseInt(min, 10), 0, 0);
      if (next <= new Date(lastRun)) {
        next.setDate(next.getDate() + 1);
      }
    } else {
      return null;
    }
    return next;
  } catch {
    return null;
  }
}

export async function loadCronJobs() {
  const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'pw_options'
      )
    `;
  if (!tableExists[0].exists) {
    console.warn('Table pw_options does not exist yet. Skipping cron load.');
    return;
  }

  const tasksDb = await sql`SELECT * FROM pw_options WHERE option_name = '_cron_tasks'`;
  let tasks = JSON.parse(tasksDb[0].option_value);

  let updateScheduled = false;
  let updateTimeout;

  function scheduleDbUpdate() {
    if (updateScheduled) return;
    updateScheduled = true;
    updateTimeout = setTimeout(async () => {
      try {
        await sql`
          UPDATE pw_options
          SET option_value = ${JSON.stringify(tasks)}
          WHERE option_name = '_cron_tasks'
        `;
        updateScheduled = false;
      } catch (e) {
        console.error('Error updating cron tasks in DB:', e);
        updateScheduled = false;
      }
    }, 500);
  }

  tasks.forEach((task) => {
    if (!task.enabled) return;
    if (!cron.validate(task.cron_expression)) {
      console.warn(`Invalid cron expression for task ${task.name}`);
      return;
    }

    const job = cron.schedule(task.cron_expression, async () => {
      try {
        const handler = taskHandlers[task.function_name];
        if (handler) {
          await handler();
          task.last_run_at = new Date().toISOString();
          if (task.run_once) task.enabled = false;
          scheduleDbUpdate();
        } else {
          console.warn(`No handler for function: ${task.function_name}`);
        }
      } catch (e) {
        console.error(`Error running task ${task.name}:`, e);
      }
    });

    scheduledJobs.set(task.id, job);
  });

  for (const task of tasks) {
    if (!task.enabled) continue;

    const nextRun = getNextRunSimple(task.cron_expression, task.last_run_at);
    if (!nextRun) continue;

    if (new Date() > nextRun) {
      const handler = taskHandlers[task.function_name];
      if (handler) {
        try {
          await handler();
          task.last_run_at = new Date().toISOString();
          if (task.run_once) task.enabled = false;
          scheduleDbUpdate();
        } catch (e) {
          console.error(`Error running overdue task ${task.name}:`, e);
        }
      }
    }
  }
}
