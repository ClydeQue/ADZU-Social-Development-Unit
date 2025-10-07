import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';

export default function DonutChart({ 
  completed = 0,
  inProgress = 0,
  pending = 0,
  size = 180,
  showPercentage = true 
}) {
  // Calculate total and percentage
  const total = completed + inProgress + pending;
  const completedPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Data for the chart with three segments
  const data = [
    { name: 'Completed', value: completed },
    { name: 'In Progress', value: inProgress },
    { name: 'Pending', value: pending }
  ];

  const COLORS = ['#4D49FC', '#818CF8', '#C7D2FE']; // Blue shades for completed, in progress, pending

  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={size * 0.3}
            outerRadius={size * 0.47}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <h4 
            className="font-bold leading-[1.235]" 
            style={{ 
              color: '#4D49FC',
              fontSize: `${size * 0.20}px` // Scale font size based on chart size
            }}
          >
            {completedPercentage}%
          </h4>
        </div>
      )}
    </div>
  );
}

DonutChart.propTypes = {
  completed: PropTypes.number,
  inProgress: PropTypes.number,
  pending: PropTypes.number,
  size: PropTypes.number,
  showPercentage: PropTypes.bool,
};
