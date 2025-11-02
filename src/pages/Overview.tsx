import { useEffect, useMemo, useState } from 'react';
import type { StatsResponse } from './api/stats';
import type { RunResponse, Worker } from './api/runs/[id]';
import { ArrowTopRightOnSquareIcon, BoltIcon, BeakerIcon, CommandLineIcon, PlayIcon, Squares2X2Icon, BookOpenIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

function Skeleton({ className }: { className?: string }) {
  return <div className={clsx('skeleton', className)} />;
}

function StatCard({ label, value, icon: Icon, loading }: { label: string; value?: number | string; icon: React.ElementType; loading?: boolean; }) {
  return (
    <div className="card">
      <div className="card-content">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{label}</p>
            {loading ? (
              <Skeleton className="h-7 w-16 mt-2" />
            ) : (
              <p className="text-2xl font-semibold text-slate-900 mt-2">{value}</p>
            )}
          </div>
          <div className="h-10 w-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Worker['status'] | RunResponse['status'] }) {
  const { color, text } = useMemo(() => {
    switch (status) {
      case 'completed':
      case 'done':
        return { color: 'bg-green-100 text-green-700 ring-green-600/20', text: 'Completed' };
      case 'running':
      case 'working':
        return { color: 'bg-blue-100 text-blue-700 ring-blue-600/20', text: 'Running' };
      case 'paused':
      case 'idle':
        return { color: 'bg-slate-100 text-slate-700 ring-slate-600/20', text: 'Idle' };
      case 'failed':
      case 'error':
        return { color: 'bg-red-100 text-red-700 ring-red-600/20', text: 'Error' };
      case 'blocked':
        return { color: 'bg-amber-100 text-amber-700 ring-amber-600/20', text: 'Blocked' };
      case 'pending':
        return { color: 'bg-violet-100 text-violet-700 ring-violet-600/20', text: 'Pending' };
      default:
        return { color: 'bg-slate-100 text-slate-700 ring-slate-600/20', text: String(status) };
    }
  }, [status]);

  return (
    <span className={clsx('inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset', color)}>
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" /> {text}
    </span>
  );
}

export default function Overview() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [run, setRun] = useState<RunResponse | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingRun, setLoadingRun] = useState(true);

  useEffect(() => {
    let active = true;
    setLoadingStats(true);
    fetch('/api/stats')
      .then((r) => r.json())
      .then((data: StatsResponse) => {
        if (!active) return;
        setStats(data);
        setLoadingStats(false);
        if (data.activeRunId) {
          setLoadingRun(true);
          fetch(`/api/runs/${encodeURIComponent(data.activeRunId)}`)
            .then((r) => r.json())
            .then((runData: RunResponse) => {
              if (!active) return;
              setRun(runData);
              setLoadingRun(false);
            })
            .catch(() => setLoadingRun(false));
        }
      })
      .catch(() => setLoadingStats(false));
    return () => {
      active = false;
    };
  }, []);

  const latestReports = useMemo(() => ([
    { title: 'Weekly Orchestration Summary', url: 'https://docs.example.com/weekly-summary', date: '2025-10-30' },
    { title: 'Agents Performance Report', url: 'https://docs.example.com/agents-performance', date: '2025-10-28' },
    { title: 'Failed Jobs Analysis', url: 'https://docs.example.com/failed-jobs', date: '2025-10-25' },
  ]), []);

  return (
    <main className="container-responsive py-8">
      {/* Hero */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">agents-main Dashboard</h1>
            <p className="mt-2 text-slate-600">Observe, orchestrate, and accelerate your autonomous agent workflows.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => console.log('Open Marketplace clicked')}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
            >
              <Squares2X2Icon className="h-5 w-5" /> Open Marketplace
            </button>
            <button
              onClick={() => console.log('Start Workflow clicked')}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
            >
              <PlayIcon className="h-5 w-5" /> Start Workflow
            </button>
          </div>
        </div>
      </section>

      {/* Top Stats */}
      <section className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Plugins" value={stats?.plugins} icon={BoltIcon} loading={loadingStats} />
        <StatCard label="Agents" value={stats?.agents} icon={BeakerIcon} loading={loadingStats} />
        <StatCard label="Skills" value={stats?.skills} icon={CommandLineIcon} loading={loadingStats} />
        <StatCard label="Orchestrators" value={stats?.orchestrators} icon={Squares2X2Icon} loading={loadingStats} />
      </section>

      {/* Two-column layout */}
      <section className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Left: Active Orchestration Plan */}
        <div className="md:col-span-3">
          <div className="card">
            <div className="card-header">
              <h2 className="text-base font-semibold text-slate-900">Active Orchestration Plan</h2>
              {loadingRun ? (
                <Skeleton className="h-6 w-20" />
              ) : run ? (
                <StatusBadge status={run.status} />
              ) : null}
            </div>
            <div className="card-content space-y-6">
              <div>
                <p className="text-sm text-slate-500">Plan</p>
                {loadingStats ? (
                  <Skeleton className="h-7 w-64 mt-1" />
                ) : (
                  <p className="text-lg font-medium mt-1">{stats?.activePlanName ?? 'None'}</p>
                )}
                <div className="mt-2 text-xs text-slate-500">
                  <span className="font-mono">Run ID: </span>
                  {loadingStats ? (
                    <Skeleton className="h-4 w-40 inline-block align-middle" />
                  ) : (
                    <span className="font-mono">{stats?.activeRunId ?? '-'}</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-700 mb-3">Workers</p>
                <div className="space-y-3">
                  {loadingRun && (
                    <>
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-3/4" />
                    </>
                  )}
                  {!loadingRun && run && run.workers.map((w) => (
                    <div key={w.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-600 font-semibold">
                          {w.label.slice(0,1)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{w.label}</p>
                          <p className="text-xs text-slate-500">ID: <span className="font-mono">{w.id}</span></p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {w.eta ? <span className="text-xs text-slate-500">ETA: {w.eta}</span> : null}
                        <StatusBadge status={w.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick Actions and Latest Reports */}
        <div className="md:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-base font-semibold text-slate-900">Quick Actions</h2>
            </div>
            <div className="card-content">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <QuickAction label="Agents" description="Manage and monitor agents" href="/agents" icon={BeakerIcon} />
                <QuickAction label="Skills" description="Browse and configure skills" href="/skills" icon={CommandLineIcon} />
                <QuickAction label="Orchestrators" description="Set up flows and routing" href="/orchestrators" icon={Squares2X2Icon} />
                <QuickAction label="Marketplace" description="Discover community plugins" href="/marketplace" icon={ArrowTopRightOnSquareIcon} />
              </div>
            </div>
          </div>

          {/* Latest Reports */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-base font-semibold text-slate-900">Latest Reports</h2>
              <a className="text-sm text-brand-700 hover:text-brand-800" href="#">View all</a>
            </div>
            <div className="card-content">
              <ul role="list" className="divide-y divide-slate-200">
                {latestReports.map((r) => (
                  <li key={r.title} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 bg-brand-50 text-brand-700 rounded-md flex items-center justify-center">
                        <BookOpenIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <a href={r.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-900 hover:underline">{r.title}</a>
                        <p className="text-xs text-slate-500">{r.date}</p>
                      </div>
                    </div>
                    <a href={r.url} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-700"><ArrowTopRightOnSquareIcon className="h-5 w-5" /></a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function QuickAction({ label, description, href, icon: Icon }: { label: string; description: string; href: string; icon: React.ElementType; }) {
  return (
    <a href={href} className="group flex items-start gap-3 rounded-lg border border-slate-200 p-3 hover:border-brand-300 hover:shadow-sm transition">
      <div className="h-10 w-10 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900 group-hover:text-brand-700">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </a>
  );
}
