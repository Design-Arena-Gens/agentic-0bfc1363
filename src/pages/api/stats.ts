import type { NextApiRequest, NextApiResponse } from 'next';

export type StatsResponse = {
  plugins: number;
  agents: number;
  skills: number;
  orchestrators: number;
  activePlanName: string;
  activeRunId: string;
};

const mockStats: StatsResponse = {
  plugins: 24,
  agents: 12,
  skills: 86,
  orchestrators: 4,
  activePlanName: 'Customer Onboarding v2',
  activeRunId: 'run_2025_11_02_001',
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<StatsResponse>
) {
  // Simple mock; in real usage this would query your backend
  res.status(200).json(mockStats);
}
