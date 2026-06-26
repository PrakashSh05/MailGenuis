import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dashboardService from '../services/dashboardService';
import profileService from '../services/profileService';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import StatisticCard from '../components/features/dashboard/StatisticCard';
import ActivityTimeline from '../components/features/dashboard/ActivityTimeline';
import {
  Mail, Star, Calendar, FileText, Plus,
  Clock, Sparkles, MessageSquare, Target
} from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    statistics: [],
    activity: [],
    analytics: null,
    profile: null
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Using Promise.all to fetch metrics concurrently
        const [summaryResponse, activityResponse, profileResponse] = await Promise.all([
          dashboardService.getDashboardSummary(),
          dashboardService.getDashboardActivity(),
          profileService.getProfile()
        ]);

        setData({
          statistics: summaryResponse.data?.statistics || [],
          analytics: summaryResponse.data?.analytics || null,
          activity: activityResponse.data || [],
          profile: profileResponse.data || null
        });
      } catch (err) {
        setError('Failed to initialize HUD data link. Retrying...');
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper to map dynamic stat labels to icons
  const getStatIcon = (title) => {
    const lower = title.toLowerCase();
    if (lower.includes('today')) return Calendar;
    if (lower.includes('favorite')) return Star;
    if (lower.includes('template')) return FileText;
    return Target;
  };

  const getStatColor = (title) => {
    // HUD Theme: everything is orange/neon variants
    const lower = title.toLowerCase();
    if (lower.includes('today')) return { color: 'text-brand', bg: 'bg-brand/10 border border-brand/30 shadow-[inset_0_0_15px_rgba(255,87,34,0.1)]' };
    if (lower.includes('favorite')) return { color: 'text-accent', bg: 'bg-accent/10 border border-accent/30 shadow-[inset_0_0_15px_rgba(230,81,0,0.1)]' };
    if (lower.includes('template')) return { color: 'text-gray-900 dark:text-white', bg: 'bg-black/5 dark:bg-white/5 border border-black/20 dark:border-white/20' };
    return { color: 'text-brand', bg: 'bg-brand/10 border border-brand/30 shadow-[inset_0_0_15px_rgba(255,87,34,0.1)]' };
  };

  return (
    <div className="max-w-7xl mx-auto w-full h-[calc(100vh-8rem)] flex flex-col relative gap-4 pb-4">
      <div className="shrink-0">
        <PageHeader
          title="Command Center"
          subtitle="System overview and usage telemetry."
          actions={
            <Button onClick={() => navigate('/generate')} icon={Plus} className="shadow-glow-orange">
              Initialize Generator
            </Button>
          }
        />

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm mb-4 flex items-center gap-3 font-mono">
            <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
            {error}
          </div>
        )}

        {/* Statistics Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={`stat-skel-${i}`} className="p-6 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-2xl">
                <Skeleton className="h-4 w-24 mb-4 bg-black/10 dark:bg-white/10" />
                <Skeleton className="h-10 w-16 bg-black/10 dark:bg-white/10" />
              </Card>
            ))
          ) : (
            data.statistics.map((stat, i) => {
              const colors = getStatColor(stat.title);
              return (
                <div key={i} className="relative group">
                  <div className="absolute inset-0 bg-brand/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
                  <StatisticCard
                    title={stat.title}
                    value={stat.value}
                    trend={stat.trend}
                    trendLabel={stat.trendLabel}
                    icon={getStatIcon(stat.title)}
                    colorClass={colors.color}
                    bgClass={colors.bg}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        {/* Left Column: Analytics & Quick Actions */}
        <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
          <Card className="shrink-0 flex flex-col bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-border hover:border-brand/50 transition-colors duration-500">
            <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-widest flex items-center gap-2 shrink-0">
              <Sparkles className="h-5 w-5 text-brand" /> System Preferences
            </h3>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full bg-black/5 dark:bg-white/5" />
                <Skeleton className="h-12 w-full bg-black/5 dark:bg-white/5" />
                <Skeleton className="h-12 w-full bg-black/5 dark:bg-white/5" />
              </div>
            ) : data.profile ? (
              <div className="space-y-3 font-mono">
                <div className="flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 rounded-xl hover:bg-brand/5 hover:border-brand/20 transition-colors shrink-0">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-4 w-4 text-text-secondary" />
                    <span className="text-xs text-text-secondary uppercase">Default Tone</span>
                  </div>
                  <span className="text-sm font-bold text-brand">
                    {data.profile.defaultTone || 'PROFESSIONAL'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 rounded-xl hover:bg-brand/5 hover:border-brand/20 transition-colors shrink-0">
                  <div className="flex items-center gap-3">
                    <Target className="h-4 w-4 text-text-secondary" />
                    <span className="text-xs text-text-secondary uppercase">Default Language</span>
                  </div>
                  <span className="text-sm font-bold text-brand">
                    {data.profile.defaultLanguage || 'ENGLISH'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 rounded-xl hover:bg-brand/5 hover:border-brand/20 transition-colors shrink-0">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-text-secondary" />
                    <span className="text-xs text-text-secondary uppercase">Default Length</span>
                  </div>
                  <span className="text-sm font-bold text-brand">
                    {data.profile.defaultEmailLength || 'MEDIUM'}
                  </span>
                </div>
              </div>
            ) : (
              <EmptyState
                icon={Sparkles}
                title="No Preferences"
                description="Configure in Settings."
              />
            )}
          </Card>

          <Card className="shrink-0 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-border">
            <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-widest flex items-center gap-2">
              <Target className="h-5 w-5 text-brand" /> Quick Protocols
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full justify-start border-black/10 dark:border-white/10 hover:border-brand hover:text-brand bg-transparent" onClick={() => navigate('/history')} icon={Clock}>
                Saved History
              </Button>
              <Button variant="outline" className="w-full justify-start border-black/10 dark:border-white/10 hover:border-brand hover:text-brand bg-transparent" onClick={() => navigate('/templates')} icon={FileText}>
                Presets
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Activity Timeline */}
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <Card className="flex-1 flex flex-col min-h-0 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-border hover:border-brand/30 transition-colors duration-500 relative overflow-hidden">
            {/* Grid overlay for HUD effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),dark:linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none opacity-50 z-0"></div>

            <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-widest relative z-10 flex items-center gap-2 shrink-0">
              <Clock className="h-5 w-5 text-brand" /> System Log
            </h3>

            <div className="relative z-10 overflow-y-auto custom-scrollbar flex-1 pr-2">
              {loading ? (
                <div className="space-y-4 ml-4">
                  <Skeleton className="h-16 w-full bg-black/5 dark:bg-white/5 rounded-xl" />
                  <Skeleton className="h-16 w-full bg-black/5 dark:bg-white/5 rounded-xl" />
                  <Skeleton className="h-16 w-full bg-black/5 dark:bg-white/5 rounded-xl" />
                </div>
              ) : data.activity.length > 0 ? (
                <ActivityTimeline activities={data.activity} />
              ) : (
                <EmptyState
                  icon={Clock}
                  title="Log Empty"
                  description="Awaiting user activity telemetry."
                  action={{ label: 'Execute Generator', onClick: () => navigate('/generate') }}
                />
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
