import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { JobType, ExperienceLevel } from '@prisma/client';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const search = searchParams.get('search') || undefined;
  const jobTypes = searchParams.get('jobType')?.split(',') as JobType[] | undefined;
  const experienceLevels = searchParams.get('experienceLevel')?.split(',') as ExperienceLevel[] | undefined;

  const skip = (page - 1) * limit;

  try {
    const jobs = await prisma.jobPosting.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { title: { contains: search, mode: 'insensitive' } },
                  { description: { contains: search, mode: 'insensitive' } },
                  { company: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {},
          jobTypes ? { jobType: { in: jobTypes } } : {},
          experienceLevels ? { experienceLevel: { in: experienceLevels } } : {},
        ],
      },
      take: limit,
      skip: skip,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}