import type { NextApiRequest, NextApiResponse } from 'next';

export type Worker = {
  id: string;
  label: string;
  status: 'idle' | 'working' | 'blocked' | 'error' | 'done';
  eta?: string;
};

export type RunResponse = {
  id: string;
  status: 'pending' | 'running' | 'paused' | 'failed' | 'completed';
  startedAt: string;
  updatedAt: string;
  workers: Worker[];
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<RunResponse>
) {
  const { id } = req.query;

  // Generate deterministic mock data based on id for demo purposes
  const now = new Date();
  const startedAt = new Date(now.getTime() - 5 * 60 * 1000); // 5 minutes ago

  const workers: Worker[] = [
    { id: 'ingest', label: 'Data Ingestion', status: 'done' },
    { id: 'classify', label: 'Classification Agent', status: 'working', eta: '2m' },
    { id: 'enrich', label: 'Enrichment', status: 'idle' },
    { id: 'route', label: 'Routing Orchestrator', status: 'blocked', eta: 'waiting' },
    { id: 'qa', label: 'Quality Assurance', status: 'idle' },
  ];

  const response: RunResponse = {
    id: String(id),
    status: 'running',
    startedAt: startedAt.toISOString(),
    updatedAt: now.toISOString(),
    workers,
  };

  res.status(200).json(response);
}
