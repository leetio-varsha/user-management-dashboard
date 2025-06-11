import { PageLayout } from '../components/PageLayout';
import { DataStateDisplay } from '../components/DataStateDisplay';
import { Table } from '../components/Table';
import { EngagementBadge } from '../components/EngagementBadge';
import { useStatsViewModel } from '../viewmodels/StatsViewModel';
import { type StatGroup } from '../interfaces/stats';

export default function StatsPage() {
  const { stats, isLoading, error, isEmpty } = useStatsViewModel();

  const columns = [
    {
      header: 'Gender',
      accessor: (group: StatGroup) => <span className="capitalize">{group._id.gender}</span>,
    },
    {
      header: 'Age Range',
      accessor: (group: StatGroup) => group._id.ageRange,
    },
    {
      header: 'Engagement Summary',
      accessor: (group: StatGroup) => (
        <>
          {group.engagementLevels.map((level, idx) => (
            <EngagementBadge key={idx} level={level.level} count={level.count} />
          ))}
        </>
      ),
    },
  ];

  return (
    <PageLayout title="User Engagement Statistics">
      <DataStateDisplay
        isLoading={isLoading}
        error={error}
        isEmpty={isEmpty}
        loadingMessage="Loading statistics..."
        emptyMessage="No statistics available"
      >
        <Table data={stats} columns={columns} keyExtractor={(_, index) => index.toString()} />
      </DataStateDisplay>
    </PageLayout>
  );
}
