'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { JobType, ExperienceLevel } from '@prisma/client';

type JobTypeFilters = {
  [K in JobType]: boolean;
};

type ExperienceLevelFilters = {
  [K in ExperienceLevel]: boolean;
};

interface Filters {
  jobType: JobTypeFilters;
  experienceLevel: ExperienceLevelFilters;
  salary: {
    min: string;
    max: string;
  };
}

export function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialJobTypes = Object.values(JobType).reduce((acc, type) => {
    acc[type] = searchParams.get('jobType')?.includes(type) || false;
    return acc;
  }, {} as JobTypeFilters);

  const initialExperienceLevels = Object.values(ExperienceLevel).reduce((acc, level) => {
    acc[level] = searchParams.get('experienceLevel')?.includes(level) || false;
    return acc;
  }, {} as ExperienceLevelFilters);

  const [filters, setFilters] = useState<Filters>({
    jobType: initialJobTypes,
    experienceLevel: initialExperienceLevels,
    salary: {
      min: searchParams.get('minSalary') || '',
      max: searchParams.get('maxSalary') || '',
    },
  });

  const handleJobTypeFilterChange = (key: JobType) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      jobType: {
        ...prevFilters.jobType,
        [key]: !prevFilters.jobType[key],
      },
    }));
  };

  const handleExperienceLevelFilterChange = (key: ExperienceLevel) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      experienceLevel: {
        ...prevFilters.experienceLevel,
        [key]: !prevFilters.experienceLevel[key],
      },
    }));
  };

  const handleSalaryChange = (type: 'min' | 'max', value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      salary: {
        ...prevFilters.salary,
        [type]: value,
      },
    }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Job Type
    const selectedJobTypes = Object.entries(filters.jobType)
      .filter(([_, isSelected]) => isSelected)
      .map(([key]) => key);
    if (selectedJobTypes.length > 0) {
      params.set('jobType', selectedJobTypes.join(','));
    } else {
      params.delete('jobType');
    }

    // Experience Level
    const selectedExperienceLevels = Object.entries(filters.experienceLevel)
      .filter(([_, isSelected]) => isSelected)
      .map(([key]) => key);
    if (selectedExperienceLevels.length > 0) {
      params.set('experienceLevel', selectedExperienceLevels.join(','));
    } else {
      params.delete('experienceLevel');
    }

    // Salary
    if (filters.salary.min) params.set('minSalary', filters.salary.min);
    else params.delete('minSalary');
    if (filters.salary.max) params.set('maxSalary', filters.salary.max);
    else params.delete('maxSalary');

    router.push(`/joburi?${params.toString()}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtrează joburi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Tip job</h3>
            {Object.values(JobType).map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`jobType-${type}`}
                  checked={filters.jobType[type]}
                  onCheckedChange={() => handleJobTypeFilterChange(type)}
                />
                <Label htmlFor={`jobType-${type}`}>
                  {type.charAt(0) + type.slice(1).toLowerCase().replace('_', ' ')}
                </Label>
              </div>
            ))}
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Nivel experiență</h3>
            {Object.values(ExperienceLevel).map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <Checkbox
                  id={`experienceLevel-${level}`}
                  checked={filters.experienceLevel[level]}
                  onCheckedChange={() => handleExperienceLevelFilterChange(level)}
                />
                <Label htmlFor={`experienceLevel-${level}`}>
                  {level.charAt(0) + level.slice(1).toLowerCase()}
                </Label>
              </div>
            ))}
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Salariu (RON)</h3>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.salary.min}
                onChange={(e) => handleSalaryChange('min', e.target.value)}
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.salary.max}
                onChange={(e) => handleSalaryChange('max', e.target.value)}
              />
            </div>
          </div>
          
          <Button onClick={applyFilters} className="w-full">
            Aplică filtre
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}