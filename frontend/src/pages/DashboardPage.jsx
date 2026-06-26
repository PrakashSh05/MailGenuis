import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dashboardService from '../services/dashboardService';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import StatisticCard from '../components/features/dashboard/StatisticCard';
import ActivityTimeline from '../components/features/dashboard/ActivityTimeline';
import { 
  Mail, Star, Calendar, FileText, Plus, 
  Clock, Sparkles, MessageSquare 
} from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    statistics: [],
    activity: [],
    analytics: null
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Using Promise.all to fetch metrics concurrently
        const [summaryResponse, activityResponse] = await Promise.all([
          dashboardService.getDashboardSummary(),
          dashboardService.getDashboardActivity()
        ]);
        
        setData({
          statistics: summaryResponse.data?.statistics || [],
          analytics: summaryResponse.data?.analytics || null,
          activity: activityResponse.data || []
        });
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
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
    return Mail;
  };

  const getStatColor = (title) => {
    const lower = title.toLowerCase();
    if (lower.includes('today')) return { color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20' };
    if (lower.includes('favorite')) return { color: 'text-accent dark:text-accent', bg: 'bg-yellow-50 dark:bg-yellow-900/20' };
    if (lower.includes('template')) return { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' };
    return { color: 'text-brand-600 dark:text-brand-400', bg: 'bg-brand-50 dark:bg-brand-900/20' };
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader 
        title="Dashboard" 
        description="Overview of your email generation activity and usage."
        actions={
          <Button onClick={() => navigate('/generate')} icon={Plus}>
            New Email
          </Button>
        }
      />

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm mb-6">
          {error}
        </div>
      )}

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={`stat-skel-${i}`} className="p-5">
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-10 w-16" />
            </Card>
          ))
        ) : (
          data.statistics.map((stat, i) => {
            const colors = getStatColor(stat.title);
            return (
              <StatisticCard 
                key={i}
                title={stat.title}
                value={stat.value}
                trend={stat.trend}
                trendLabel={stat.trendLabel}
                icon={getStatIcon(stat.title)}
                colorClass={colors.color}
                bgClass={colors.bg}
              />
            );
          })
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Analytics & Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <h3 className="text-lg font-bold text-editorial-primary dark:text-editorial-primary mb-4">
              AI Preferences
            </h3>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : data.analytics ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-warm-secondary dark:bg-black/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-editorial-secondary" />
                    <span className="text-sm font-medium text-editorial-primary dark:text-editorial-secondary">Top Tone</span>
                  </div>
                  <span className="text-sm font-bold text-brand-600 dark:text-brand-400">
                    {data.analytics.mostUsedTone || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-warm-secondary dark:bg-black/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-editorial-secondary" />
                    <span className="text-sm font-medium text-editorial-primary dark:text-editorial-secondary">Top Language</span>
                  </div>
                  <span className="text-sm font-bold text-brand-600 dark:text-brand-400">
                    {data.analytics.mostUsedLanguage || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-warm-secondary dark:bg-black/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-editorial-secondary" />
                    <span className="text-sm font-medium text-editorial-primary dark:text-editorial-secondary">Favorite Template</span>
                  </div>
                  <span className="text-sm font-bold text-brand-600 dark:text-brand-400 truncate max-w-[120px]">
                    {data.analytics.mostUsedTemplate || 'None'}
                  </span>
                </div>
              </div>
            ) : (
              <EmptyState 
                icon={Sparkles} 
                title="No Data Yet" 
                description="Generate some emails to see your AI preferences." 
              />
            )}
          </Card>

          <Card>
            <h3 className="text-lg font-bold text-editorial-primary dark:text-editorial-primary mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/history')} icon={Clock}>
                History
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/templates')} icon={FileText}>
                Templates
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Activity Timeline */}
        <div className="lg:col-span-2">
          <Card className="h-full min-h-[400px]">
            <h3 className="text-lg font-bold text-editorial-primary dark:text-editorial-primary mb-6">
              Recent Activity
            </h3>
            {loading ? (
              <div className="space-y-6 ml-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : data.activity.length > 0 ? (
              <ActivityTimeline activities={data.activity} />
            ) : (
              <EmptyState 
                icon={Clock} 
                title="No Recent Activity" 
                description="Your recent actions will appear here." 
                action={{ label: 'Generate Email', onClick: () => navigate('/generate') }}
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
