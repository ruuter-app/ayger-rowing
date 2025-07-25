import React from 'react';
import { NavLink } from 'react-router-dom';
import { Card } from '../ui/card';
import { Upload, BarChart3, History, Calendar, Trophy } from 'lucide-react';
import { cn } from '../../lib/utils';

const athleteNavItems = [
  { to: '/athlete/upload', icon: Upload, label: 'Upload Session', description: 'Upload training data' },
  { to: '/athlete/dashboard', icon: BarChart3, label: 'Dashboard', description: 'Performance overview' },
  { to: '/athlete/sessions', icon: History, label: 'Session History', description: 'View past sessions' },
  { to: '/athlete/planned', icon: Calendar, label: 'Planned Workouts', description: 'Coach assignments' }
];

export function AthleteNavigation() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {athleteNavItems.map((item) => (
        <NavLink key={item.to} to={item.to} className="block">
          {({ isActive }) => (
            <Card className={cn(
              "p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border-2",
              isActive 
                ? "border-primary bg-primary/5 shadow-primary/20" 
                : "border-border hover:border-primary/50"
            )}>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={cn(
                  "p-3 rounded-full",
                  isActive ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{item.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                </div>
              </div>
            </Card>
          )}
        </NavLink>
      ))}
    </div>
  );
}