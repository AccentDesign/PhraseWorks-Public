import TitleBar from './CronEvents/TitleBar';
import { useContext, useEffect, useState } from 'react';
import { APIConnectorContext } from '../../../Contexts/APIConnectorContext';
import { APIGetCronTasks, APILogError, APIRunCronTaskInstantly } from '../../../API/APISystem';

const CronEventsPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [cronEvents, setCronEvents] = useState([]);
  const [reloadEvents, setReloadEvents] = useState(true);

  const [userTimeZone, setUserTimeZone] = useState('UTC'); // default UTC

  useEffect(() => {
    if (Intl && Intl.DateTimeFormat) {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) setUserTimeZone(tz);
    }
  }, []);

  const runTask = async (event) => {
    const data = await APIRunCronTaskInstantly(loginPassword, event.id);
    if (data.status == 200 && data.data.runCronTaskInstantly.success) {
      setReloadEvents(true);
    }
  };

  const getNextRunSimple = (cronExpr, lastRun) => {
    const logError = async (err) => {
      await APILogError(err.stack || String(err));
    };
    if (!lastRun) return null;
    const next = new Date(lastRun);

    const parts = cronExpr.trim().split(' ');
    if (parts.length !== 5) return null;

    const [min, hour, dayOfMonth, month, dayOfWeek] = parts;

    try {
      if (cronExpr === '* * * * *') {
        // Every minute
        next.setMinutes(next.getMinutes() + 1);
      } else if (
        /^\*\/\d+$/.test(min) &&
        hour === '*' &&
        dayOfMonth === '*' &&
        month === '*' &&
        dayOfWeek === '*'
      ) {
        // Every X minutes, e.g. */5 * * * *
        const interval = parseInt(min.split('/')[1], 10);
        next.setMinutes(next.getMinutes() + interval);
      } else if (
        min === '0' &&
        hour === '*' &&
        dayOfMonth === '*' &&
        month === '*' &&
        dayOfWeek === '*'
      ) {
        // Every hour at minute 0, e.g. 0 * * * *
        next.setHours(next.getHours() + 1, 0, 0, 0);
      } else if (
        /^\*\/\d+$/.test(hour) &&
        min === '0' &&
        dayOfMonth === '*' &&
        month === '*' &&
        dayOfWeek === '*'
      ) {
        // Every X hours at minute 0, e.g. 0 */2 * * *
        const interval = parseInt(hour.split('/')[1], 10);
        next.setHours(next.getHours() + interval, 0, 0, 0);
      } else if (
        min === '0' &&
        hour === '0' &&
        dayOfMonth === '*' &&
        month === '*' &&
        dayOfWeek === '*'
      ) {
        // Every day at midnight, e.g. 0 0 * * *
        next.setDate(next.getDate() + 1);
        next.setHours(0, 0, 0, 0);
      } else if (
        min !== '*' &&
        hour !== '*' &&
        dayOfMonth === '*' &&
        month === '*' &&
        dayOfWeek === '*'
      ) {
        // Specific time every day, e.g. 30 14 * * *
        next.setHours(parseInt(hour, 10), parseInt(min, 10), 0, 0);
        if (next <= new Date(lastRun)) {
          next.setDate(next.getDate() + 1);
        }
      } else {
        return null;
      }

      return next.toLocaleString('en-GB', {
        timeZone: userTimeZone,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch (err) {
      logError(err);
      return null;
    }
  };

  const fetchData = async () => {
    const data = await APIGetCronTasks(loginPassword);
    if (data.status == 200 && data.data.getCronTasks) {
      setCronEvents(JSON.parse(data.data.getCronTasks));
    }
  };

  useEffect(() => {
    if (reloadEvents == true) {
      fetchData();
      setReloadEvents(false);
    }
  }, [reloadEvents]);

  return (
    <>
      <div className="w-full">
        <TitleBar />
        <div className="panel mt-8 mt-8">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Function</th>
                <th>Cron Expression</th>
                <th>Next Run</th>
                <th>Last Run</th>
                <th>Enabled</th>
                <th>Run Once</th>
              </tr>
            </thead>
            <tbody>
              {cronEvents.map((event) => (
                <tr key={event.id}>
                  <td>{event.id}</td>
                  <td>
                    {event.name}
                    <p>
                      <button className="link-red-xs" onClick={() => runTask(event)}>
                        Run Event Instantly
                      </button>
                    </p>
                  </td>
                  <td>{event.function_name}</td>
                  <td>{event.cron_expression}</td>
                  <td>{getNextRunSimple(event.cron_expression, event.last_run_at)}</td>
                  <td>
                    {event.last_run_at
                      ? new Date(event.last_run_at).toLocaleString('en-GB', {
                          timeZone: userTimeZone,
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })
                      : 'Never'}
                  </td>
                  <td>{event.enabled ? 'Yes' : 'No'}</td>
                  <td>{event.run_once ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CronEventsPageContent;
