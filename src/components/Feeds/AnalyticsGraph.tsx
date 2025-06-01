import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AnalyticsGraph = ({ data}: any) => {
  const [chartData, setChartData] = useState<any>([]);

  useEffect(() => {
    // Simulate data over time (last 7 days)
    // In a real application, you would get this data from your API
    if (data) {
      const today = new Date();
      const timeData = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        // Create some sample data distribution based on totals
        // This is just for visualization purposes
        const totalViews = Math.floor(data.totalViews * (0.7 + (Math.random() * 0.6)));
        const totalShares = Math.floor(data.totalShares * (0.7 + (Math.random() * 0.6)));
        const totalEndorsements = Math.floor(data.totalEndorsements * (0.7 + (Math.random() * 0.6)));
        const totalPromotions = Math.floor(data.totalPromotions * (0.7 + (Math.random() * 0.6)));
        
        timeData.push({
          day,
          views: totalViews,
          shares: totalShares,
          endorsements: totalEndorsements,
          promotions: totalPromotions
        });
      }
      
      setChartData(timeData);
    }
  }, [data]);

  if (!data) {
    return <div className="flex justify-center items-center h-60">Loading data...</div>;
  }

  return (
    <div className="w-full h-60">
      <h3 className="text-lg font-medium text-gray-700 mb-4">Campaign Performance</h3>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 10,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} name="Views" />
          <Line type="monotone" dataKey="shares" stroke="#10B981" strokeWidth={2} name="Shares" />
          <Line type="monotone" dataKey="endorsements" stroke="#F59E0B" strokeWidth={2} name="Endorsements" />
          <Line type="monotone" dataKey="promotions" stroke="#EF4444" strokeWidth={2} name="Promotions" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsGraph;