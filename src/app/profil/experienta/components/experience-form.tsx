'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { addExperience, updateExperience } from "../actions/experience-actions";
import { Experience } from "@prisma/client";

const experienceSchema = z.object({
  jobTitle: z.string().min(1, "Titlul jobului este obligatoriu"),
  company: z.string().min(1, "Numele companiei este obligatoriu"),
  startDate: z.string().min(1, "Data de început este obligatorie"),
  endDate: z.string().optional(),
  description: z.string().min(10, "Descrierea trebuie să aibă cel puțin 10 caractere"),
});

type ExperienceFormValues = z.infer<typeof experienceSchema>;

interface ExperienceFormProps {
  experience?: Experience;
  onClose?: () => void;
}

export function ExperienceForm({ experience, onClose }: ExperienceFormProps) {
  const [isOpen, setIsOpen] = useState(!experience);
  const { toast } = useToast();
  const isEditing = !!experience;

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      jobTitle: experience?.jobTitle || "",
      company: experience?.company || "",
      startDate: experience?.startDate ? new Date(experience.startDate).toISOString().split('T')[0] : "",
      endDate: experience?.endDate ? new Date(experience.endDate).toISOString().split('T')[0] : "",
      description: experience?.description || "",
    },
  });

  async function onSubmit(data: ExperienceFormValues) {
    try {
      if (isEditing && experience) {
        await updateExperience(experience.id, data);
        toast({
          title: "Experiență actualizată",
          description: "Experiența ta a fost actualizată cu succes.",
        });
      } else {
        await addExperience(data);
        toast({
          title: "Experiență adăugată",
          description: "Noua experiență a fost adăugată cu succes.",
        });
      }
      form.reset();
      setIsOpen(false);
      if (onClose) onClose();
    } catch (error) {
      toast({
        title: "Eroare",
        description: "A apărut o eroare la salvarea experienței.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>{isEditing ? "Editează experiența" : "Adaugă experiență"}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editează experiența" : "Adaugă experiență nouă"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titlu Job</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: Software Developer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Companie</FormLabel>
                  <FormControl>
                    <Input placeholder="Numele companiei" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de început</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de sfârșit (opțional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descriere</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descrie responsabilitățile și realizările tale" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{isEditing ? "Actualizează" : "Adaugă"}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}