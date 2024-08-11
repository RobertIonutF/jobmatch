'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { addSkill, updateSkill } from "../actions/skill-actions";
import { Skill, SkillLevel } from "@prisma/client";

const skillSchema = z.object({
  name: z.string().min(1, "Numele competenței este obligatoriu"),
  level: z.nativeEnum(SkillLevel),
});

type SkillFormValues = z.infer<typeof skillSchema>;

interface SkillFormProps {
  skill?: Skill;
  onClose?: () => void;
}

export function SkillForm({ skill, onClose }: SkillFormProps) {
  const [isOpen, setIsOpen] = useState(!skill);
  const { toast } = useToast();
  const isEditing = !!skill;

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: skill?.name || "",
      level: skill?.level || SkillLevel.BEGINNER,
    },
  });

  async function onSubmit(data: SkillFormValues) {
    try {
      if (isEditing && skill) {
        await updateSkill(skill.id, data);
        toast({
          title: "Competență actualizată",
          description: "Competența a fost actualizată cu succes.",
        });
      } else {
        await addSkill(data);
        toast({
          title: "Competență adăugată",
          description: "Noua competență a fost adăugată cu succes.",
        });
      }
      form.reset();
      setIsOpen(false);
      if (onClose) onClose();
    } catch (error) {
      toast({
        title: "Eroare",
        description: "A apărut o eroare la salvarea competenței.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>{isEditing ? "Editează competența" : "Adaugă competență"}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editează competența" : "Adaugă competență nouă"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nume competență</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: JavaScript, Management, Design" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nivel</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează nivelul competenței" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={SkillLevel.BEGINNER}>Începător</SelectItem>
                      <SelectItem value={SkillLevel.INTERMEDIATE}>Intermediar</SelectItem>
                      <SelectItem value={SkillLevel.ADVANCED}>Avansat</SelectItem>
                      <SelectItem value={SkillLevel.EXPERT}>Expert</SelectItem>
                    </SelectContent>
                  </Select>
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