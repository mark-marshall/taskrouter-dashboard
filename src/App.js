/* eslint-disable no-undef */
import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Download the Node helper library from twilio.com/docs/node/install
// These consts are your accountSid and authToken from https://www.twilio.com/console

const App = () => {
  const [workspace, setWorkspace] = useState(null);
  const [workerList, setWorkerList] = useState([]);
  const [taskQueueStats, setTaskQueueStata] = useState([]);

  const getWorkspaceStatistics = async () => {
    workspace.workers.fetch(function (err, workerList) {
      if (err) {
        console.error(err);
      } else {
        workerList.data.sort((a, b) =>
          a.available === b.available ? 0 : b.available ? 1 : -1
        );
        setWorkerList(workerList);
      }
    });
    workspace.taskqueues.fetch(function (err, taskQueueList) {
      if (err) {
        console.error(err);
      } else {
        workspace.taskqueues.statistics.fetch({}, function (err, statistics) {
          if (err) {
            console.error(err);
          } else {
            let statisticsArr = Object.keys(statistics).map(
              (key) => statistics[key]
            );
            const enrichedStatisticsArr = statisticsArr.map((tqStat) => {
              let updatedTQStat = tqStat;
              const metaData = taskQueueList.data.filter(
                (tQD) => tQD.sid === tqStat.taskQueueSid
              );
              if (metaData.length) {
                updatedTQStat = {
                  ...updatedTQStat,
                  metaData: metaData[0],
                };
              }
              return updatedTQStat;
            });
            setTaskQueueStata(enrichedStatisticsArr);
          }
        });
      }
    });
  };

  const startInterval = () => {
    setInterval(function () {
      getWorkspaceStatistics();
    }, 3000);
  };

  const getWorkspace = async (token) => {
    const workspace = new Twilio.TaskRouter.Workspace(token);
    return workspace;
  };

  const getToken = async () => {
    const tokenUrl = '';
    const workerSid = '';
    const resWS = await axios.post(tokenUrl, {
      workerSid,
    });
    const token = resWS.data;
    return token;
  };

  const initWorkspace = async () => {
    const token = await getToken();
    const workspace = await getWorkspace(token);
    setWorkspace(workspace);
  };

  useEffect(() => {
    initWorkspace();
  }, []);

  useEffect(() => {
    if (workspace) {
      getWorkspaceStatistics();
      startInterval();
    }
  }, [workspace]);

  return (
    <div className="">
      <h2>Worker Availability</h2>
      <ul className="worker-list">
        {workerList.data ? (
          workerList.data.map((w) => (
            <li
              key={w.sid}
              className={`worker-container ${
                w.available ? 'available' : 'unavailable'
              }`}
            >
              <h3>{w.friendlyName}</h3>
              <div>Shift: {w.attributes.time}</div>
              <div>Skills: {w.attributes.skills}</div>
            </li>
          ))
        ) : (
          <></>
        )}
      </ul>
      <h2>Task Queues</h2>
      {taskQueueStats.length ? (
        <ul className="task-queue-list">
          {taskQueueStats.map((tQS) => (
            <li className="task-queue-container" key={tQS.sid}>
              {
                <>
                  <h3>{tQS.metaData.friendlyName}</h3>
                  <div>Wait time: {tQS.realtime.longestTaskWaitingAge}s</div>
                  <div>Total Calls: {tQS.realtime.totalTasks}</div>
                  <div>
                    Assigned Calls: {tQS.realtime.tasksByStatus.assigned}
                  </div>
                  <div>Waiting Calls: {tQS.realtime.tasksByStatus.pending}</div>
                </>
              }
            </li>
          ))}
        </ul>
      ) : (
        <></>
      )}
    </div>
  );
};

export default App;
