'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import { JobType, ExperienceLevel } from '@prisma/client';

interface Filters {
  jobType: Partial<Record<JobType, boolean>>;
  experienceLevel: Partial<Record<ExperienceLevel, boolean>>;
}

export function JobSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState<Filters>({
    jobType: {},
    experienceLevel: {},
  });

  useEffect(() => {
    const jobTypes = searchParams.get('jobType')?.split(',') || [];
    const experienceLevels = searchParams.get('experienceLevel')?.split(',') || [];

    setFilters({
      jobType: Object.fromEntries(
        Object.values(JobType).map((type) => [type, jobTypes.includes(type)])
      ),
      experienceLevel: Object.fromEntries(
        Object.values(ExperienceLevel).map((level) => [level, experienceLevels.includes(level)])
      ),
    });
  }, [searchParams]);

  const handleJobTypeChange = (jobType: JobType) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      jobType: {
        ...prevFilters.jobType,
        [jobType]: !prevFilters.jobType[jobType],
      },
    }));
  };

  const handleExperienceLevelChange = (experienceLevel: ExperienceLevel) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      experienceLevel: {
        ...prevFilters.experienceLevel,
        [experienceLevel]: !prevFilters.experienceLevel[experienceLevel],
      },
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }

    Object.entries(filters).forEach(([filterType, filterValues]) => {
      const selectedFilters = Object.entries(filterValues)
        .filter(([_, isSelected]) => isSelected)
        .map(([key]) => key);

      if (selectedFilters.length > 0) {
        params.set(filterType, selectedFilters.join(','));
      } else {
        params.delete(filterType);
      }
    });

    router.push(`/joburi?${params.toString()}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Caută joburi</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Caută joburi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Caută
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Tip job</h3>
              <div className="space-y-2">
                {Object.values(JobType).map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`jobType-${type}`}
                      checked={filters.jobType[type] || false}
                      onCheckedChange={() => handleJobTypeChange(type)}
                    />
                    <Label htmlFor={`jobType-${type}`}>
                      {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase().replace('_', ' ')}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Nivel experiență</h3>
              <div className="space-y-2">
                {Object.values(ExperienceLevel).map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <Checkbox
                      id={`experienceLevel-${level}`}
                      checked={filters.experienceLevel[level] || false}
                      onCheckedChange={() => handleExperienceLevelChange(level)}
                    />
                    <Label htmlFor={`experienceLevel-${level}`}>
                      {level.charAt(0).toUpperCase() + level.slice(1).toLowerCase()}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}