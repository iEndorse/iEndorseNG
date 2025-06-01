import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AnalyticsBarChart = ({ data }:any) => {
  // Convert analytics data into the format needed for the bar chart
  const chartData: { name: keyof typeof colors; value: number }[] = data ? [
    { name: 'Views', value: data.totalViews },
    { name: 'Shares', value: data.totalShares },
    { name: 'Endorsements', value: data.totalEndorsements },
    { name: 'Promotions', value: data.totalPromotions }
  ] : [];

  // Custom colors for bars
  const colors = {
    'Views': '#3B82F6',      // Blue
    'Shares': '#10B981',     // Green
    'Endorsements': '#F59E0B', // Yellow/Orange
    'Promotions': '#EF4444'  // Red
  };

  if (!data) {
    return <div className="flex justify-center items-center h-60">Loading data...</div>;
  }

  return (
    <div className="w-full h-64">
      <h3 className="text-lg font-medium text-gray-700 mb-4">Campaign Performance</h3>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 5,
            left: 5,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={0} textAnchor="middle" />
          <YAxis />
          <Tooltip 
            formatter={(value) => [`${value}`, 'Count']}
          />
          <Bar 
            dataKey="value" 
            fill="#8884d8"
            radius={[4, 4, 0, 0]}
            barSize={60}
          >
            {chartData.map((entry, index) => (
              <Bar 
                key={`bar-${index}`} 
                dataKey="value" 
                fill={colors[entry.name]} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsBarChart;