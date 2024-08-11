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
import { addEducation, updateEducation } from "../actions/education-actions";
import { Education } from "@prisma/client";

const educationSchema = z.object({
  institution: z.string().min(1, "Numele instituției este obligatoriu"),
  degree: z.string().min(1, "Tipul diplomei este obligatoriu"),
  fieldOfStudy: z.string().min(1, "Domeniul de studiu este obligatoriu"),
  startDate: z.string().min(1, "Data de început este obligatorie"),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

type EducationFormValues = z.infer<typeof educationSchema>;

interface EducationFormProps {
  education?: Education;
  onClose?: () => void;
}

export function EducationForm({ education, onClose }: EducationFormProps) {
  const [isOpen, setIsOpen] = useState(!education);
  const { toast } = useToast();
  const isEditing = !!education;

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: education?.institution || "",
      degree: education?.degree || "",
      fieldOfStudy: education?.fieldOfStudy || "",
      startDate: education?.startDate ? new Date(education.startDate).toISOString().split('T')[0] : "",
      endDate: education?.endDate ? new Date(education.endDate).toISOString().split('T')[0] : "",
      description: education?.description || "",
    },
  });

  async function onSubmit(data: EducationFormValues) {
    try {
      if (isEditing && education) {
        await updateEducation(education.id, data);
        toast({
          title: "Educație actualizată",
          description: "Înregistrarea educațională a fost actualizată cu succes.",
        });
      } else {
        await addEducation(data);
        toast({
          title: "Educație adăugată",
          description: "Noua înregistrare educațională a fost adăugată cu succes.",
        });
      }
      form.reset();
      setIsOpen(false);
      if (onClose) onClose();
    } catch (error) {
      toast({
        title: "Eroare",
        description: "A apărut o eroare la salvarea înregistrării educaționale.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>{isEditing ? "Editează educația" : "Adaugă educație"}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editează educația" : "Adaugă educație nouă"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instituție</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: Universitatea din București" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="degree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diplomă</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: Licență, Masterat, Doctorat" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fieldOfStudy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domeniu de studiu</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: Informatică, Economie, Drept" {...field} />
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
                  <FormLabel>Descriere (opțional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descrie realizările sau cursurile relevante" {...field} />
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