import { getRecentJobs, getJobStats, addEmailJob, retryFailedJob } from '../../utils/simpleJobs.js';
import { jobQueue } from '../../utils/jobQueue.js';

export const simpleJobResolvers = {
  Query: {
    getJobs: async (parent, { limit = 50 }, context) => {
      if (!context.user?.role?.includes('admin')) {
        throw new Error('Admin access required');
      }
      return await getRecentJobs(limit);
    },

    getJobStats: async (parent, args, context) => {
      if (!context.user?.role?.includes('admin')) {
        throw new Error('Admin access required');
      }
      return await getJobStats();
    }
  },

  Mutation: {
    addEmailJob: async (parent, { to, subject, html, text }, context) => {
      if (!context.user?.role?.includes('admin')) {
        throw new Error('Admin access required');
      }

      try {
        await jobQueue.enqueue('email', { to, subject, html, text });
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    retryJob: async (parent, { id }, context) => {
      if (!context.user?.role?.includes('admin')) {
        throw new Error('Admin access required');
      }

      try {
        await retryFailedJob(id);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  }
};