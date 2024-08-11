'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { applyForJob } from '../actions/apply-for-job';

const applicationSchema = z.object({
  coverLetter: z.string().min(50, {
    message: 'Scrisoarea de intenție trebuie să aibă cel puțin 50 de caractere.',
  }),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

interface ApplyJobFormProps {
  jobId: string;
}

export function ApplyJobForm({ jobId }: ApplyJobFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const { toast } = useToast();

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      coverLetter: '',
    },
  });

  const onSubmit = async (data: ApplicationFormValues) => {
    if (hasApplied) {
      toast({
        title: 'Aplicare multiplă',
        description: 'Ai aplicat deja la acest job. Nu poți aplica de mai multe ori.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await applyForJob(jobId, data.coverLetter);
      toast({
        title: 'Aplicare cu succes',
        description: 'Aplicația ta a fost trimisă cu succes.',
      });
      form.reset();
      setHasApplied(true);
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'A apărut o eroare la trimiterea aplicației. Te rugăm să încerci din nou.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasApplied) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Aplicare trimisă</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Ai aplicat cu succes la acest job. Îți vom trimite un răspuns în curând.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aplică pentru acest job</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="coverLetter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scrisoare de intenție</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Scrie aici scrisoarea ta de intenție..."
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Se trimite...' : 'Trimite aplicația'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}