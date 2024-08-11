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
import { addProject, updateProject } from "../actions/project-actions";
import { Project } from "@prisma/client";

const projectSchema = z.object({
  title: z.string().min(1, "Titlul proiectului este obligatoriu"),
  description: z.string().min(10, "Descrierea trebuie să aibă cel puțin 10 caractere"),
  url: z.string().url("Introduceți o adresă URL validă").optional().or(z.literal('')),
  startDate: z.string().min(1, "Data de început este obligatorie"),
  endDate: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  project?: Project;
  onClose?: () => void;
}

export function ProjectForm({ project, onClose }: ProjectFormProps) {
  const [isOpen, setIsOpen] = useState(!project);
  const { toast } = useToast();
  const isEditing = !!project;

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      url: project?.url || "",
      startDate: project?.startDate ? new Date(project.startDate).toISOString().split('T')[0] : "",
      endDate: project?.endDate ? new Date(project.endDate).toISOString().split('T')[0] : "",
    },
  });

  async function onSubmit(data: ProjectFormValues) {
    try {
      if (isEditing && project) {
        await updateProject(project.id, data);
        toast({
          title: "Proiect actualizat",
          description: "Proiectul a fost actualizat cu succes.",
        });
      } else {
        await addProject(data);
        toast({
          title: "Proiect adăugat",
          description: "Noul proiect a fost adăugat cu succes.",
        });
      }
      form.reset();
      setIsOpen(false);
      if (onClose) onClose();
    } catch (error) {
      toast({
        title: "Eroare",
        description: "A apărut o eroare la salvarea proiectului.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>{isEditing ? "Editează proiectul" : "Adaugă proiect"}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editează proiectul" : "Adaugă proiect nou"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titlu proiect</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL (opțional)</FormLabel>
                  <FormControl>
                    <Input type="url" {...field} />
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
            <Button type="submit">{isEditing ? "Actualizează" : "Adaugă"}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}