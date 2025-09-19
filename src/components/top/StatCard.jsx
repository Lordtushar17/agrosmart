import React from 'react';
import Card from '../common/Card';


export default function StatCard({ title, subtitle, children }) {
return (
<Card title={title} subtitle={subtitle}>
{children}
</Card>
);
}