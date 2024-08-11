// src/app/profil/schimba-rol/components/change-role-form.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserRole } from '@prisma/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { changeUserRole } from '../../actions/change-user-role';

const formSchema = z.object({
  role: z.enum(['JOB_SEEKER', 'EMPLOYER']),
});

interface ChangeRoleFormProps {
  currentRole: UserRole;
}

export function ChangeRoleForm({ currentRole }: ChangeRoleFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: currentRole as any,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await changeUserRole(values.role as UserRole);
      if (result.success) {
        toast({
          title: "Rol schimbat cu succes",
          description: `Noul tău rol este: ${result.role === 'EMPLOYER' ? 'Angajator' : 'Căutător de job'}`,
        });
      }
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut schimba rolul. Te rugăm să încerci din nou.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schimbă Rolul Tău</CardTitle>
        <CardDescription>Alege dacă vrei să fii angajator sau căutător de job</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Rol</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="JOB_SEEKER" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Căutător de job
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="EMPLOYER" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Angajator
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    Selectează rolul pe care dorești să îl ai în aplicație.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Se procesează..." : "Schimbă Rolul"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}