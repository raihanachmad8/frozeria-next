import { Card, Space, Typography } from "antd";

interface StatCardProps {
  icon?: React.ReactNode;
  label: string;
  tone?: "teal" | "blue" | "amber" | "red";
  value: React.ReactNode;
}

export function StatCard({ icon, label, tone = "teal", value }: StatCardProps) {
  return (
    <Card>
      <div className="stat-card-content">
        <Space orientation="vertical" size={4}>
          <Typography.Text type="secondary">{label}</Typography.Text>
          <Typography.Title level={2}>{value}</Typography.Title>
        </Space>
        {icon ? <div className={`stat-icon stat-icon-${tone}`}>{icon}</div> : null}
      </div>
    </Card>
  );
}
